#!/usr/bin/env node
/**
 * Builds the bundled demo extraction for the Pueblo Grande example report.
 *
 *   node --experimental-strip-types scripts/build-demo.mjs /path/to/pueblo_grande_ssi_vol-3pt-1.pdf
 *
 * The items below were curated by hand from the report's pages — they are NOT
 * Claude output, and the demo UI says so. What this script does run for real is
 * the same verification code the live pipeline uses: every quote is matched
 * against the PDF text layer and every table row is re-added, so the
 * verified / partial / unverified states in the demo are computed, not asserted.
 *
 * Once an API key is configured, run a real extraction from /upload to see
 * Claude's own output for comparison.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { extractText, getDocumentProxy } from 'unpdf';
import { checkTotals, verifyQuote } from '../src/lib/extraction/verify.ts';

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error('Usage: node --experimental-strip-types scripts/build-demo.mjs <path-to-pdf>');
  process.exit(1);
}

const bytes = new Uint8Array(readFileSync(pdfPath));
const pdf = await getDocumentProxy(bytes);
const { totalPages, text } = await extractText(pdf, { mergePages: false });
const pageText = (p) => text[p - 1];

const CHUNK = 20;
const chunks = [];
for (let s = 1; s <= totalPages; s += CHUNK) chunks.push([s, Math.min(s + CHUNK - 1, totalPages)]);
const chunkOf = (page) => Math.floor((page - 1) / CHUNK);

const f = (label, value) => (value === null || value === undefined || value === '' ? [] : [{ label, value: String(value) }]);

/* ── Curated items ───────────────────────────────────────────────────────── */

