/**
 * Data access layer over the JSON mock data in `src/lib/mock-data/`.
 *
 * Everything here is synchronous and in-memory. When a real backend arrives,
 * these signatures are the seam: swap the bodies for fetches and the callers
 * keep working.
 */

import assemblagesJson from './mock-data/assemblages.json';
import bibliographyJson from './mock-data/bibliography.json';
import contributorsJson from './mock-data/contributors.json';
import periodsJson from './mock-data/periods.json';
import petrofabricsJson from './mock-data/petrofabrics.json';
import regionsJson from './mock-data/regions.json';
import sitesJson from './mock-data/sites.json';
import typesJson from './mock-data/types.json';
import waresJson from './mock-data/wares.json';
import vesselsJson from './mock-data/vessels.json';

import type {
  Assemblage,
  BibliographyEntry,
  CeramicType,
  Contributor,
  EntityType,
  Period,
  PetroFabric,
  Region,
  SearchResult,
  Site,
  StewardshipCounts,
  StewardshipStatus,
  Vessel,
  VesselFilters,
  Ware,
} from '@/types/pacp';

export const vessels = vesselsJson as unknown as Vessel[];
export const sites = sitesJson as unknown as Site[];
export const wares = waresJson as unknown as Ware[];
export const ceramicTypes = typesJson as unknown as CeramicType[];
export const petrofabrics = petrofabricsJson as unknown as PetroFabric[];
export const contributors = contributorsJson as unknown as Contributor[];
export const bibliography = bibliographyJson as unknown as BibliographyEntry[];
export const periods = periodsJson as unknown as Period[];
export const regions = regionsJson as unknown as Region[];
export const assemblages = assemblagesJson as unknown as Assemblage[];

/* ── Single-record lookups ──────────────────────────────────────────────── */

export const getVessel = (id: string): Vessel | undefined =>
  vessels.find((v) => v.vessel_id === id || v.registration_number === id);

export const getSite = (id: string): Site | undefined =>
  sites.find((s) => s.site_id === id);

export const getWare = (id: string): Ware | undefined =>
  wares.find((w) => w.ware_id === id);

export const getType = (id: string): CeramicType | undefined =>
  ceramicTypes.find((t) => t.type_id === id);

export const getPetrofabric = (id: string): PetroFabric | undefined =>
  petrofabrics.find((p) => p.petro_fabric_id === id);

export const getContributor = (id: string): Contributor | undefined =>
  contributors.find((c) => c.contributor_id === id);

export const getPeriod = (id: string): Period | undefined =>
  periods.find((p) => p.period_id === id);

export const getRegion = (id: string): Region | undefined =>
  regions.find((r) => r.region_id === id);

export const getAssemblage = (id: string): Assemblage | undefined =>
  assemblages.find((a) => a.assemblage_id === id);

export const getReference = (id: string): BibliographyEntry | undefined =>
  bibliography.find((b) => b.bibliography_id === id);

export const contributorName = (id: string | null | undefined): string => {
  if (!id) return 'Unattributed';
  const c = getContributor(id);
  return c ? `${c.title ? `${c.title} ` : ''}${c.first_name} ${c.last_name}`.trim() : id;
};

/* ── Filtering ──────────────────────────────────────────────────────────── */

