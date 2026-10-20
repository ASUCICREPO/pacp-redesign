import { regions, sites } from '@/lib/data';

import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';
import { SAMPLE_PETRO_FABRICS } from '../data/SAMPLE_PETRO_FABRICS.js';

/**
 * The search model behind "Find Regional Parallels".
 *
 * The previous version matched a fixed list of words ("red", "bowl",
 * "slipped", "painted") and, when none of them appeared, attached an invented
 * reason to every record so that each query returned the whole database as a
 * "match". That is the opposite of a parallel finder: it never narrows, and it
 * shows evidence the record does not actually carry.
 *
 * Here every match is read off a field the record really has, each match names
 * the field it came from, and a record with nothing in common with the query is
 * simply left out. Region, period and site vocabulary is widened using the
 * project's own controlled lists, so "Zacatecas", "North-Central Mexico" and
 * "Chicomóztoc" all find La Quemada material.
 */

/* ── Vocabulary from the project's controlled lists ─────────────────────── */

const norm = (value) => String(value ?? '').toLowerCase();

/**
 * Text reduced to space-separated words.
 *
 * Matching is done on whole words against this form. Plain substring matching
 * is what made "La Quemada" return thin sections: "la" sits inside
 * "vesicular", and "age" inside "storage".
 */
const canon = (value) => norm(value).replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/** Region record whose name appears in a location string like "La Quemada, Zacatecas, Mexico". */
const regionFor = (location) => {
  const haystack = norm(location);
  return regions.find((r) => haystack.includes(norm(r.name)));
};

/** Site record named by the first part of a location string, or by an explicit site name. */
const siteFor = (name) => {
  const wanted = norm(name);
  if (!wanted) return undefined;
  return sites.find(
    (s) => norm(s.name) === wanted || (s.alt_site_name ?? []).some((alt) => norm(alt) === wanted),
  );
};

/**
 * "La Quemada, Zacatecas, Mexico" → "Zacatecas, Mexico".
 *
 * Gives vessels and thin sections the same region label, so a single facet
 * covers both halves of the results.
 */
const regionLabel = (location) => {
  const parts = String(location ?? '')
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.slice(-2).join(', ');
};

/** "Epiclassic (600-900 CE)" → "Epiclassic"; "Epiclassic Mesoamerican" → "Epiclassic". */
const PERIOD_TERMS = [
  'Bronze Age',
  'Iron Age',
  'Formative',
  'Preclassic',
  'Early Classic',
  'Late Classic',
  'Terminal Classic',
  'Epiclassic',
  'Classic',
  'Early Postclassic',
  'Postclassic',
  'Pueblo I',
  'Pueblo II',
  'Pueblo III',
  'Colonial',
  'Contemporary',
];

const PERIOD_TERMS_BY_LENGTH = [...PERIOD_TERMS].sort((a, b) => b.length - a.length);

const periodLabel = (...candidates) => {
  for (const candidate of candidates) {
    const haystack = ` ${canon(candidate)} `;
    const term = PERIOD_TERMS_BY_LENGTH.find((t) => haystack.includes(` ${canon(t)} `));
    if (term) return term;
  }
  // No named period on the record — fall back to whatever date it does carry.
  const fallback = candidates.find(Boolean);
  return fallback ? String(fallback).replace(/\s*\(.*\)\s*/, '').trim() : '';
};

/** Temper strings vary by record ("volcanic basalt", "crushed sherd"); group them. */
const TEMPER_GROUPS = [
  ['quartz', 'Quartz'],
  ['volcanic', 'Volcanic'],
  ['basalt', 'Volcanic'],
  ['rhyolite', 'Volcanic'],
  ['sand', 'Sand'],
  ['sherd', 'Crushed sherd'],
  ['feldspar', 'Feldspar'],
  ['lithic', 'Lithic fragments'],
];

const temperLabels = (temperTypes = []) => {
  const labels = new Set();
  for (const temper of temperTypes) {
    for (const [needle, label] of TEMPER_GROUPS) {
      if (norm(temper).includes(needle)) labels.add(label);
    }
  }
  return [...labels];
};

const sentenceCase = (value) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