const seeds = [
  // Chapter 2 — rough-sort ware and type definitions (PDF p.35)
  {
    kind: 'ceramic_type', title: 'Wingfield Plain', subtitle: 'type of Hohokam plainware', pages: [35],
    fields: [...f('Category', 'type'), ...f('Belongs to', 'Hohokam plainware'), ...f('Diagnostic traits', 'Phyllite temper')],
    quote: 'The first four temper types are the defining criteria for the traditional type-variety classification of Hohokam plainware',
    confidence: 'possible',
    reasoning: 'The report lists four temper types (phyllite, Squaw Peak Schist, micaceous schist, sand) and then four plainware types. Pairing Wingfield Plain with phyllite relies on that list order, which the text implies but does not state row by row — worth confirming against the cited type descriptions.',
  },
  {
    kind: 'ceramic_type', title: 'Squaw Peak Plain', subtitle: 'type of Hohokam plainware', pages: [35],
    fields: [...f('Category', 'type'), ...f('Belongs to', 'Hohokam plainware'), ...f('Diagnostic traits', 'Squaw Peak Schist temper')],
    quote: 'Wingfield Plain, Squaw Peak Plain, Gila Plain-Gila variety, and Gila Plain-Salt variety',
    confidence: 'possible',
    reasoning: 'Temper pairing inferred from the order of the two lists, as with Wingfield Plain. The report later notes that "white metamorphic grains" proved to be a variant of Squaw Peak Schist and folded them into this category.',
  },
  {
    kind: 'ceramic_type', title: 'Gila Plain, Gila variety', subtitle: 'variety of Gila Plain', pages: [35],
    fields: [...f('Category', 'variety'), ...f('Belongs to', 'Gila Plain'), ...f('Diagnostic traits', 'Micaceous schist temper')],
    quote: 'Wingfield Plain, Squaw Peak Plain, Gila Plain-Gila variety, and Gila Plain-Salt variety',
    confidence: 'possible',
    reasoning: 'Temper pairing inferred from list order. Recorded as a variety because the report uses the type-variety system explicitly.',
  },
  {
    kind: 'ceramic_type', title: 'Sacaton Red', subtitle: 'type of Hohokam redware', pages: [35],
    fields: [...f('Category', 'type'), ...f('Belongs to', 'Hohokam redware'), ...f('Date or phase', 'Typological antecedent to Classic period redware'), ...f('Diagnostic traits', 'Heavy raspberry-red slip, usually on bowl interiors; occasionally slipped on exteriors of jars and bowls')],
    quote: 'It is characterized by a heavy, raspberry red slip that is usually applied to the interior surface of bowls.',
    confidence: 'probable',
    reasoning: 'Stated directly, with sources (Abbott and Gregory 1988; Gladwin et al. 1937). The exterior-slip exception is also in the text.',
  },
  {
    kind: 'ceramic_type', title: 'Phoenix Red', subtitle: 'type of Hohokam redware', pages: [35],
    fields: [...f('Category', 'type'), ...f('Belongs to', 'Hohokam redware'), ...f('Date or phase', 'Largely confined to the late Classic'), ...f('Diagnostic traits', 'Distinct magenta slip; muddy core commonly with a carbon streak; no smudging')],
    quote: 'Phoenix Red is largely confined to the late Classic',
    confidence: 'probable',
    reasoning: 'Chronology and diagnostic traits are both stated explicitly on this page.',
  },
  {
    kind: 'ceramic_type', title: 'Salado Polychrome', subtitle: 'type', pages: [398],
    fields: [...f('Category', 'type'), ...f('Date or phase', 'Civano and Polvorón contexts at Pueblo Grande'), ...f('Diagnostic traits', 'Stylistically and technologically homogeneous at a broad level, but paste composition is heterogeneous')],
    quote: 'how Salado Polychrome came to be so widely distributed across the American Southwest',
    confidence: 'probable',
    reasoning: 'Chapter 7 opens by setting out a live debate: long-distance trade, migration, local production and competitive emulation have all been proposed. That disagreement is the substance of the record, so it should stay visible rather than be resolved into one explanation.',
  },

  // Chapter 2 — Table 2.1, wares by temporal component (PDF p.37)
  ...[
    ['Sacaton', [21024, 1476, 1664, 19, 132], 24315, 'Sacaton 21,024 1,476 1,664 19 132 24,315'],
    ['Civano', [46869, 10172, 1239, 474, 608], 59362, 'Civano 46,869 10,172 1,239 474 608 59,362'],
    ['Polvorón', [25498, 8288, 538, 889, 560], 35773, 'Polvorón 25,498 8,288 538 889 560 35,773'],
  ].map(([context, n, total, quote]) => ({
    kind: 'assemblage_count', title: `${context} component`, subtitle: 'Table 2.1', pages: [37],
    counts: ['Plainware', 'Redware', 'Decorated', 'Salado Polychrome', 'Red/Plain'].map((category, i) => ({ category, count: n[i] })),
    total, quote, confidence: 'probable',
    reasoning: 'Read from Table 2.1. This table\'s text layer interleaves row labels into the numbers, so these values come from the page layout rather than text order — the totals check below confirms the reading.',
  })),
  {
    kind: 'assemblage_count', title: 'All components (Total row)', subtitle: 'Table 2.1', pages: [37],
    counts: [['Plainware', 268018], ['Redware', 45005], ['Decorated', 11751], ['Salado Polychrome', 2067], ['Red/Plain', 3269]].map(([category, count]) => ({ category, count })),
    total: 330190, quote: 'Total 268,018 45,005 11,751 2,067 3,269 330,190', confidence: 'possible',
    reasoning: 'Values recorded exactly as printed, but they do not add up. Summing the Redware column\'s nine rows gives 45,085, not the printed 45,005, while every individual row reconciles and the grand total matches the row totals. The printed 13.7% Redware share also fits 45,085. The printed Redware total is probably a typo in the original report — flagged rather than silently corrected.',
  },

  // Chapter 5 — Table 5.1, whole and reconstructible vessels (PDF p.177)
  {
    kind: 'assemblage_count', title: 'Whole and reconstructible bowls, by ware', subtitle: 'Table 5.1', pages: [177],
    counts: [['Plain', 635], ['Red', 536], ['Red/Plain?', 23], ['Red-on-buff', 1], ['Brown-paste variant', 1], ['Salado Polychrome', 6], ['Other intrusives', 1]].map(([category, count]) => ({ category, count })),
    total: 1203, quote: 'Bowls 635 536 23 1 1 6 1 1,203', confidence: 'probable',
    reasoning: 'This volume reports whole vessels in aggregate (ware by form) rather than as individual catalogued pots, so they are extracted as assemblage counts, not vessel records. The table\'s text layer is badly scrambled; values come from the page layout.',
  },
  {
    kind: 'assemblage_count', title: 'Whole and reconstructible jars, by ware', subtitle: 'Table 5.1', pages: [177],
    counts: [['Plain', 342], ['Red', 134], ['Red/Plain?', 11], ['Red-on-buff', 33], ['Salado Polychrome', 9], ['Other intrusives', 6]].map(([category, count]) => ({ category, count })),
    total: 535, quote: 'Jars 342 134 11 33 9 6 535', confidence: 'possible',
    reasoning: 'The jars row has one empty cell, so assigning its six values to columns depends on reading the column positions on the page. Confirm which ware column is blank before accepting.',
  },

  // Chapter 3 — sites with temper classification tables (PDF p.67–75)
  ...[
    ['La Ciudad', 69, 'Table 3.4. Ceramic Temper Classification for La Ciudad.'],
    ['La Lomita Pequeña', 71, 'Ceramic Temper Classification for La Lomita Pequeña'],
    ['Casa Buena', 73, 'Ceramic Temper Classification for Casa Buena'],
    ['Grand Canal Ruins', 75, 'Ceramic Temper Classification for Grand Canal Ruins'],
  ].map(([name, page, quote]) => ({
    kind: 'site', title: name, subtitle: null, pages: [page],
    fields: [...f('Region', 'Central Phoenix Basin'), ...f('Notes', 'Ceramic temper classification compared against the Pueblo Grande sand composition zones')],
    quote, confidence: 'probable',
    reasoning: 'Named in a Chapter 3 table title as a comparative collection. No site number is given on this page, so it is left blank rather than looked up.',
  })),
  {
    kind: 'site', title: 'Pueblo Grande', subtitle: null, pages: [81],
    fields: [...f('Region', 'Central Phoenix Basin'), ...f('Periods', 'Late Sedentary and Classic (Sacaton, Soho, Civano, Polvorón components)'), ...f('Notes', 'The project site; source of the petrographic sample in Table 3.10')],
    quote: 'Table 3.10. Pueblo Grande Project Petrographic Sample', confidence: 'probable',
    reasoning: 'The report\'s own subject. Its temporal components come from Table 2.1. The ASM site number does not appear in the extracted pages, so it is left blank.',
  },

  // Chapter 3 — petrographic samples
  ...[
    ['14:84:2', 'Salt Red', 'Camelback Granite?', '14:84:2 Salt Red Camelback Granite?', 'tentative', 'The report itself marks this sand composition zone with a question mark. That uncertainty is carried through as "tentative" rather than dropped.'],
    ['14:84:4', 'Gila Red', 'Micaceous schist', '14:84:4 Gila Red Micaceous schist', 'probable', 'A clean table row. Archaeological classification by Archaeological Consulting Services; sand zone as determined for the Pueblo Grande project, per the table note.'],
    ['14:84:6', 'Wingfield Plain', 'Squaw Peak Schist', '14:84:6 Wingfield Plain squaw Peak schist', 'probable', 'Worth a second look for a student: Wingfield Plain is normally defined by phyllite temper, but this sherd\'s sand zone is Squaw Peak Schist. A useful case of a type label and a petrographic result not lining up.'],
    ['10:24:7', 'Gila Plain, Salt Variety', 'South Mountain Granodiorite', '10:24:7 Gila Plain, Salt Variety South Mountain Granodiorite', 'probable', 'A clean table row from the Santan Mountains collection.'],
  ].map(([id, type, zone, quote, confidence, reasoning]) => ({
    kind: 'petrographic_sample', title: id, subtitle: 'Santan Mountains', pages: [80],
    fields: [...f('Site', 'Santan Mountains'), ...f('Ware / type', type), ...f('Temper or sand zone', zone), ...f('Notes', 'Table 3.9')],
    quote, confidence, reasoning,
  })),
  ...[
    ['RMS-5', 'Red', 'Micaceous Schist'],
    ['SQP-1', 'Plain', 'Squaw Peak Schist'],
  ].map(([id, ware, zone]) => ({
    kind: 'petrographic_sample', title: id, subtitle: 'Pueblo Grande', pages: [81],
    fields: [...f('Site', 'Pueblo Grande'), ...f('Ware / type', ware), ...f('Temper or sand zone', zone), ...f('Notes', 'Table 3.10')],
    quote: `${id} Pueblo Grande ${ware} ${zone}`, confidence: 'possible',
    reasoning: 'Table 3.10 prints each column as its own block in the text layer, so the sample, site, ware and zone for this row can only be aligned from the page layout. Check the row on the page before accepting.',
  })),

  // Chapter 9 — references (PDF p.460, 462)
  {
    kind: 'reference', title: 'Technological Stability and Change in Hohokam Red Wares of the Salt-Gila Aqueduct Area', subtitle: 'Abbott, David R. · 1982', pages: [460],
    fields: [...f('Authors', 'Abbott, David R.'), ...f('Year', 1982), ...f('Publication', 'Paper presented at the 47th Annual Meeting of the Society for American Archaeology, Minneapolis')],
    quote: 'Technological Stability and Change in Hohokam Red Wares of the Salt-Gila Aqueduct Area', confidence: 'probable',
    reasoning: 'A clean single entry at the top of the reference list.',
  },
  {
    kind: 'reference', title: 'Form, Function, Technology, and Style in Hohokam Ceramics', subtitle: 'Abbott, David R. · 1988', pages: [460],
    fields: [...f('Authors', 'Abbott, David R.'), ...f('Year', 1988), ...f('Publication', 'In The 1982-1984 Excavations at Las Colinas: Material Culture, pp. 73-198. Arizona State Museum Archaeological Series No. 162(4). Tucson')],
    quote: 'Form, Function, Technology, and Style in Hohokam Ceramics', confidence: 'possible',
    reasoning: 'Abbott\'s works from 1983 to 1993 are listed under one name, and the text layer separates all seven years from their titles. 1988 is the fourth year and this is the fourth title; confirm the pairing on the page.',
  },
  {
    kind: 'reference', title: 'Hohokam Ceramic Wares and Types', subtitle: 'Abbott, David R.; Gregory, David A. · 1988', pages: [460],
    fields: [...f('Authors', 'Abbott, David R.; Gregory, David A.'), ...f('Year', 1988), ...f('Publication', 'In The 1982-1984 Excavations at Las Colinas: Material Culture')],
    quote: 'Hohokam Ceramic Wares and Types. In The 1982-1984 Excavations at Las Colinas', confidence: 'probable',
    reasoning: 'Cited repeatedly in Chapter 2 as the source for the ware and type definitions. The entry continues onto the next page, so the page range and series details should be completed there.',
  },
  {
    kind: 'reference', title: 'Intrusive Ceramic Wares and Types', subtitle: 'Beckwith, Kim E. · 1988', pages: [462],
    fields: [...f('Authors', 'Beckwith, Kim E.'), ...f('Year', 1988), ...f('Publication', 'In The 1982-1984 Excavations at Las Colinas, Vol. 4: Material Culture, pp. 199-256. Arizona State Museum Archaeological Series No. 162. Tucson')],
    quote: 'Beckwith, Kim E. 1988 Intrusive Ceramic Wares and Types', confidence: 'possible',
    reasoning: 'The PDF\'s text layer reads this author as "Rim E. Beckwith", an OCR slip — the same list elsewhere names her "Kim E. Beckwith". The printed page is the authority here, which is why the quote does not match the text layer exactly.',
  },
  {
    kind: 'reference', title: 'Application of Multivariate Techniques to Analytical Data on Aegean Ceramics', subtitle: 'Bieber, A.M., Jr.; Brooks, D. W.; Harbottle, G.; Sayre, E. V. · 1976', pages: [462],
    fields: [...f('Authors', 'Bieber, A.M., Jr.; Brooks, D. W.; Harbottle, G.; Sayre, E. V.'), ...f('Year', 1976), ...f('Publication', 'Archaeometry 18: 59-74')],
    quote: 'Application of Multivariate Techniques to Analytical Data on Aegean Ceramics', confidence: 'probable',
    reasoning: 'A clean entry. Relevant to the chemical-analysis methods in Chapter 4.',
  },
  {
    kind: 'reference', title: 'Soils and Geomorphology', subtitle: 'Birkeland, Peter W. · 1984', pages: [462],
    fields: [...f('Authors', 'Birkeland, Peter W.'), ...f('Year', 1984), ...f('Publication', 'Oxford University Press, New York')],
    quote: '1984 Soils and Geomorphology. Oxford University Press, New York.', confidence: 'probable',
    reasoning: 'A clean entry.',
  },
];

