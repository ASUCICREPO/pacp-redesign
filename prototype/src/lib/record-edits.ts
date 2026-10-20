'use client';

import { useSyncExternalStore } from 'react';

/**
 * Corrections to a record's fields, kept per record.
 *
 * The prototype's record pages were written with their content hard-coded, so
 * the "Edit" button on each section had nothing to write to and did nothing.
 * This is that missing layer: an override per field, stored against the
 * record id, with the original kept beside it so a correction can always be
 * undone and the page can still show what it originally said.
 *
 * localStorage stands in for a backend, as everywhere else in the prototype.
 */
export const RECORD_EDITS_KEY = 'pacp_record_edits';
export const RECORD_EDITS_EVENT = 'pacp:record-edits-changed';

export interface RecordFieldEdit {
  value: string;
  original: string;
  editedAt: string;
}

/** record id → field key → correction. */
export type RecordEdits = Record<string, Record<string, RecordFieldEdit>>;

function parse(raw: string | null): RecordEdits {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as RecordEdits) : {};
  } catch {
    return {};
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(RECORD_EDITS_KEY);
  } catch {
    return null;
  }
}

export function readRecordEdits(): RecordEdits {
  if (typeof window === 'undefined') return {};
  return parse(readRaw());
}

function write(edits: RecordEdits) {
  try {
    window.localStorage.setItem(RECORD_EDITS_KEY, JSON.stringify(edits));
  } catch {
    // The edit still applies for this session; it just will not be remembered.
  }
  window.dispatchEvent(new Event(RECORD_EDITS_EVENT));
}

/** Save a correction. Re-editing keeps the first original, not the last value. */
export function setRecordField(recordId: string, key: string, value: string, original: string): void {
  if (typeof window === 'undefined') return;
  const edits = readRecordEdits();
  const forRecord = edits[recordId] ?? {};
  write({
    ...edits,
    [recordId]: {
      ...forRecord,
      [key]: { value, original: forRecord[key]?.original ?? original, editedAt: new Date().toISOString() },
    },
  });
}

/** Put the published value back. */
export function clearRecordField(recordId: string, key: string): void {
  if (typeof window === 'undefined') return;
  const edits = readRecordEdits();
  const forRecord = { ...(edits[recordId] ?? {}) };
  delete forRecord[key];
  const next = { ...edits };
  if (Object.keys(forRecord).length === 0) delete next[recordId];
  else next[recordId] = forRecord;
  write(next);
}

/** Undo every correction on one record. */
export function clearRecord(recordId: string): void {
  if (typeof window === 'undefined') return;
  const edits = { ...readRecordEdits() };
  delete edits[recordId];
  write(edits);
}

/* ── React binding ──────────────────────────────────────────────────────── */

function subscribe(onChange: () => void): () => void {
  window.addEventListener(RECORD_EDITS_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(RECORD_EDITS_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;

export function useRecordEdits(recordId: string): Record<string, RecordFieldEdit> {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  return parse(raw)[recordId] ?? {};
}
