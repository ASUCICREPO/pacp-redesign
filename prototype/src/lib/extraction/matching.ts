import {
  ceramicTypes,
  getPeriod,
  getRegion,
  getWare,
  vessels,
  wares,
} from '@/lib/data';
import type { StewardshipStatus } from '@/types/pacp';

import type { ExtractedItem } from './types';

/**
 * Does this extracted ware or type already exist in PACP?
 *
 * Stakeholder feedback, 3 October: an extraction that proposes "Gila Plain"
 * when PACP already holds a Gila Plain record should say so, rather than
 * quietly creating a second one. Duplicates are the expensive mistake in a
 * shared type library — they split the evidence for a type across two records
 * and nobody notices for a year.
 *
 * The match is a suggestion, never a decision: the reviewer sees why it was
 * proposed and can always create a new record anyway.
 */

/** Status badge ids as the prototype's StatusBadge expects them. */
export type BadgeStatus = 'draft' | 'needs-review' | 'community-reviewed' | 'stewarded';

export interface PacpMatch {
  id: string;
  kind: 'ware' | 'type';
  name: string;
  /** For a type, the ware it belongs to; for a ware, its own name. */
  wareFamily: string;
  status: BadgeStatus;
  /** Why it is being offered, in the reviewer's words. */
  label: string;
  strength: 'strong' | 'moderate';
  score: number;
  /** Opened in a new tab so the reviewer can check before linking. */
  href: string;
  context: string;
}

/* ── Name similarity ────────────────────────────────────────────────────── */

/**
 * Words that describe nearly every ceramic type and so distinguish nothing.
 *
 * "Plain" matching "Plain" is not evidence; "Sacaton" matching "Sacaton" is.
 */
const GENERIC_TOKENS = new Set([
  'plain', 'red', 'buff', 'brown', 'gray', 'grey', 'black', 'white', 'orange',
  'ware', 'wares', 'type', 'types', 'variety', 'polychrome', 'bichrome',
  'trichrome', 'slipped', 'smudged', 'corrugated', 'painted', 'on',
]);

const tokens = (name: string): string[] =>
  name
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);

/**
 * 0–1, weighting distinctive words far above generic ones.
 *
 * Two types sharing only "Plain" land near the floor; two sharing a place or
 * phase name land near the ceiling.
 */
function nameSimilarity(a: string, b: string): { score: number; shared: string[] } {
  const left = tokens(a);
  const right = new Set(tokens(b));
  if (left.length === 0 || right.size === 0) return { score: 0, shared: [] };

  const weight = (token: string) => (GENERIC_TOKENS.has(token) ? 0.15 : 1);
  let matched = 0;
  let total = 0;
  const shared: string[] = [];
  for (const token of left) {
    total += weight(token);
    if (right.has(token)) {
      matched += weight(token);
      shared.push(token);
    }
  }
  // Scale by how much of the existing name was covered too, so a one-word
  // query does not score full marks against a four-word record.
  const coverage = shared.length / Math.max(left.length, right.size);
  return { score: total === 0 ? 0 : (matched / total) * 0.75 + coverage * 0.25, shared };
}

/* ── Period and region overlap ──────────────────────────────────────────── */

const yearsIn = (text: string): number[] => {
  const years: number[] = [];
  for (const match of text.matchAll(/(\d{3,4})\s*(bce|bc|ce|ad)?/gi)) {
    const value = Number(match[1]);
    const bce = /^b/i.test(match[2] ?? '');
    years.push(bce ? -value : value);
  }
  return years;
};

/**
 * All the text bearing on where and when the item belongs.
 *
 * The report it came from counts: a type pulled from a Phoenix Basin
 * monograph is a Phoenix Basin type even when its own row never says so.
 */
const itemContext = (item: ExtractedItem, documentContext: string): string =>
  [item.title, item.subtitle ?? '', ...item.fields.map((f) => `${f.label} ${f.value}`), item.quote, documentContext]
    .join(' ')
    .toLowerCase();

function periodsOverlap(context: string, start: number | null, end: number | null): boolean {
  if (start == null || end == null) return false;
  const years = yearsIn(context);
  return years.some((year) => year >= start - 150 && year <= end + 150);
}

function regionMentioned(context: string, regionId: string | null | undefined): boolean {
  const region = regionId ? getRegion(regionId) : null;
  if (!region) return false;
  return [region.name, region.subregion, region.country]
    .filter(Boolean)
    .some((place) => context.includes(String(place).toLowerCase()));
}

/* ── Stewardship of the existing record ─────────────────────────────────── */

