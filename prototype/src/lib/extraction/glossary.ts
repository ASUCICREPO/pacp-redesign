import type { ItemKind } from './types';

/**
 * Plain-language explanations for the undergraduate review walkthrough.
 *
 * The scope document asks that the platform "teach reasoning rather than merely
 * returning answers", and that undergraduates get approachable, guided
 * interfaces. Definitions follow `docs/Helpful_definitions_for_Rachel_s_team.docx`
 * where it covers a term.
 */

export const KIND_EXPLANATIONS: Record<ItemKind, { what: string; check: string }> = {
  vessel: {
    what: 'A single pot, whole or reconstructed from pieces. Vessel records are the most detailed kind of evidence in PACP.',
    check: 'Is this one specific pot, rather than a count or a general description of many?',
  },
  ceramic_type: {
    what: 'A named category archaeologists use to group pottery that shares features such as temper, surface colour or decoration. Wares are broad groups; types and varieties are narrower. These categories are interpretations, and specialists can disagree about them.',
    check: 'Does the page actually define or describe this category, rather than just mention it in passing?',
  },
  site: {
    what: 'A place where people lived or worked in the past and where archaeologists recovered material.',
    check: 'Is this a place where pottery was found or studied, rather than a museum or a publisher?',
  },
  petrographic_sample: {
    what: 'A sherd that was cut into a very thin slice and examined under a microscope to identify the minerals and rock fragments in its clay. This can suggest where a pot was made.',
    check: 'Do the sample ID and its description sit on the same row of the table on the page?',
  },
  assemblage_count: {
    what: 'A count of pottery from one context or time period, broken down by category. Counts let archaeologists compare how common different kinds of pottery were.',
    check: 'Do the numbers line up with the right columns? PACP re-adds the numbers for you — look at whether the totals check passed.',
  },
  reference: {
    what: 'A published source the report cites. References let you trace a claim back to where it was first made.',
    check: 'Are the author, year and title from the same entry?',
  },
};

export const GLOSSARY: Array<{ term: string; definition: string }> = [
  {
    term: 'Sherd',
    definition: 'A broken piece of a pottery vessel. Most archaeological pottery is found as sherds rather than whole pots.',
  },
  {
    term: 'Temper',
    definition:
      'Material mixed into clay that is not itself plastic — sand, crushed rock or other grit. Because local rocks differ from place to place, temper can hint at where a pot was made.',
  },
  {
    term: 'Ware, type and variety',
    definition:
      'Nested categories for grouping pottery. A ware is a broad group (for example redware); a type is a named kind within it; a variety is a finer subdivision of a type.',
  },
  {
    term: 'Slip',
    definition: 'A thin coating of clay applied to a pot’s surface, often to give it a particular colour or texture.',
  },
  {
    term: 'Petrography',
    definition:
      'Studying a very thin slice of pottery under a polarising microscope to identify the minerals and rock fragments inside it.',
  },
  {
    term: 'Sand composition zone',
    definition:
      'An area defined in this report by the kinds of rock in its sand. Matching a pot’s temper to a zone suggests where its raw materials came from.',
  },
  {
    term: 'Firing atmosphere',
    definition:
      'The amount of oxygen while a pot is fired. Plenty of oxygen tends to give light colours like red, orange and light brown; too little gives greys and blacks.',
  },
  {
    term: 'Component or phase',
    definition:
      'A span of time archaeologists recognise at a site, such as Sacaton or Civano. Comparing phases shows how pottery changed.',
  },
  {
    term: 'Assemblage',
    definition: 'All the artifacts recovered together from one context, site or time period.',
  },
];

export const VERIFICATION_EXPLANATIONS = {
  verified: 'The quoted passage appears word for word on the cited page.',
  partial:
    'The quoted words are on the page, but not in the same order. This is normal for tables, whose text scrambles columns — check the row on the page.',
  unverified:
    'The passage could not be matched against the page text. It may still be right, but you need to look at the page yourself.',
} as const;
