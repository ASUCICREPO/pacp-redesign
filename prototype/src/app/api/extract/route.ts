import { runExtraction } from '@/lib/extraction/pipeline';
import type { ExtractionEvent } from '@/lib/extraction/types';

/**
 * POST /api/extract — multipart form with `file` (PDF) and optional
 * `fromPage` / `toPage`. Streams newline-delimited `ExtractionEvent`s.
 *
 * Streaming is what makes a 489-page report workable: chunks finish over
 * several minutes, and the reviewer can start accepting records from the first
 * one instead of waiting for the whole volume.
 */

// pdf-lib, pdf.js and the Anthropic SDK all need Node APIs.
export const runtime = 'nodejs';
// A full report can run for many minutes. Hosts cap this at their own limit.
export const maxDuration = 800;

/** Files API maximum. The route never buffers beyond this. */
const MAX_BYTES = 500 * 1024 * 1024;

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: 'Expected a multipart form upload.' }, { status: 400 });
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: 'No PDF was uploaded.' }, { status: 400 });
  }
  if (file.type && file.type !== 'application/pdf') {
    return Response.json({ error: 'Only PDF files can be extracted.' }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'PDFs over 500 MB are not supported.' }, { status: 413 });
  }

  const fromPage = Number(form.get('fromPage'));
  const toPage = Number(form.get('toPage'));
  const pageRange: [number, number] | undefined =
    Number.isFinite(fromPage) && fromPage > 0 && Number.isFinite(toPage) && toPage > 0
      ? [fromPage, toPage]
      : undefined;

  const bytes = new Uint8Array(await file.arrayBuffer());
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: ExtractionEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        } catch {
          // The client went away; there is no one left to tell.
        }
      };
      try {
        await runExtraction({
          bytes,
          fileName: file.name,
          pageRange,
          send,
          signal: request.signal,
        });
      } catch (error) {
        send({
          type: 'fatal',
          message: error instanceof Error ? error.message : 'Extraction failed.',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}
