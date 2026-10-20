/**
 * Shared types for AI-assisted PDF extraction.
 *
 * Deliberately free of server-only imports so the client, the API route and
 * the demo builder script can all use it.
 *
 * The central rule, from the scope document's out-of-scope list — "automated
 * authoritative interpretation or replacement of expert review" — is encoded
 * here: an `ExtractedItem` is a *candidate*. It only becomes a PACP record when
 * a person accepts it, and even then it lands as a Draft.
 */

import type { ConfidenceLevel } from '@/types/pacp';

/** The record kinds extraction can propose. Each maps onto an ERD entity. */
export type ItemKind =
  | 'vessel'
  | 'ceramic_type'
  | 'site'
  | 'petrographic_sample'
  | 'assemblage_count'
  | 'reference';

/**
 * Whether the quoted passage could be found in the PDF's text layer.
 *
 * - `verified`   — the quote appears on a cited page.
 * - `partial`    — its words are there, but not in order. Typical of tables,
 *                  whose text layers scramble column order.
 * - `unverified` — could not be matched. The item may still be right (a scan,
 *                  a figure), but a person needs to check the page.
 */
export type Verification = 'verified' | 'partial' | 'unverified';

export type ReviewDecision = 'pending' | 'accepted' | 'rejected';

/** A deterministic check run on extracted values, e.g. table totals reconciling. */
export interface ConsistencyCheck {
  label: string;
  ok: boolean;
  detail: string;
}

export interface ExtractedField {
  label: string;
  value: string;
}

export interface ExtractedItem {
  id: string;
  kind: ItemKind;
  title: string;
  subtitle: string | null;
  fields: ExtractedField[];
  /** Page numbers in the original PDF, 1-indexed, as a PDF viewer shows them. */
  pages: number[];
  /** Short verbatim passage the item was read from. */
  quote: string;
  /** Tops out at "probable" — PACP never claims certainty. */
  confidence: Exclude<ConfidenceLevel, 'insufficient evidence'>;
  /** Why this was extracted. Shown in full to graduate students. */
  reasoning: string;
  verification: Verification;
  checks: ConsistencyCheck[];
}

export interface DocumentMeta {
  fileName: string;
  title: string;
  totalPages: number;
  pageRange: [number, number];
}

/** One brief per role, so switching views never needs another model call. */
export interface RoleBriefs {
  crm_archaeologist: string;
  graduate_student: string;
  undergraduate_student: string;
}

export interface ExtractionUsage {
  inputTokens: number;
  outputTokens: number;
  /** At published Claude Opus 5 list prices. */
  estimatedCostUsd: number;
}

/** Newline-delimited JSON events streamed from `POST /api/extract`. */
export type ExtractionEvent =
  | { type: 'plan'; document: DocumentMeta; chunks: Array<[number, number]> }
  | { type: 'chunk_start'; index: number; pages: [number, number] }
  | { type: 'items'; index: number; items: ExtractedItem[] }
  | { type: 'chunk_done'; index: number }
  | { type: 'chunk_error'; index: number; pages: [number, number]; message: string }
  | { type: 'briefs'; briefs: RoleBriefs }
  | { type: 'done'; usage: ExtractionUsage | null }
  | { type: 'fatal'; message: string };

export const ITEM_KIND_META: Record<ItemKind, { label: string; plural: string; erdEntity: string }> = {
  vessel: { label: 'Vessel', plural: 'Vessels', erdEntity: 'Vessel' },
  ceramic_type: { label: 'Ware or type', plural: 'Wares & types', erdEntity: 'Type / Ware' },
  site: { label: 'Site', plural: 'Sites', erdEntity: 'Site' },
  petrographic_sample: {
    label: 'Petrographic sample',
    plural: 'Petrographic samples',
    erdEntity: 'Petrographic Sample',
  },
  assemblage_count: { label: 'Assemblage count', plural: 'Assemblage counts', erdEntity: 'Assemblage' },
  reference: { label: 'Reference', plural: 'References', erdEntity: 'Bibliography' },
};
