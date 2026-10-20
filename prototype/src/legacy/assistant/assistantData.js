import { ceramicTypes, getPeriod, getRegion, periods, regions, sites, vessels, wares } from '@/lib/data';

import { localize } from '../data/localize.js';
import { searchParallels } from '../pages/searchModel.js';

/**
 * Answers the assistant can give from the project's own records.
 *
 * The scripted replies only knew the handful of things they were written
 * around: asked for sites it named six, two of which are not in PACP at all.
 * Everything here is read from the data at the moment of asking, so a count is
 * a real count and a name is a name the database holds.
 */

const norm = (value) => String(value ?? '').toLowerCase();

const vesselsAtSite = (siteId) => vessels.filter((v) => v.site_id === siteId).length;

/** Sites as picker options, with their region underneath. */
export function siteOptions() {
  return sites.map((site) => {
    const region = getRegion(site.region_id);
    return {
      id: site.site_id,
      label: site.name,
      sub: region ? `${region.name}, ${region.country}` : site.country,
    };
  });
}

export function siteAnswer(lang, addMsg) {
  const options = siteOptions();
  return {
    role: 'assistant',
    text: localize(
      lang,
      `PACP currently has data from ${sites.length} sites. Which one are you interested in?`,
      `PACP tiene datos de ${sites.length} sitios actualmente. ¿Cuál te interesa?`,
    ),
    payload: {
      kind: 'picker',
      prompt: '',
      options,
      onPick: (label) => {
        const site = sites.find((s) => s.name === label);
        const region = site ? getRegion(site.region_id) : null;
        const period = site ? getPeriod(site.period_id) : null;
        const count = site ? vesselsAtSite(site.site_id) : 0;
        addMsg({
          role: 'assistant',
          text: site
            ? localize(
                lang,
                `${site.name} is a ${norm(site.site_type)} in ${region ? `${region.name}, ${region.country}` : site.country}${period ? `, ${period.term}` : ''}. PACP holds ${count} vessel ${count === 1 ? 'record' : 'records'} from there.`,
                `${site.name} es un ${norm(site.site_type)} en ${region ? `${region.name}, ${region.country}` : site.country}${period ? `, ${period.term}` : ''}. PACP tiene ${count} ${count === 1 ? 'registro' : 'registros'} de vasijas de allí.`,
              )
            : localize(lang, `Here are the records from ${label}.`, `Aquí están los registros de ${label}.`),
          payload: {
            kind: 'button',
            button: {
              label: localize(lang, `Find parallels from ${label} →`, `Buscar paralelos de ${label} →`),
              href: `/search?q=${encodeURIComponent(label)}`,
            },
          },
        });
      },
    },
  };
}

/** What PACP holds, counted rather than asserted. */
export function holdingsAnswer(lang) {
  return {
    role: 'assistant',
    text: localize(
      lang,
      `PACP currently holds ${vessels.length} vessel records across ${sites.length} sites in ${regions.length} regions, described by ${wares.length} wares and ${ceramicTypes.length} ceramic types, spanning ${periods.length} periods. Records can be partial — a draft with two fields is still a record.`,
      `PACP tiene ${vessels.length} registros de vasijas en ${sites.length} sitios de ${regions.length} regiones, descritos por ${wares.length} wares y ${ceramicTypes.length} tipos cerámicos, en ${periods.length} periodos. Los registros pueden ser parciales.`,
    ),
    payload: {
      kind: 'button',
      button: { label: localize(lang, 'Browse all records →', 'Explorar registros →'), href: '/browse' },
    },
  };
}

/** Text reduced to space-separated words, for whole-word matching. */
const words = (value) => ` ${norm(value).replace(/[^\p{L}\p{N}]+/gu, ' ').trim()} `;

/**
 * A named ware, type, region or period, described from its own record.
 *
 * Longest name wins, matched on whole words: "Classic" is a substring of
 * "Epiclassic", so a plain includes() answers the wrong question.
 */
export function entityAnswer(text, lang) {
  const haystack = words(text);
  const candidates = [
    ...ceramicTypes.map((record) => ({ record, name: record.name })),
    ...wares.map((record) => ({ record, name: record.name })),
    ...regions.map((record) => ({ record, name: record.name })),
    ...periods.map((record) => ({ record, name: record.term })),
  ]
    .filter(({ name }) => name && name.length > 3 && haystack.includes(words(name)))
    .sort((a, b) => b.name.length - a.name.length);

  const found = candidates[0];
  if (!found) return null;

  const { record, name } = found;
  const dates = record.date_bce_ce
    ? ` (${record.date_bce_ce})`
    : record.date_range_start != null
      ? ` (${record.date_range_start}\u2013${record.date_range_end})`
      : '';
  const description = record.description ?? '';

  return {
    role: 'assistant',
    text: `${name}${dates}. ${description}`.trim(),
    payload: {
      kind: 'button',
      button: {
        label: localize(lang, `Find parallels for ${name} \u2192`, `Buscar paralelos de ${name} \u2192`),
        href: `/search?q=${encodeURIComponent(name)}`,
      },
    },
  };
}

