/**
 * Deterministic checks on model output.
 *
 * Nothing here calls a model. The point is that an archaeologist should not
 * have to take the extraction on trust: quotes are matched against the PDF's
 * own text layer, and tabular counts are re-added.
 *
 * Kept dependency-free so the demo builder script can import it directly.
 */

import type { ConsistencyCheck, Verification } from './types';

/** Collapse the ways a PDF text layer differs from what a model reads visually. */
export function normalizeForMatch(input: string): string {
  return (
    input
      .normalize('NFKC')
      // Rejoin words hyphenated across line breaks: "morph- ology" → "morphology".
      .replace(/(\w)-\s+(\w)/g, '$1$2')
      .replace(/[‘’‛]/g, "'")
      .replace(/[“”‟]/g, '"')
      .replace(/[–—]/g, '-')
      // pdf.js joins adjacent text runs without a space, so table cells come
      // out as "608Civano" or "132Sacaton". Re-separate letters from digits.
      .replace(/(\p{N})(\p{L})/gu, '$1 $2')
      .replace(/(\p{L})(\p{N})/gu, '$1 $2')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim()
  );
}

const tokens = (text: string) =>
  normalizeForMatch(text)
    // Unicode-aware, so "Polvorón" and "Pequeña" stay whole words.
    .split(/[^\p{L}\p{N}.%:<>-]+/u)
    // Keep internal periods ("3.5", "14:84:2") but drop sentence punctuation,
    // or "Types." on the page never matches "Types" in a quote.
    .map((t) => t.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((t) => t.length > 1);

/**
 * Match a quote against the text of the pages it claims to come from.
 *
 * Neighbouring pages are included because passages routinely run across a page
 * break, and a model's page attribution can be off by one at the boundary.
 */
export function verifyQuote(
  quote: string,
  pages: number[],
  pageText: (page: number) => string | undefined,
): Verification {
  const q = normalizeForMatch(quote);
  if (q.length < 8) return 'unverified';

  const candidates = new Set<number>();
  for (const p of pages) for (const n of [p - 1, p, p + 1]) if (n >= 1) candidates.add(n);

  let haystack = '';
  for (const p of [...candidates].sort((a, b) => a - b)) {
    const text = pageText(p);
    if (text) haystack += ` ${text}`;
  }
  const hay = normalizeForMatch(haystack);
  if (!hay) return 'unverified';
  if (hay.includes(q)) return 'verified';

  // Tables: the right words are on the page but the text layer reorders
  // columns, so an exact substring match fails even when the reading is right.
  const quoteTokens = tokens(quote);
  if (quoteTokens.length === 0) return 'unverified';
  const pageTokens = new Set(tokens(haystack));
  const found = quoteTokens.filter((t) => pageTokens.has(t)).length;
  return found / quoteTokens.length >= 0.85 ? 'partial' : 'unverified';
}

/** Re-add category counts and compare with the stated total. */
export function checkTotals(
  counts: Array<{ category: string; count: number }>,
  total: number | null,
): ConsistencyCheck[] {
  if (total === null || counts.length === 0) return [];
  const sum = counts.reduce((acc, c) => acc + c.count, 0);
  const ok = sum === total;
  return [
    {
      label: ok ? 'Totals reconcile' : 'Totals do not reconcile',
      ok,
      detail: ok
        ? `${counts.map((c) => c.count.toLocaleString()).join(' + ')} = ${total.toLocaleString()}`
        : `Categories sum to ${sum.toLocaleString()}, but the stated total is ${total.toLocaleString()}. Either a value was misread or the printed table is itself inconsistent — check the page.`,
    },
  ];
}
