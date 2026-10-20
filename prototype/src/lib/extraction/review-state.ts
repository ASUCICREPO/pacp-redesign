'use client';

import { useSyncExternalStore } from 'react';

import type { PacpMatch } from './matching';

/**
 * What a reviewer did to an extracted record after accepting it.
 *
 * Two kinds of decision live here, and both are additive by design:
 *
 * - **Links.** Pointing an extraction at an existing PACP record must not
 *   discard the extraction. The quoted passage becomes a note on the existing
 *   record, so a year later it is still possible to see why someone decided
 *   the two were the same thing.
 * - **Field moves.** Extraction puts text in the wrong section often enough
 *   that reviewers need to reroute it. The original position keeps a
 *   struck-through placeholder rather than disappearing, so the audit trail
 *   shows what the PDF actually said and where it first landed.
 *
 * localStorage stands in for a backend, as everywhere else in the prototype.
 */
export const REVIEW_STATE_KEY = 'pacp_extraction_review_state';
export const REVIEW_STATE_EVENT = 'pacp:extraction-review-changed';

/** The field sections a reviewer can reroute extracted text into. */
export const FIELD_SECTIONS = [
  'Morphological',
  'Site & Date',
  'Associations',
  'Technological',
  'Bibliography',
  'Discussion',
] as const;

export type FieldSection = (typeof FIELD_SECTIONS)[number];

export interface RecordLink {
  /** The existing PACP record the extraction was judged to be. */
  targetId: string;
  targetName: string;
  targetKind: 'ware' | 'type';
  targetHref: string;
  /** The match that was offered, kept so the reasoning survives the click. */
  matchLabel: string;
  /** The extraction's own text, carried onto the existing record as a note. */
  note: string;
  linkedBy: string;
  linkedAt: string;
}

/**
 * A corrected field value.
 *
 * The extracted text is kept beside the correction, never overwritten: the
 * record has to keep showing what the PDF actually said, or the source trail
 * stops being a source trail.
 */
export interface FieldEdit {
  value: string;
  original: string;
  editedAt: string;
}

export interface FieldMove {
  /** Where the extraction originally put it. */
  from: FieldSection;
  to: FieldSection;
  movedAt: string;
}

export interface ReviewState {
  /** Extracted item id → the existing record it was linked to. */
  links: Record<string, RecordLink>;
  /** Extracted item id → field label → where the reviewer moved it. */
  moves: Record<string, Record<string, FieldMove>>;
  /** Extracted item id → field label → the reviewer's correction. */
  edits: Record<string, Record<string, FieldEdit>>;
}

const EMPTY: ReviewState = { links: {}, moves: {}, edits: {} };

function parse(raw: string | null): ReviewState {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw) as Partial<ReviewState>;
    return {
      links: parsed.links && typeof parsed.links === 'object' ? parsed.links : {},
      moves: parsed.moves && typeof parsed.moves === 'object' ? parsed.moves : {},
      edits: parsed.edits && typeof parsed.edits === 'object' ? parsed.edits : {},
    };
  } catch {
    return EMPTY;
  }
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(REVIEW_STATE_KEY);
  } catch {
    return null;
  }
}

export function readReviewState(): ReviewState {
  if (typeof window === 'undefined') return EMPTY;
  return parse(readRaw());
}

function write(state: ReviewState) {
  try {
    window.localStorage.setItem(REVIEW_STATE_KEY, JSON.stringify(state));
  } catch {
    // Review still works for the session; it just will not be remembered.
  }
  window.dispatchEvent(new Event(REVIEW_STATE_EVENT));
}

/* ── Linking ────────────────────────────────────────────────────────────── */

/**
 * Link an extraction to an existing record.
 *
 * Both survive: no draft is created for the extraction, and the existing
 * record gains a note carrying the quoted passage and the page it came from.
 */
export function linkToExisting(
  itemId: string,
  match: PacpMatch,
  note: string,
  linkedBy: string,
): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  write({
    ...state,
    links: {
      ...state.links,
      [itemId]: {
        targetId: match.id,
        targetName: match.name,
        targetKind: match.kind,
        targetHref: match.href,
        matchLabel: match.label,
        note,
        linkedBy,
        linkedAt: new Date().toISOString(),
      },
    },
  });
}

export function unlink(itemId: string): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  const links = { ...state.links };
  delete links[itemId];
  write({ ...state, links });
}

/* ── Field moves ────────────────────────────────────────────────────────── */

export function moveField(itemId: string, fieldLabel: string, from: FieldSection, to: FieldSection): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  write({
    ...state,
    moves: {
      ...state.moves,
      [itemId]: { ...(state.moves[itemId] ?? {}), [fieldLabel]: { from, to, movedAt: new Date().toISOString() } },
    },
  });
}

/* ── Field edits ────────────────────────────────────────────────────────── */

/** Correct a field. The extracted wording is kept alongside, not replaced. */
export function editField(itemId: string, fieldLabel: string, value: string, original: string): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  write({
    ...state,
    edits: {
      ...state.edits,
      [itemId]: {
        ...(state.edits[itemId] ?? {}),
        [fieldLabel]: {
          value,
          // Re-editing keeps the first original, not the previous correction.
          original: state.edits[itemId]?.[fieldLabel]?.original ?? original,
          editedAt: new Date().toISOString(),
        },
      },
    },
  });
}

/** Put the extracted value back. */
export function undoEdit(itemId: string, fieldLabel: string): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  const forItem = { ...(state.edits[itemId] ?? {}) };
  delete forItem[fieldLabel];
  const edits = { ...state.edits };
  if (Object.keys(forItem).length === 0) delete edits[itemId];
  else edits[itemId] = forItem;
  write({ ...state, edits });
}

/** Undo a single move, in one click. */
export function undoMove(itemId: string, fieldLabel: string): void {
  if (typeof window === 'undefined') return;
  const state = readReviewState();
  const forItem = { ...(state.moves[itemId] ?? {}) };
  delete forItem[fieldLabel];
  const moves = { ...state.moves };
  if (Object.keys(forItem).length === 0) delete moves[itemId];
  else moves[itemId] = forItem;
  write({ ...state, moves });
}

/* ── React binding ──────────────────────────────────────────────────────── */

function subscribe(onChange: () => void): () => void {
  window.addEventListener(REVIEW_STATE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(REVIEW_STATE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;

export function useReviewState(): ReviewState {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  return parse(raw);
}