/* ── Records, with the fields each one can be found by ──────────────────── */

/**
 * One searchable record.
 *
 * `fields` is what the query is tested against: a label the card can show, the
 * text to match, and a weight saying how much finding it there means. Place,
 * period and named type carry the most weight because those are what makes a
 * parallel a parallel.
 */
const vesselRecords = () =>
  SAMPLE_ARTIFACTS.map((artifact) => {
    const region = regionFor(artifact.location);
    const site = siteFor(String(artifact.location ?? '').split(',')[0]?.trim());
    const facets = {
      Region: [regionLabel(artifact.location)],
      Period: [periodLabel(artifact.tradition, artifact.period)],
      'Vessel Form': [artifact.type],
    };

    return {
      type: 'vessel',
      id: artifact.id,
      name: artifact.name,
      image: artifact.images.exterior || artifact.images.interior || '',
      ware: artifact.type,
      region: artifact.location,
      period: artifact.period,
      contributor: 'Dr. Sarah Chen',
      facets,
      fields: [
        { field: 'record', text: artifact.name, weight: 5 },
        { field: 'site', text: site?.name ?? String(artifact.location ?? '').split(',')[0], weight: 5 },
        { field: 'site', text: (site?.alt_site_name ?? []).join(' '), weight: 4 },
        { field: 'site type', text: site?.site_type, weight: 2 },
        { field: 'region', text: artifact.location, weight: 5 },
        { field: 'region', text: region ? `${region.name} ${region.subregion} ${region.country}` : '', weight: 4 },
        { field: 'period', text: artifact.tradition, weight: 4 },
        { field: 'date', text: artifact.period, weight: 3 },
        { field: 'vessel form', text: artifact.type, weight: 3 },
      ],
    };
  });

const petrographicRecords = () =>
  SAMPLE_PETRO_FABRICS.map((sample) => {
    const site = siteFor(sample.associatedSite);
    const facets = {
      Region: [regionLabel(sample.region)],
      Period: [periodLabel(sample.period)],
      'Fabric Texture': [sentenceCase(sample.fabricTexture)],
      'Temper Type': temperLabels(sample.temperType),
    };

    return {
      type: 'petrographic',
      id: sample.id,
      sampleCode: sample.sampleCode,
      image: sample.image,
      region: sample.region,
      period: sample.period,
      fabricTexture: sample.fabricTexture,
      matrixColor: sample.matrixColor,
      temperType: sample.temperType,
      contributor: sample.contributor,
      associatedVessel: sample.associatedVessel,
      associatedFabric: sample.associatedFabric,
      facets,
      fields: [
        { field: 'sample', text: sample.sampleCode, weight: 5 },
        { field: 'region', text: sample.region, weight: 5 },
        { field: 'period', text: sample.period, weight: 4 },
        { field: 'site', text: sample.associatedSite, weight: 4 },
        { field: 'site', text: (site?.alt_site_name ?? []).join(' '), weight: 3 },
        { field: 'fabric', text: sample.associatedFabric, weight: 4 },
        { field: 'fabric texture', text: sample.fabricTexture, weight: 3 },
        { field: 'temper type', text: sample.temperType.join(' '), weight: 3 },
        { field: 'matrix color', text: sample.matrixColor, weight: 3 },
        { field: 'inclusion density', text: sample.inclusionDensity, weight: 2 },
        // "Vesicular" is the term people search for; the record stores a flag.
        { field: 'fabric features', text: sample.voids ? 'vesicular voids porous' : '', weight: 2 },
        { field: 'context', text: `${sample.context} ${sample.view}`, weight: 1 },
        { field: 'vessel', text: sample.associatedVessel, weight: 2 },
      ],
    };
  });

export const searchableRecords = () => [...petrographicRecords(), ...vesselRecords()];

/* ── Matching ───────────────────────────────────────────────────────────── */

// Words that carry no distinguishing information in a ceramics query.
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'the', 'with', 'of', 'in', 'on', 'for', 'from', 'to', 'or',
  'possible', 'probable', 'ware', 'wares', 'sherd', 'sherds',
]);