/* ── Verify and assemble ─────────────────────────────────────────────────── */

let counter = 0;
const items = seeds.map((s) => {
  const checks = s.kind === 'assemblage_count' ? checkTotals(s.counts, s.total) : [];
  const fields = s.kind === 'assemblage_count'
    ? [...f('Source table', s.subtitle), ...s.counts.map((c) => ({ label: c.category, value: c.count.toLocaleString('en-US') })), ...f('Stated total', s.total.toLocaleString('en-US'))]
    : s.fields;
  return {
    id: `c${chunkOf(s.pages[0])}-${s.kind}-${counter++}`,
    kind: s.kind,
    title: s.title,
    subtitle: s.subtitle,
    fields,
    pages: s.pages,
    quote: s.quote,
    confidence: s.confidence,
    reasoning: s.reasoning,
    verification: verifyQuote(s.quote, s.pages, pageText),
    checks,
  };
});

const briefs = {
  crm_archaeologist:
    'A regional reference for Hohokam plainware, redware and Salado Polychrome in the central Phoenix Basin. Useful under deadline for the temper-based type definitions in Chapter 2, counts of wares by temporal component (Sacaton through Polvorón) in Table 2.1, and petrographic temper assignments for comparative collections in Chapter 3, which can support defensible attributions for sites in the same basin. The reference list is extensive and ready to cite. Treat sourcing results as interpretations tied to the sand composition zones this project defined.',
  graduate_student:
    'The volume argues that space is the understudied dimension of Hohokam ceramic analysis and sets out to separate production areas using temper petrography, chemical analysis and a whole vessel study. Its synthesis builds a model of late Sedentary and Classic period production and exchange, claiming exchanges can be traced over distances as short as 5 km. Chapter 7 is a good place to examine interpretive disagreement: trade, migration, local production and competitive emulation have all been proposed to explain how Salado Polychrome spread. Worth testing how far the production-area model depends on the sand composition zones.',
  undergraduate_student:
    'Archaeologists studied pottery from Pueblo Grande, a Hohokam village in what is now Phoenix, Arizona, to learn where pots were made and how they moved between communities. Much of the pottery looks similar, so they examined the tiny rock and sand grains mixed into the clay, called temper. Because different areas have different rocks, temper can hint at where a pot was made. The report compares pottery across several time periods and nearby sites, and discusses a well-known decorated style, Salado Polychrome, whose spread is still debated.',
};

