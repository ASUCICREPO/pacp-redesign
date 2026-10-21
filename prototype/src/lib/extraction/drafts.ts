'use client';

import { useSyncExternalStore } from 'react';

import type { StewardshipStatus } from '@/types/pacp';

import type { DocumentMeta, ExtractedItem } from './types';

/**
 * Accepted extractions, saved as Draft records.
 *
 * Accepting an item is a person vouching that it matches the page — not a
 * claim the interpretation is settled — so it always enters PACP as `draft`,
 * with its provenance attached. localStorage stands in for a backend.
 */
export const DRAFTS_KEY = 'pacp_extracted_drafts';

/** Same-tab change signal, so the work-table count updates as you accept. */
export const DRAFTS_EVENT = 'pacp:drafts-changed';

export interface ExtractedDraft {
  item: ExtractedItem;
  /**
   * Starts at `draft` and is promoted by a reviewer. The source trail below
   * travels with it — a stewarded record still says which PDF it came from.
   */
  stewardship_status: StewardshipStatus;
  source: {
    document: DocumentMeta;
    citation: string | null;
    /** How the candidate was produced — kept honest about AI involvement. */
    method: 'ai_assisted' | 'curated_demo' | 'bulk_upload';
    /** For a spreadsheet import, the row it came from. */
    row?: number;
  };
  reviewed_by: string;
  accepted_at: string;
}

export function readDrafts(): ExtractedDraft[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(DRAFTS_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as ExtractedDraft[]) : [];
  } catch {
    return [];
  }
}

function writeDrafts(drafts: ExtractedDraft[]) {
  try {
    window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  } catch {
    // Storage full or blocked. Review state still lives in memory for the session.
  }
  window.dispatchEvent(new Event(DRAFTS_EVENT));
}

/* ── React binding ──────────────────────────────────────────────────────── */

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(DRAFTS_KEY);
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void): () => void {
  window.addEventListener(DRAFTS_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(DRAFTS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;

/** Drafts awaiting review, kept in sync with whatever this tab accepts. */
export function useDrafts(): ExtractedDraft[] {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  try {
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? (parsed as ExtractedDraft[]) : [];
  } catch {
    return [];
  }
}

/** The one a detail page is asked to show. */
export function findDraft(drafts: ExtractedDraft[], itemId: string): ExtractedDraft | undefined {
  return drafts.find((d) => d.item.id === itemId);
}

export function saveDraft(draft: ExtractedDraft) {
  const others = readDrafts().filter((d) => d.item.id !== draft.item.id || d.source.document.fileName !== draft.source.document.fileName);
  writeDrafts([...others, draft]);
}

/** Promote (or demote) a record. Everything else about it is untouched. */
export function setDraftStatus(itemId: string, fileName: string, status: StewardshipStatus) {
  writeDrafts(
    readDrafts().map((d) =>
      d.item.id === itemId && d.source.document.fileName === fileName ? { ...d, stewardship_status: status } : d,
    ),
  );
}

export function removeDraft(itemId: string, fileName: string) {
  writeDrafts(readDrafts().filter((d) => !(d.item.id === itemId && d.source.document.fileName === fileName)));
}
