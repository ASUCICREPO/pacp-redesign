import 'server-only';

import Anthropic, { toFile } from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import { PDFDocument } from 'pdf-lib';
import { extractText, getDocumentProxy } from 'unpdf';

import { ChunkExtractionSchema, RoleBriefsSchema } from './schema';
import { chunkToItems } from './to-items';
import type { DocumentMeta, ExtractionEvent, ExtractionUsage } from './types';

/**
 * AI-assisted extraction from a ceramic report PDF.
 *
 * Why the pipeline looks the way it does:
 *
 * - **Pages are sent as a PDF, not as text.** Claude reads each page visually as
 *   well as its text layer. That matters for archaeological reports: their
 *   tables come out of the text layer with columns scrambled (Pueblo Grande's
 *   Table 2.1 interleaves row labels into the numbers), so text-only extraction
 *   would silently corrupt exactly the counts people need.
 * - **Chunked by page range.** A 489-page, 42.9 MB volume exceeds the 32 MB
 *   request limit, so chunks go through the Files API. Chunking also bounds each
 *   response, lets chunks run in parallel, and gives honest progress.
 * - **A chunk that overflows its output budget is split and retried.** A
 *   references chapter can hold hundreds of citations; truncating mid-JSON would
 *   lose them all.
 * - **Every quote is verified afterwards** against the text layer (see verify.ts).
 */

export const EXTRACTION_MODEL = 'claude-opus-5';

/** Claude Opus 5 list prices, USD per million tokens. */
const PRICE_INPUT_PER_MTOK = 5;
const PRICE_OUTPUT_PER_MTOK = 25;

const DEFAULT_CHUNK_PAGES = 20;
const CONCURRENCY = 3;
const MAX_OUTPUT_TOKENS = 64_000;

const SYSTEM_PROMPT = `You help archaeologists pull candidate records out of ceramic analysis reports for the Pan-American Ceramics Project (PACP), a collaborative workspace for comparing ceramic data across the Americas.

PACP treats classification as interpretation, not fact, and everything you extract is reviewed by a person before it becomes a draft record. Your job is to make that review fast and trustworthy, so accuracy and traceability matter more than coverage.

Extract only what the pages state. If the report does not give a value, use null rather than inferring one. Do not assign a ware, type, date or site that the text does not attach to the item, even when you could reasonably guess.

For every item, give the page(s) within this excerpt where it appears — page 1 is the first page of the excerpt, regardless of any printed page numbers — and a short passage copied verbatim from that page so a reviewer can find it. For tables, a reviewer needs to confirm the row, so quote the row label and a few of its values.

Read tables from the page image, not from the order text happens to appear in. Record counts exactly as printed, and record a table's total as printed rather than calculating it; totals are checked separately.

Skip front matter (tables of contents, lists of figures and tables), indexes, and running headers. In a reference list, each entry is one reference; when an author has several works listed under one name, attach the right year and title to each.

Avoid duplicates within the excerpt. When the same site, type or vessel is discussed on several pages, record it once, citing the page where it is described most fully.`;

interface RunOptions {
  bytes: Uint8Array;
  fileName: string;
  pageRange?: [number, number];
  chunkPages?: number;
  send: (event: ExtractionEvent) => void;
  signal?: AbortSignal;
}