/**
 * Query → the phrases worth looking for.
 *
 * Bigrams come first so "bronze age" and "late classic" are found as units and
 * score once, rather than as two weak words.
 */
const queryTerms = (query) => {
  const typed = String(query ?? '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const words = typed.map((w) => w.toLowerCase());
  const bigrams = [];
  for (let i = 0; i < words.length - 1; i += 1) bigrams.push(`${words[i]} ${words[i + 1]}`);
  // Two letters on their own ("la", "on") match too much to be evidence.
  const singles = words.filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  // A match chip falls back to the term, so show it as the user typed it.
  const asTyped = new Map();
  words.forEach((word, i) => {
    asTyped.set(word, typed[i]);
    if (i < words.length - 1) asTyped.set(bigrams[i], `${typed[i]} ${typed[i + 1]}`);
  });
  return { words, bigrams, singles, asTyped };
};

/** Whole-word match, so a term has to be a word the record actually uses. */
const contains = (haystack, term) => {
  const text = canon(haystack);
  if (!text) return false;
  const padded = ` ${text} `;
  if (padded.includes(` ${term} `)) return true;
  // Tolerate a plural in the query ("vessels" for "vessel").
  return term.endsWith('s') && padded.includes(` ${term.slice(0, -1)} `);
};

/**
 * Score one record against one query.
 *
 * Returns null when nothing in the record matched — an honest "not a parallel"
 * rather than a card claiming a match it cannot support.
 */
export function scoreRecord(record, query) {
  const { bigrams, singles, asTyped } = queryTerms(query);
  if (singles.length === 0) return null;

  const reasons = new Map();
  const matchedTerms = new Set();
  let score = 0;
  let bestWeight = 0;

  const consider = (term, bonus) => {
    let best = null;
    for (const entry of record.fields) {
      if (!entry.text || !contains(entry.text, term)) continue;
      if (!best || entry.weight > best.weight) best = entry;
    }
    if (!best) return;
    matchedTerms.add(term);
    score += best.weight + bonus;
    bestWeight = Math.max(bestWeight, best.weight);
    // One reason per field, showing the record's own wording where it is short
    // enough to read on a card.
    if (!reasons.has(best.field)) {
      reasons.set(best.field, best.text.length <= 40 ? best.text : (asTyped.get(term) ?? term));
    }
  };

  for (const bigram of bigrams) consider(bigram, 2);
  for (const single of singles) {
    // Already found inside a matched two-word phrase.
    if ([...matchedTerms].some((t) => t.includes(' ') && t.includes(single))) continue;
    consider(single, 0);
  }

  if (matchedTerms.size === 0) return null;

  const covered = singles.filter((s) => [...matchedTerms].some((t) => t.includes(s))).length;
  const complete = covered === singles.length;
  // Every word landed, and either several fields agreed or one of the fields
  // that defines a parallel — place, site, named sample — did.
  const strong = score >= 8 || bestWeight >= 5;
  const confidence = complete && strong ? 'High' : complete ? 'Moderate' : 'Possible';

  return { score, confidence, reasons: [...reasons.entries()] };
}

/** Shape a scored record into the props the existing result cards expect. */
const toResult = (record, scored) => {
  const { facets, fields, ...card } = record;
  void fields;
  return {
    ...card,
    facets,
    confidence: scored.confidence,
    score: scored.score,
    matchReasons:
      record.type === 'vessel'
        ? scored.reasons.map(([field, term]) => ({ field, term }))
        : scored.reasons.map(([attribute, value]) => ({ attribute, value })),
  };
};

const CONFIDENCE_ORDER = { High: 0, Moderate: 1, Possible: 2 };

const rank = (a, b) =>
  CONFIDENCE_ORDER[a.confidence] - CONFIDENCE_ORDER[b.confidence] || b.score - a.score;

/** Free-text search. Replaces the old glossaryLookup. */
export function searchParallels(query) {
  if (!query || !query.trim()) return [];
  return searchableRecords()
    .map((record) => {
      const scored = scoreRecord(record, query);
      return scored ? toResult(record, scored) : null;
    })
    .filter(Boolean)
    .sort(rank);
}

/* ── Parallels for a specific record ────────────────────────────────────── */

/** The record a "Parallels" button on a card points at. */
export const findRecord = (id) => searchableRecords().find((r) => r.id === id);

/**
 * A readable query describing what makes something a parallel to this record.
 *
 * It goes into the search box as editable text, so the reasoning is visible and
 * the user can widen or narrow it — drop the period, swap the region — instead
 * of being handed an opaque list.
 */
export function parallelQueryFor(record) {
  if (!record) return '';
  const parts = [record.facets.Region?.[0], record.facets.Period?.[0]];
  return [...new Set(parts.filter(Boolean))].join(' ');
}

/** What being a parallel is made of, strongest first. */
const PARALLEL_AXES = [
  ['Region', 'region', 5],
  ['Period', 'period', 4],
  ['Vessel Form', 'vessel form', 3],
  ['Fabric Texture', 'fabric texture', 3],
  ['Temper Type', 'temper type', 2],
];

/**
 * Records comparable to the given one, the record itself excluded.
 *
 * Scored on shared attributes rather than on the text of a query, so a record
 * from the same region and period is not marked down for having a different
 * vessel form. Each reason names the attribute the two records share.
 */
export function parallelsFor(id) {
  const target = findRecord(id);
  if (!target) return [];

  return searchableRecords()
    .filter((record) => record.id !== id)
    .map((record) => {
      let score = 0;
      const reasons = [];
      for (const [facet, label, weight] of PARALLEL_AXES) {
        const mine = target.facets[facet] ?? [];
        const shared = mine.filter((value) => (record.facets[facet] ?? []).includes(value));
        if (shared.length > 0) {
          score += weight;
          reasons.push([label, shared[0]]);
        }
      }
      if (score === 0) return null;
      const confidence = score >= 8 ? 'High' : score >= 4 ? 'Moderate' : 'Possible';
      return toResult(record, { score, confidence, reasons });
    })
    .filter(Boolean)
    .sort(rank);
}

/* ── Facets ─────────────────────────────────────────────────────────────── */

/** Same groups, in the same order, as the sidebar has always shown. */
export const FACET_ORDER = [
  'Region',
  'Period',
  'Ware',
  'Surface Treatment',
  'Vessel Form',
  'Fabric Texture',
  'Temper Type',
  'Confidence',
];

/**
 * Facet groups counted from the results actually on screen.
 *
 * The counts used to be fixed numbers that no query could change and no click
 * could apply. A facet with nothing behind it is dropped rather than offered.
 */
export function facetsFor(results) {
  const groups = new Map(FACET_ORDER.map((title) => [title, new Map()]));

  const bump = (title, label) => {
    if (!label) return;
    const group = groups.get(title);
    if (!group) return;
    group.set(label, (group.get(label) ?? 0) + 1);
  };

  for (const result of results) {
    for (const [title, labels] of Object.entries(result.facets ?? {})) {
      for (const label of labels) bump(title, label);
    }
    bump('Confidence', `${result.confidence} match`);
  }

  return FACET_ORDER.map((title) => ({
    title,
    options: [...groups.get(title).entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
  })).filter((group) => group.options.length > 0);
}

/** A record passes when it matches at least one chosen value in every used group. */
export function applyFacets(results, selected) {
  const active = Object.entries(selected).filter(([, values]) => values.length > 0);
  if (active.length === 0) return results;

  return results.filter((result) =>
    active.every(([title, values]) => {
      const labels =
        title === 'Confidence' ? [`${result.confidence} match`] : (result.facets?.[title] ?? []);
      return values.some((value) => labels.includes(value));
    }),
  );
}

/* ── Quick starts for the empty state ───────────────────────────────────── */

/** Regions and periods that actually have records, so no chip leads to nothing. */
export function quickStarts() {
  const all = searchableRecords();
  const collect = (title) => {
    const seen = new Map();
    for (const record of all) {
      for (const label of record.facets[title] ?? []) {
        seen.set(label, (seen.get(label) ?? 0) + 1);
      }
    }
    return [...seen.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([label]) => label);
  };
  return { regions: collect('Region'), periods: collect('Period') };
}