const out = {
  source: 'curated',
  note: 'Curated by hand from the report for demonstration. Quote verification and totals checks were computed with the same code the live pipeline uses. This is not Claude output.',
  document: {
    fileName: 'pueblo_grande_ssi_vol-3pt-1.pdf',
    title: 'The Pueblo Grande Project: Ceramics and the Production and Exchange of Pottery in the Central Phoenix Basin, Part One',
    totalPages,
    pageRange: [1, totalPages],
  },
  citation: 'Abbott, David R. (editor) 1994. The Pueblo Grande Project: Ceramics and the Production and Exchange of Pottery in the Central Phoenix Basin, Part One. Soil Systems Publications in Archaeology No. 20, Vol. 3. tDAR id 4547. doi:10.6067/XCV8XW4H60',
  chunks,
  items,
  briefs,
};

const target = new URL('../src/lib/extraction/demo/pueblo-grande.json', import.meta.url);
writeFileSync(target, `${JSON.stringify(out, null, 2)}\n`);

const tally = items.reduce((acc, i) => ((acc[i.verification] = (acc[i.verification] ?? 0) + 1), acc), {});
console.log(`pages ${totalPages}, chunks ${chunks.length}, items ${items.length}`);
console.log('verification:', tally);
for (const i of items) {
  const check = i.checks.map((c) => (c.ok ? '✓ totals' : '✗ totals')).join(' ');
  console.log(`  ${i.verification.padEnd(10)} p.${String(i.pages).padEnd(4)} ${i.kind.padEnd(19)} ${i.title.slice(0, 48)} ${check}`);
}