const matchesText = (vessel: Vessel, query: string): boolean => {
  const haystack = [
    vessel.registration_number,
    vessel.name_or_label,
    vessel.archaeological_context,
    vessel.country,
    vessel.morphology.shape,
    vessel.morphology.shape_type,
    vessel.morphology.functional_category,
    vessel.technology.decorative_technique,
    vessel.technology.fabric_description_color,
    getSite(vessel.site_id)?.name,
    vessel.ware_id ? getWare(vessel.ware_id)?.name : null,
    vessel.type_id ? getType(vessel.type_id)?.name : null,
    vessel.petro_fabric_id ? getPetrofabric(vessel.petro_fabric_id)?.name : null,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
};

export function getVessels(filters: VesselFilters = {}): Vessel[] {
  return vessels.filter((v) => {
    if (filters.query && !matchesText(v, filters.query)) return false;
    if (filters.site_id && v.site_id !== filters.site_id) return false;
    if (filters.ware_id && v.ware_id !== filters.ware_id) return false;
    if (filters.type_id && v.type_id !== filters.type_id) return false;
    if (filters.petro_fabric_id && v.petro_fabric_id !== filters.petro_fabric_id) return false;
    if (filters.period_id && v.period_id !== filters.period_id) return false;
    if (filters.region_id && v.region_id !== filters.region_id) return false;
    if (filters.country && v.country !== filters.country) return false;
    if (filters.shape && v.morphology.shape !== filters.shape) return false;
    if (
      filters.functional_category &&
      v.morphology.functional_category !== filters.functional_category
    ) {
      return false;
    }
    if (filters.stewardship_status) {
      const allowed = Array.isArray(filters.stewardship_status)
        ? filters.stewardship_status
        : [filters.stewardship_status];
      if (!allowed.includes(v.stewardship_status)) return false;
    }
    if (filters.missing_type && v.type_id) return false;
    if (filters.missing_petrofabric && v.petro_fabric_id) return false;
    if (filters.missing_images && v.images.length > 0) return false;
    if (filters.has_alternate_interpretations && v.alternate_interpretations.length === 0) {
      return false;
    }
    return true;
  });
}

/* ── Search ─────────────────────────────────────────────────────────────── */

/**
 * Forgiving substring match with a light typo tolerance.
 *
 * Deliberately simple: the Identify-a-Sherd workflow document is explicit that
 * matching should start as exact/partial field comparison, not scoring models
 * or ML. Results report `matched_fields` so a user can see why something came
 * back rather than trusting an opaque rank.
 */
function fieldScore(value: string | null | undefined, term: string): number {
  if (!value) return 0;
  const haystack = value.toLowerCase();
  if (haystack === term) return 3;
  if (haystack.startsWith(term)) return 2;
  if (haystack.includes(term)) return 1.5;
  // One-character slack for short terms, so "polycrome" still finds "polychrome".
  if (term.length >= 5) {
    for (let i = 0; i < term.length; i++) {
      if (haystack.includes(term.slice(0, i) + term.slice(i + 1))) return 0.75;
    }
  }
  return 0;
}

interface Searchable {
  entity_type: EntityType;
  id: string;
  title: string;
  subtitle: string | null;
  fields: Record<string, string | null | undefined>;
  record: unknown;
}

function searchables(): Searchable[] {
  return [
    ...vessels.map((v) => ({
      entity_type: 'vessel' as const,
      id: v.vessel_id,
      title: v.name_or_label,
      subtitle: [getSite(v.site_id)?.name, v.date_bce_ce].filter(Boolean).join(' · ') || null,
      fields: {
        name: v.name_or_label,
        registration_number: v.registration_number,
        shape: v.morphology.shape,
        functional_category: v.morphology.functional_category,
        decoration: v.technology.decorative_technique,
        fabric: v.technology.fabric_description_color,
        site: getSite(v.site_id)?.name,
        ware: v.ware_id ? getWare(v.ware_id)?.name : null,
        type: v.type_id ? getType(v.type_id)?.name : null,
        context: v.archaeological_context,
        country: v.country,
      },
      record: v,
    })),
    ...sites.map((s) => ({
      entity_type: 'site' as const,
      id: s.site_id,
      title: s.name,
      subtitle: [s.country, s.date_bce_ce].filter(Boolean).join(' · ') || null,
      fields: {
        name: s.name,
        alternate_names: s.alt_site_name.join(' '),
        country: s.country,
        site_type: s.site_type,
        description: s.description,
        local_geology: s.local_geology,
      },
      record: s,
    })),
    ...wares.map((w) => ({
      entity_type: 'ware' as const,
      id: w.ware_id,
      title: w.name,
      subtitle: w.date_bce_ce,
      fields: {
        name: w.name,
        alternate_names: w.alt_ware_name.join(' '),
        description: w.description,
      },
      record: w,
    })),
    ...ceramicTypes.map((t) => ({
      entity_type: 'type' as const,
      id: t.type_id,
      title: t.name,
      subtitle: [t.ware_id ? getWare(t.ware_id)?.name : null, t.date_bce_ce]
        .filter(Boolean)
        .join(' · '),
      fields: {
        name: t.name,
        alternate_names: t.alt_type_name.join(' '),
        description: t.description,
        ware: t.ware_id ? getWare(t.ware_id)?.name : null,
      },
      record: t,
    })),
    ...petrofabrics.map((p) => ({
      entity_type: 'petrofabric' as const,
      id: p.petro_fabric_id,
      title: p.name,
      subtitle: p.geological_formation,
      fields: {
        name: p.name,
        description: p.description,
        inclusion_kind: p.inclusion_kind,
        raw_material: p.raw_material,
        geological_formation: p.geological_formation,
      },
      record: p,
    })),
    ...contributors.map((c) => ({
      entity_type: 'contributor' as const,
      id: c.contributor_id,
      title: `${c.first_name} ${c.last_name}`,
      subtitle: c.affiliation,
      fields: {
        name: `${c.first_name} ${c.last_name}`,
        affiliation: c.affiliation,
        expertise: c.expertise_tags.join(' '),
        bio: c.bio,
      },
      record: c,
    })),
    ...assemblages.map((a) => ({
      entity_type: 'assemblage' as const,
      id: a.assemblage_id,
      title: a.name,
      subtitle: getSite(a.site_id)?.name ?? null,
      fields: { name: a.name, context: a.site_context, notes: a.notes },
      record: a,
    })),
    ...bibliography.map((b) => ({
      entity_type: 'bibliography' as const,
      id: b.bibliography_id,
      title: b.title,
      subtitle: `${b.authors[0]} ${b.year}`,
      fields: { title: b.title, authors: b.authors.join(' '), publisher: b.publisher },
      record: b,
    })),
  ];
}

export function searchRecords<T = unknown>(
  query: string,
  entityType?: EntityType | EntityType[],
): SearchResult<T>[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];

  const allowed = entityType
    ? new Set(Array.isArray(entityType) ? entityType : [entityType])
    : null;

  const results: SearchResult<T>[] = [];
  for (const item of searchables()) {
    if (allowed && !allowed.has(item.entity_type)) continue;

    let score = 0;
    const matched = new Set<string>();
    for (const term of terms) {
      let best = 0;
      for (const [field, value] of Object.entries(item.fields)) {
        const s = fieldScore(value, term);
        if (s > 0) matched.add(field);
        best = Math.max(best, s);
      }
      // Every term must land somewhere, so results stay defensible.
      if (best === 0) {
        score = 0;
        break;
      }
      score += best;
    }
    if (score > 0) {
      results.push({
        entity_type: item.entity_type,
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        matched_fields: [...matched],
        score: Number(score.toFixed(2)),
        record: item.record as T,
      });
    }
  }
  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
}

