import { getPeriod, getRegion } from '@/lib/data';

/**
 * Where else this material is documented.
 *
 * From the 29 September meeting: PACP should be a **linking layer**, not a
 * second copy of everyone else's data. What it stores is metadata — which
 * external resources cover which regions and material, and why you would go
 * there — so a reader can be routed outward instead of PACP paying to
 * duplicate a repository it does not own.
 *
 * The worked example from that discussion is the round trip: identify a type
 * here, follow it to Cyber-SW for its distribution across Arizona, and come
 * back for how it was made.
 *
 * Only the resources themselves are recorded. Per-record deep links need each
 * site's query format and, for several of them, an API key, so this routes to
 * the resource and says what to look for rather than guessing at URLs that
 * would rot or 404.
 */

export interface ExternalResource {
  id: string;
  name: string;
  /** What the resource is for, in one line. */
  description: string;
  /** What PACP would hand off to it — the reason for the link. */
  offers: string;
  url: string;
  /** Regions it covers, by mock-data region id. Empty means any. */
  regionIds: string[];
  /** Countries it covers. Empty means any. */
  countries: string[];
}

export const EXTERNAL_RESOURCES: ExternalResource[] = [
  {
    id: 'cybersw',
    name: 'Cyber-SW',
    description:
      'A synthetic database of archaeological data for the US Southwest and Northwest Mexico, built for querying across projects.',
    offers: 'Distribution of a ceramic type across sites and time — the map PACP does not hold.',
    url: 'https://cybersw.org/',
    regionIds: ['reg-us-phx'],
    countries: ['United States'],
  },
  {
    id: 'tdar',
    name: 'tDAR (the Digital Archaeological Record)',
    description: 'A repository for archaeological reports, datasets and documents, curated by Digital Antiquity at ASU.',
    offers: 'The full grey-literature report behind an extracted record, with its own citation and DOI.',
    url: 'https://core.tdar.org/',
    regionIds: [],
    countries: [],
  },
  {
    id: 'opencontext',
    name: 'Open Context',
    description: 'Peer-reviewed, open archaeological data published at item level with stable identifiers.',
    offers: 'Excavation-level context and finds data for sites that have published there.',
    url: 'https://opencontext.org/',
    regionIds: [],
    countries: [],
  },
  {
    id: 'lcp',
    name: 'Levantine Ceramics Project',
    description:
      'The sister project PACP is built from — roughly 60% of its code — covering ceramics of the Levant.',
    offers: 'The comparative model for ware, fabric and petrographic description outside the Americas.',
    url: 'https://www.levantineceramics.org/',
    regionIds: [],
    countries: [],
  },
];

export interface ResourceMatch extends ExternalResource {
  /** Why this one is being offered for this record. */
  because: string;
}

/**
 * Resources worth offering for a record, most specific first.
 *
 * A region-specific resource is listed above the general repositories,
 * because that is the one that answers a question PACP cannot.
 */
export function resourcesFor({
  regionId,
  country,
  periodId,
}: {
  regionId?: string | null;
  country?: string | null;
  periodId?: string | null;
}): ResourceMatch[] {
  const region = regionId ? getRegion(regionId) : null;
  const period = periodId ? getPeriod(periodId) : null;
  const place = region ? `${region.name}, ${region.country}` : (country ?? null);

  const scored = EXTERNAL_RESOURCES.map((resource) => {
    const regionHit = regionId ? resource.regionIds.includes(regionId) : false;
    const countryHit =
      resource.countries.length > 0 &&
      Boolean(country ?? region?.country) &&
      resource.countries.includes((country ?? region?.country) as string);
    const specific = resource.regionIds.length > 0 || resource.countries.length > 0;

    // A resource scoped to somewhere else is not worth offering.
    if (specific && !regionHit && !countryHit) return null;

    return {
      ...resource,
      because: regionHit
        ? `Covers ${place ?? 'this region'}${period ? ` and the ${period.term} period` : ''}`
        : countryHit
          ? `Covers ${country ?? region?.country}`
          : 'Holds material of this kind from across the Americas',
      _rank: regionHit ? 0 : countryHit ? 1 : 2,
    };
  }).filter((r): r is ResourceMatch & { _rank: number } => r !== null);

  return scored
    .sort((a, b) => a._rank - b._rank)
    .map(({ _rank, ...rest }) => {
      void _rank;
      return rest;
    });
}

/** Match on free text when a record carries no region id — e.g. an extraction. */
export function resourcesForText(text: string): ResourceMatch[] {
  const haystack = text.toLowerCase();
  const southwest = ['phoenix', 'arizona', 'hohokam', 'salt-gila', 'gila', 'sonoran', 'southwest'].some((t) =>
    haystack.includes(t),
  );
  return resourcesFor(southwest ? { regionId: 'reg-us-phx', country: 'United States' } : {});
}