const BADGE: Record<StewardshipStatus, BadgeStatus> = {
  draft: 'draft',
  needs_review: 'needs-review',
  community_reviewed: 'community-reviewed',
  stewarded: 'stewarded',
};

const RANK: StewardshipStatus[] = ['draft', 'needs_review', 'community_reviewed', 'stewarded'];

/**
 * The record's own stewardship status, or — for an older record that predates
 * the field — the furthest any vessel using it has been reviewed.
 */
function statusFor(
  own: StewardshipStatus | undefined,
  predicate: (v: (typeof vessels)[number]) => boolean,
): BadgeStatus {
  if (own) return BADGE[own];
  const linked = vessels.filter(predicate);
  if (linked.length === 0) return 'draft';
  const best = linked.reduce<StewardshipStatus>(
    (acc, v) => (RANK.indexOf(v.stewardship_status) > RANK.indexOf(acc) ? v.stewardship_status : acc),
    'draft',
  );
  return BADGE[best];
}

/* ── The match ──────────────────────────────────────────────────────────── */

/** Below this, the names have nothing in common worth showing. */
const FLOOR = 0.3;

interface Candidate {
  id: string;
  kind: 'ware' | 'type';
  name: string;
  altNames: string[];
  wareFamily: string;
  regionId: string | null;
  periodId: string | null;
  start: number | null;
  end: number | null;
  dates: string;
  status: BadgeStatus;
}

function candidates(): Candidate[] {
  return [
    ...ceramicTypes.map((type) => ({
      id: type.type_id,
      kind: 'type' as const,
      name: type.name,
      altNames: type.alt_type_name ?? [],
      wareFamily: (type.ware_id ? getWare(type.ware_id)?.name : null) ?? 'No ware family',
      regionId: type.region_id ?? null,
      periodId: type.period_id ?? null,
      start: type.date_range_start ?? null,
      end: type.date_range_end ?? null,
      dates: type.date_bce_ce ?? '',
      status: statusFor(type.stewardship_status, (v) => v.type_id === type.type_id),
    })),
    ...wares.map((ware) => ({
      id: ware.ware_id,
      kind: 'ware' as const,
      name: ware.name,
      altNames: ware.alt_ware_name ?? [],
      wareFamily: ware.name,
      regionId: ware.region_id ?? null,
      periodId: ware.period_id ?? null,
      start: ware.date_range_start ?? null,
      end: ware.date_range_end ?? null,
      dates: ware.date_bce_ce ?? '',
      status: statusFor(ware.stewardship_status, (v) => v.ware_id === ware.ware_id),
    })),
  ];
}

/** Only ware and type extractions can duplicate an existing type-library record. */
export const canMatch = (item: ExtractedItem): boolean => item.kind === 'ceramic_type';

/**
 * Up to `limit` existing records this extraction may already be, best first.
 *
 * "Strong" means the name matches and the period or region agrees. "Moderate"
 * means the name alone — which is exactly when a reviewer needs to look.
 */
export function findMatches(
  item: ExtractedItem,
  { documentContext = '', limit = 3 }: { documentContext?: string; limit?: number } = {},
): PacpMatch[] {
  if (!canMatch(item)) return [];
  const context = itemContext(item, documentContext);

  return candidates()
    .map((candidate) => {
      const best = [candidate.name, ...candidate.altNames]
        .map((name) => nameSimilarity(item.title, name))
        .reduce((a, b) => (b.score > a.score ? b : a), { score: 0, shared: [] as string[] });
      if (best.score < FLOOR) return null;

      const period = periodsOverlap(context, candidate.start, candidate.end);
      const region = regionMentioned(context, candidate.regionId);
      const distinctive = best.shared.some((token) => !GENERIC_TOKENS.has(token));
      const strong = distinctive && (period || region);

      const agrees = [period ? 'period' : null, region ? 'region' : null].filter(Boolean).join(' and ');
      const periodName = candidate.periodId ? getPeriod(candidate.periodId)?.term : null;
      const regionName = candidate.regionId ? getRegion(candidate.regionId)?.name : null;

      return {
        id: candidate.id,
        kind: candidate.kind,
        name: candidate.name,
        wareFamily: candidate.wareFamily,
        status: candidate.status,
        strength: strong ? ('strong' as const) : ('moderate' as const),
        label: strong ? `Strong match — name and ${agrees} align` : 'Moderate match — name only',
        score: best.score + (period ? 0.4 : 0) + (region ? 0.3 : 0),
        href: `/browse?category=${candidate.kind === 'type' ? 'Types' : 'Wares'}&name=${encodeURIComponent(candidate.name)}`,
        context: [regionName, periodName, candidate.dates].filter(Boolean).join(' · '),
      };
    })
    .filter((match): match is PacpMatch => match !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
