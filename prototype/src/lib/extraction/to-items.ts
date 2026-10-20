import type { ChunkExtraction } from './schema';
import type { ExtractedField, ExtractedItem, ItemKind } from './types';
import { checkTotals, verifyQuote } from './verify';

/**
 * Turn one chunk's structured output into kind-agnostic review items.
 *
 * This is where provenance gets pinned down: excerpt-relative page numbers are
 * mapped to report page numbers, and each quote is checked against the PDF
 * text layer before anyone sees it.
 */
export function chunkToItems(
  chunk: ChunkExtraction,
  opts: {
    chunkIndex: number;
    firstPage: number;
    lastPage: number;
    pageText: (page: number) => string | undefined;
  },
): ExtractedItem[] {
  const { chunkIndex, firstPage, lastPage, pageText } = opts;
  const items: ExtractedItem[] = [];
  let n = 0;

  const toReportPages = (excerptPages: number[]) =>
    [...new Set(excerptPages.map((p) => firstPage + p - 1))]
      // A model can cite a page outside its excerpt; drop those rather than guess.
      .filter((p) => p >= firstPage && p <= lastPage)
      .sort((a, b) => a - b);

  const field = (label: string, value: string | number | null | undefined): ExtractedField[] =>
    value === null || value === undefined || value === '' ? [] : [{ label, value: String(value) }];

  const push = (
    kind: ItemKind,
    source: ChunkExtraction[keyof Omit<ChunkExtraction, 'excerpt_summary'>][number],
    title: string,
    subtitle: string | null,
    fields: ExtractedField[],
    checks: ExtractedItem['checks'] = [],
  ) => {
    const pages = toReportPages(source.excerpt_pages);
    items.push({
      id: `c${chunkIndex}-${kind}-${n++}`,
      kind,
      title,
      subtitle,
      fields,
      pages,
      quote: source.quote,
      confidence: source.confidence,
      reasoning: source.reasoning,
      verification: pages.length ? verifyQuote(source.quote, pages, pageText) : 'unverified',
      checks,
    });
  };

  for (const v of chunk.vessels) {
    push('vessel', v, v.label, [v.form, v.site].filter(Boolean).join(' · ') || null, [
      ...field('Site', v.site),
      ...field('Ware', v.ware),
      ...field('Type / variety', v.type_or_variety),
      ...field('Form', v.form),
      ...field('Date or phase', v.date_or_phase),
      ...field('Notes', v.notes),
    ]);
  }

  for (const t of chunk.ceramic_types) {
    push('ceramic_type', t, t.name, t.parent ? `${t.category} of ${t.parent}` : t.category, [
      ...field('Category', t.category),
      ...field('Belongs to', t.parent),
      ...field('Date or phase', t.date_or_phase),
      ...field('Diagnostic traits', t.diagnostic_traits),
    ]);
  }

  for (const s of chunk.sites) {
    push('site', s, s.name, s.site_number, [
      ...field('Site number', s.site_number),
      ...field('Region', s.region),
      ...field('Periods', s.periods),
      ...field('Notes', s.notes),
    ]);
  }

  for (const p of chunk.petrographic_samples) {
    push('petrographic_sample', p, p.sample_id, p.site, [
      ...field('Site', p.site),
      ...field('Ware / type', p.ware_or_type),
      ...field('Temper or sand zone', p.temper_or_sand_zone),
      ...field('Notes', p.notes),
    ]);
  }

  for (const a of chunk.assemblage_counts) {
    push(
      'assemblage_count',
      a,
      a.context,
      a.table_label,
      [
        ...field('Source table', a.table_label),
        ...a.counts.map((c) => ({ label: c.category, value: c.count.toLocaleString() })),
        ...field('Stated total', a.stated_total?.toLocaleString()),
      ],
      checkTotals(a.counts, a.stated_total),
    );
  }

  for (const r of chunk.references) {
    const authorLine = r.authors.join('; ');
    push('reference', r, r.title, [authorLine, r.year].filter(Boolean).join(' · ') || null, [
      ...field('Authors', authorLine),
      ...field('Year', r.year),
      ...field('Publication', r.publication),
    ]);
  }

  return items;
}