const RESULT_COLORS = ['bg-amber-100', 'bg-orange-100', 'bg-yellow-100'];

/**
 * A search run from the chat, using the same model the search page uses.
 *
 * The wording matches the rest of PACP: these are possibilities to compare,
 * and each one says which field it matched on.
 */
export function searchAnswer(query, lang) {
  const cleaned = query
    .replace(/^(find|search for|search|show me|look for|parallels for|any)\s+/i, '')
    .replace(/\s+(in|from)\s+pacp$/i, '')
    .trim();
  if (cleaned.length < 3) return null;

  const results = searchParallels(cleaned);
  if (results.length === 0) {
    return {
      role: 'assistant',
      text: localize(
        lang,
        `I could not find a record matching "${cleaned}". That may mean PACP does not hold it yet — partial records are welcome if you have one.`,
        `No encontré registros para "${cleaned}". Puede que PACP aún no lo tenga — los registros parciales son bienvenidos.`,
      ),
      payload: {
        kind: 'button',
        button: { label: localize(lang, 'Submit a record →', 'Enviar un registro →'), href: '/submit' },
      },
    };
  }

  return {
    role: 'assistant',
    text: localize(
      lang,
      `I found ${results.length} ${results.length === 1 ? 'record' : 'records'} for "${cleaned}". These are possibilities to compare, not classifications.`,
      `Encontré ${results.length} ${results.length === 1 ? 'registro' : 'registros'} para "${cleaned}". Son posibilidades para comparar, no clasificaciones.`,
    ),
    payload: {
      kind: 'results',
      title: localize(
        lang,
        `${results.length} ${results.length === 1 ? 'record' : 'records'} found`,
        `${results.length} ${results.length === 1 ? 'registro encontrado' : 'registros encontrados'}`,
      ),
      results: results.slice(0, 3).map((result, index) => ({
        name: result.name ?? result.sampleCode,
        ware: result.region,
        match: localize(lang, `${result.confidence} match`, `Coincidencia ${result.confidence}`),
        color: RESULT_COLORS[index % RESULT_COLORS.length],
      })),
      button: {
        label: localize(lang, 'See all results →', 'Ver todos los resultados →'),
        href: `/search?q=${encodeURIComponent(cleaned)}`,
      },
    },
  };
}

/** What the assistant can actually do — the Help menu item used to do nothing. */
export function helpAnswer(lang) {
  return {
    role: 'assistant',
    text: localize(
      lang,
      [
        'Here is what I can do:',
        '• Find records — "find Zacatecas", "show me Epiclassic bowls"',
        '• Explain a term — ware, type, petro-fabric, assemblage',
        '• Describe a site, ware, type or period from PACP records',
        '• Tell you what PACP holds right now',
        '• Start a vessel submission, or open Guided Identification and Compare',
        'I only report what the records say, and I flag possibilities rather than deciding for you.',
      ].join('\n'),
      [
        'Esto es lo que puedo hacer:',
        '• Encontrar registros — "buscar Zacatecas"',
        '• Explicar un término — ware, tipo, petro-fabric, ensamblaje',
        '• Describir un sitio, ware, tipo o periodo de los registros de PACP',
        '• Decirte qué contiene PACP ahora mismo',
        '• Iniciar el envío de una vasija, o abrir Identificación Guiada y Comparar',
        'Solo informo lo que dicen los registros y señalo posibilidades.',
      ].join('\n'),
    ),
    payload: {
      kind: 'button',
      button: { label: localize(lang, 'Open Resources →', 'Abrir Recursos →'), href: '/resources' },
    },
  };
}

/**
 * Anything answerable from the data, or null to fall through to the scripted
 * replies. Tried after the hand-written answers so their wording is preserved.
 */
export function dataAnswer(text, lang, addMsg) {
  const haystack = norm(text);

  if (/\b(help|what can you do|capabilities)\b/.test(haystack) || haystack.includes('qué puedes hacer')) {
    return helpAnswer(lang);
  }
  if (
    /\b(how many|how much|what does pacp have|what.s in pacp|holdings|statistics|stats)\b/.test(haystack) ||
    haystack.includes('cuántos')
  ) {
    return holdingsAnswer(lang);
  }
  if (/\b(find|search|look for|parallels for|show me)\b/.test(haystack) || haystack.includes('buscar')) {
    const answer = searchAnswer(text, lang);
    if (answer) return answer;
  }
  const entity = entityAnswer(text, lang);
  if (entity) return entity;

  // Last chance before the generic reply: treat the whole message as a search.
  const asSearch = searchAnswer(text, lang);
  if (asSearch && asSearch.payload?.kind === 'results') return asSearch;

  void addMsg;
  return null;
}
