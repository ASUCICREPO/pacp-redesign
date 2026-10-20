'use client';

import { useCallback, useReducer, useRef } from 'react';

import demoData from './demo/pueblo-grande.json';
import type {
  DocumentMeta,
  ExtractedItem,
  ExtractionEvent,
  ExtractionUsage,
  ReviewDecision,
  RoleBriefs,
} from './types';

/**
 * Client state for one extraction run, live or demo.
 *
 * Both modes feed the same reducer with the same events, which is what keeps
 * the review UI identical regardless of where results came from.
 */

export type ChunkStatus = 'queued' | 'running' | 'done' | 'error';
export type RunMode = 'demo' | 'live';

export interface ExtractionState {
  phase: 'idle' | 'running' | 'finished' | 'failed';
  mode: RunMode | null;
  document: DocumentMeta | null;
  citation: string | null;
  chunks: Array<{ pages: [number, number]; status: ChunkStatus; error?: string }>;
  items: ExtractedItem[];
  decisions: Record<string, ReviewDecision>;
  briefs: RoleBriefs | null;
  usage: ExtractionUsage | null;
  fatal: string | null;
}

type Action =
  | { type: 'start'; mode: RunMode }
  | { type: 'event'; event: ExtractionEvent }
  | { type: 'citation'; citation: string | null }
  | { type: 'decide'; ids: string[]; decision: ReviewDecision }
  | { type: 'fail'; message: string }
  | { type: 'reset' };

const initial: ExtractionState = {
  phase: 'idle',
  mode: null,
  document: null,
  citation: null,
  chunks: [],
  items: [],
  decisions: {},
  briefs: null,
  usage: null,
  fatal: null,
};

function reducer(state: ExtractionState, action: Action): ExtractionState {
  switch (action.type) {
    case 'reset':
      return initial;
    case 'start':
      return { ...initial, phase: 'running', mode: action.mode };
    case 'citation':
      return { ...state, citation: action.citation };
    case 'fail':
      return { ...state, phase: 'failed', fatal: action.message };
    case 'decide': {
      const decisions = { ...state.decisions };
      for (const id of action.ids) decisions[id] = action.decision;
      return { ...state, decisions };
    }
    case 'event': {
      const e = action.event;
      switch (e.type) {
        case 'plan':
          return {
            ...state,
            document: e.document,
            chunks: e.chunks.map((pages) => ({ pages, status: 'queued' as const })),
          };
        case 'chunk_start':
          return { ...state, chunks: updateChunk(state.chunks, e.index, { status: 'running' }) };
        case 'items':
          return { ...state, items: [...state.items, ...e.items] };
        case 'chunk_done':
          return { ...state, chunks: updateChunk(state.chunks, e.index, { status: 'done' }) };
        case 'chunk_error':
          return {
            ...state,
            chunks: updateChunk(state.chunks, e.index, { status: 'error', error: e.message }),
          };
        case 'briefs':
          return { ...state, briefs: e.briefs };
        case 'done':
          return { ...state, phase: 'finished', usage: e.usage };
        case 'fatal':
          return { ...state, phase: 'failed', fatal: e.message };
      }
    }
  }
}

function updateChunk(
  chunks: ExtractionState['chunks'],
  index: number,
  patch: Partial<ExtractionState['chunks'][number]>,
) {
  return chunks.map((c, i) => (i === index ? { ...c, ...patch } : c));
}

export function useExtraction() {
  const [state, dispatch] = useReducer(reducer, initial);
  const abortRef = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const reset = useCallback(() => {
    cancel();
    dispatch({ type: 'reset' });
  }, [cancel]);

  /** Replay the bundled Pueblo Grande results with realistic pacing. */
  const runDemo = useCallback(async () => {
    cancel();
    const controller = new AbortController();
    abortRef.current = controller;
    dispatch({ type: 'start', mode: 'demo' });

    const data = demoData as unknown as {
      document: DocumentMeta;
      citation: string;
      chunks: Array<[number, number]>;
      items: ExtractedItem[];
      briefs: RoleBriefs;
    };
    dispatch({ type: 'citation', citation: data.citation });

    const emit = (event: ExtractionEvent) => {
      if (!controller.signal.aborted) dispatch({ type: 'event', event });
    };
    const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    emit({ type: 'plan', document: data.document, chunks: data.chunks });
    for (let index = 0; index < data.chunks.length; index++) {
      if (controller.signal.aborted) return;
      emit({ type: 'chunk_start', index, pages: data.chunks[index] });
      await pause(140);
      const items = data.items.filter((item) => item.id.startsWith(`c${index}-`));
      if (items.length) emit({ type: 'items', index, items });
      emit({ type: 'chunk_done', index });
    }
    emit({ type: 'briefs', briefs: data.briefs });
    emit({ type: 'done', usage: null });
  }, [cancel]);

  /** Send a PDF to /api/extract and apply streamed events as they arrive. */
  const runLive = useCallback(
    async (file: File, pageRange?: [number, number]) => {
      cancel();
      const controller = new AbortController();
      abortRef.current = controller;
      dispatch({ type: 'start', mode: 'live' });

      const body = new FormData();
      body.append('file', file);
      if (pageRange) {
        body.append('fromPage', String(pageRange[0]));
        body.append('toPage', String(pageRange[1]));
      }

      try {
        const response = await fetch('/api/extract', {
          method: 'POST',
          body,
          signal: controller.signal,
        });
        if (!response.ok || !response.body) {
          const detail = await response.json().catch(() => null);
          dispatch({
            type: 'fail',
            message: (detail as { error?: string } | null)?.error ?? `Upload failed (${response.status}).`,
          });
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffered = '';
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffered += decoder.decode(value, { stream: true });
          const lines = buffered.split('\n');
          buffered = lines.pop() ?? '';
          for (const line of lines) {
            if (line.trim()) dispatch({ type: 'event', event: JSON.parse(line) as ExtractionEvent });
          }
        }
        if (buffered.trim()) dispatch({ type: 'event', event: JSON.parse(buffered) as ExtractionEvent });
      } catch (error) {
        if (controller.signal.aborted) return;
        dispatch({
          type: 'fail',
          message: error instanceof Error ? error.message : 'The connection to the extraction service dropped.',
        });
      }
    },
    [cancel],
  );

  const decide = useCallback(
    (ids: string[], decision: ReviewDecision) => dispatch({ type: 'decide', ids, decision }),
    [],
  );

  return { state, runDemo, runLive, cancel, reset, decide };
}

/**
 * Rough per-page cost for Claude Opus 5, for the pre-run estimate only.
 *
 * A PDF page costs its text plus an image (~1.5–3K input tokens), and adaptive
 * thinking adds output. Real spend is reported from token usage after a run.
 */
export const EST_USD_PER_PAGE: [number, number] = [0.015, 0.035];