export async function runExtraction(opts: RunOptions): Promise<void> {
  const { fileName, send, signal } = opts;
  const client = new Anthropic();
  const usage = { input: 0, output: 0 };

  // Preflight: one free Models API call before any PDF work. Missing
  // credentials, a revoked key or a key without model access would otherwise
  // fail identically on every chunk of a long report.
  try {
    await client.models.retrieve(EXTRACTION_MODEL, {}, { signal });
  } catch (error) {
    send({ type: 'fatal', message: describePreflightError(error) });
    return;
  }

  // pdf.js may detach the buffer it is handed, so give it its own copy.
  const pdfjs = await getDocumentProxy(opts.bytes.slice());
  const { totalPages, text: pageTexts } = await extractText(pdfjs, { mergePages: false });
  const pageText = (page: number) => pageTexts[page - 1];

  const [from, to] = clampRange(opts.pageRange, totalPages);
  const chunkPages = opts.chunkPages ?? DEFAULT_CHUNK_PAGES;
  const chunks: Array<[number, number]> = [];
  for (let start = from; start <= to; start += chunkPages) {
    chunks.push([start, Math.min(start + chunkPages - 1, to)]);
  }

  const document: DocumentMeta = {
    fileName,
    title: fileName.replace(/\.pdf$/i, '').replace(/[_-]+/g, ' '),
    totalPages,
    pageRange: [from, to],
  };
  send({ type: 'plan', document, chunks });

  const source = await PDFDocument.load(opts.bytes, { ignoreEncryption: true });
  const summaries: Array<{ pages: [number, number]; summary: string }> = [];

  const processRange = async (index: number, range: [number, number]): Promise<void> => {
    const [first, last] = range;
    const excerpt = await PDFDocument.create();
    const copied = await excerpt.copyPages(
      source,
      Array.from({ length: last - first + 1 }, (_, i) => first - 1 + i),
    );
    for (const page of copied) excerpt.addPage(page);
    const excerptBytes = await excerpt.save();

    const uploaded = await client.files.upload(
      {
        file: await toFile(Buffer.from(excerptBytes), `pages-${first}-${last}.pdf`, {
          type: 'application/pdf',
        }),
        // Backstop cleanup in case the explicit delete below never runs.
        expires_in_seconds: 3600,
      },
      { signal },
    );

    try {
      const stream = client.beta.messages.stream(
        {
          model: EXTRACTION_MODEL,
          max_tokens: MAX_OUTPUT_TOKENS,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          thinking: { type: 'adaptive' },
          output_config: { effort: 'high', format: betaZodOutputFormat(ChunkExtractionSchema) },
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'document',
                  source: { type: 'file', file_id: uploaded.id },
                  title: document.title,
                  context: `Pages ${first}–${last} of a ${totalPages}-page report.`,
                },
                {
                  type: 'text',
                  text: `Extract candidate PACP records from this excerpt (report pages ${first}–${last}). Remember that excerpt page numbers start at 1.`,
                },
              ],
            },
          ],
        },
        { signal },
      );

      const message = await stream.finalMessage();
      usage.input += message.usage.input_tokens;
      usage.output += message.usage.output_tokens;

      if (message.stop_reason === 'refusal') {
        throw new Error('The model declined to process these pages.');
      }
      if (message.stop_reason === 'max_tokens') {
        // Too much to extract in one response. Split rather than keep a
        // truncated, unparseable result.
        if (first === last) throw new Error('A single page produced more output than one response allows.');
        const mid = Math.floor((first + last) / 2);
        await processRange(index, [first, mid]);
        await processRange(index, [mid + 1, last]);
        return;
      }

      const parsed = message.parsed_output;
      if (!parsed) throw new Error('The response did not match the extraction schema.');

      summaries.push({ pages: range, summary: parsed.excerpt_summary });
      send({
        type: 'items',
        index,
        items: chunkToItems(parsed, { chunkIndex: index, firstPage: first, lastPage: last, pageText }),
      });
    } finally {
      await client.files.delete(uploaded.id).catch(() => {
        /* expires on its own within the hour */
      });
    }
  };

  let next = 0;
  const worker = async () => {
    while (next < chunks.length && !signal?.aborted) {
      const index = next++;
      const range = chunks[index];
      send({ type: 'chunk_start', index, pages: range });
      try {
        await processRange(index, range);
        send({ type: 'chunk_done', index });
      } catch (error) {
        if (error instanceof Anthropic.AuthenticationError) throw error;
        send({ type: 'chunk_error', index, pages: range, message: describeError(error) });
      }
    }
  };

  try {
    await Promise.all(Array.from({ length: Math.min(CONCURRENCY, chunks.length) }, worker));
  } catch (error) {
    send({ type: 'fatal', message: describeError(error) });
    return;
  }

  if (summaries.length > 0 && !signal?.aborted) {
    try {
      const briefs = await client.beta.messages.parse(
        {
          model: EXTRACTION_MODEL,
          max_tokens: 16_000,
          betas: ['server-side-fallback-2026-07-01'],
          fallbacks: 'default',
          thinking: { type: 'adaptive' },
          output_config: { effort: 'medium', format: betaZodOutputFormat(RoleBriefsSchema) },
          messages: [
            {
              role: 'user',
              content: `Below are section summaries of a ceramic analysis report, in page order. Write three short briefs (one paragraph each, under 120 words) describing what this report offers each kind of PACP user:

- crm_archaeologist: practical value under deadline — which types, chronologies, comparative data and citations they could use in a compliance report.
- graduate_student: the research questions, methods and any interpretive debates, and where the reasoning could be examined or contested.
- undergraduate_student: a plain-language explanation of what the report studied and why it matters, defining any unavoidable jargon.

Describe only what the summaries support, and avoid presenting the report's interpretations as settled fact.

${summaries
  .sort((a, b) => a.pages[0] - b.pages[0])
  .map((s) => `Pages ${s.pages[0]}–${s.pages[1]}: ${s.summary}`)
  .join('\n\n')}`,
            },
          ],
        },
        { signal },
      );
      usage.input += briefs.usage.input_tokens;
      usage.output += briefs.usage.output_tokens;
      if (briefs.stop_reason !== 'refusal' && briefs.parsed_output) {
        send({ type: 'briefs', briefs: briefs.parsed_output });
      }
    } catch {
      // Briefs are a convenience; the extracted records stand without them.
    }
  }

  send({ type: 'done', usage: toUsage(usage) });
}

function clampRange(range: [number, number] | undefined, totalPages: number): [number, number] {
  if (!range) return [1, totalPages];
  const from = Math.max(1, Math.min(range[0], totalPages));
  const to = Math.max(from, Math.min(range[1], totalPages));
  return [from, to];
}

function toUsage(u: { input: number; output: number }): ExtractionUsage {
  return {
    inputTokens: u.input,
    outputTokens: u.output,
    estimatedCostUsd:
      (u.input / 1_000_000) * PRICE_INPUT_PER_MTOK + (u.output / 1_000_000) * PRICE_OUTPUT_PER_MTOK,
  };
}

function describePreflightError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'The Anthropic API key was rejected. Check ANTHROPIC_API_KEY in .env.local and restart the dev server.';
  }
  if (error instanceof Anthropic.PermissionDeniedError || error instanceof Anthropic.NotFoundError) {
    return `This API key cannot use ${EXTRACTION_MODEL}. Check the key's workspace and model access.`;
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Could not reach the Anthropic API. Check the network connection and try again.';
  }
  if (error instanceof Anthropic.APIError) return describeError(error);
  // Anything else is thrown before a request is sent — in practice, no
  // credentials could be resolved at all.
  return 'No Anthropic API credentials are configured. Add ANTHROPIC_API_KEY to .env.local and restart the dev server — or try the example report, which needs no key.';
}

function describeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'The Anthropic API key is missing or invalid. Set ANTHROPIC_API_KEY in .env.local and restart the dev server.';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Rate limited by the Anthropic API. Try again shortly, or process a smaller page range.';
  }
  if (error instanceof Anthropic.APIError) {
    return `Anthropic API error ${error.status ?? ''}: ${error.message}`.trim();
  }
  if (error instanceof Error) return error.message;
  return 'Unknown error';
}