/* ── Comparison support ─────────────────────────────────────────────────── */

/**
 * Vessels that share a type, ware, petro-fabric or site with the given vessel.
 *
 * This backs "This is close" in the Identify-a-Sherd workflow: shared type is
 * the strongest signal, then ware, then fabric, then site. Nothing here claims
 * the matches are the same thing — only that they are worth comparing.
 */
export function getSimilarVessels(vesselId: string, limit = 8): Vessel[] {
  const target = getVessel(vesselId);
  if (!target) return [];

  const scored = vessels
    .filter((v) => v.vessel_id !== target.vessel_id)
    .map((v) => {
      let score = 0;
      const shared: string[] = [];
      if (target.type_id && v.type_id === target.type_id) {
        score += 4;
        shared.push('type');
      }
      if (target.ware_id && v.ware_id === target.ware_id) {
        score += 3;
        shared.push('ware');
      }
      if (target.petro_fabric_id && v.petro_fabric_id === target.petro_fabric_id) {
        score += 2;
        shared.push('petro-fabric');
      }
      if (v.site_id === target.site_id) {
        score += 1.5;
        shared.push('site');
      }
      if (v.morphology.shape === target.morphology.shape) {
        score += 1;
        shared.push('shape');
      }
      if (v.period_id && v.period_id === target.period_id) {
        score += 0.5;
        shared.push('period');
      }
      return { vessel: v, score, shared };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.vessel);
}

/* ── Stewardship ────────────────────────────────────────────────────────── */

export function getStewardshipCounts(records: Vessel[] = vessels): StewardshipCounts {
  const counts: StewardshipCounts = {
    draft: 0,
    needs_review: 0,
    community_reviewed: 0,
    stewarded: 0,
  };
  for (const v of records) counts[v.stewardship_status] += 1;
  return counts;
}

/** Records with gaps worth filling — the source for homepage task cards. */
export function getTaskQueues() {
  return {
    needsIdentification: getVessels({ missing_type: true }),
    needsReview: getVessels({ stewardship_status: 'needs_review' }),
    missingPetrofabric: getVessels({ missing_petrofabric: true }),
    missingImages: getVessels({ missing_images: true }),
    contestedRecords: getVessels({ has_alternate_interpretations: true }),
  };
}

export const STEWARDSHIP_ORDER: StewardshipStatus[] = [
  'draft',
  'needs_review',
  'community_reviewed',
  'stewarded',
];
