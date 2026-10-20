import { z } from 'zod';

/**
 * What Claude returns for one page range of a report.
 *
 * Shaped as one array per record kind rather than a union: every field is
 * required and nullable, which keeps the schema simple for structured outputs
 * and makes "the report doesn't say" an explicit `null` instead of an omission
 * that looks like a gap in extraction.
 *
 * Page numbers come back as positions *within the excerpt*. Converting them to
 * report page numbers happens in code, not in the model — arithmetic is not
 * something to delegate when provenance is the whole point.
 */

const provenance = {
  excerpt_pages: z
    .array(z.number().int())
    .describe('Pages within THIS excerpt (1 = first page of the excerpt) where the item appears.'),
  quote: z
    .string()
    .describe(
      'A short verbatim passage (8–40 words) copied exactly from the page, which a reviewer can find to confirm the item.',
    ),
  confidence: z
    .enum(['tentative', 'possible', 'probable'])
    .describe(
      'How clearly the source states this. "probable" = stated explicitly; "possible" = stated but ambiguous or partly legible; "tentative" = inferred.',
    ),
  reasoning: z
    .string()
    .describe('One or two sentences on why this was extracted and anything a reviewer should double-check.'),
};

export const ChunkExtractionSchema = z.object({
  excerpt_summary: z
    .string()
    .describe('Three to five sentences summarising what these pages contribute to the report.'),

  vessels: z.array(
    z.object({
      ...provenance,
      label: z.string().describe('Catalogue number, vessel ID, or a short description if no ID is given.'),
      site: z.string().nullable(),
      ware: z.string().nullable(),
      type_or_variety: z.string().nullable(),
      form: z.string().nullable().describe('e.g. bowl, jar, scoop, pitcher, plate.'),
      date_or_phase: z.string().nullable(),
      notes: z.string().nullable(),
    }),
  ),

  ceramic_types: z.array(
    z.object({
      ...provenance,
      name: z.string(),
      category: z.enum(['ware', 'type', 'variety']),
      parent: z.string().nullable().describe('The ware a type belongs to, or the type a variety belongs to.'),
      date_or_phase: z.string().nullable(),
      diagnostic_traits: z
        .string()
        .nullable()
        .describe('Defining criteria as the report states them: temper, slip colour, paste, design style.'),
    }),
  ),

  sites: z.array(
    z.object({
      ...provenance,
      name: z.string(),
      site_number: z.string().nullable().describe('e.g. an ASM number such as AZ U:9:1(ASM).'),
      region: z.string().nullable(),
      periods: z.string().nullable(),
      notes: z.string().nullable(),
    }),
  ),

  petrographic_samples: z.array(
    z.object({
      ...provenance,
      sample_id: z.string(),
      site: z.string().nullable(),
      ware_or_type: z.string().nullable(),
      temper_or_sand_zone: z.string().nullable(),
      notes: z.string().nullable(),
    }),
  ),

  assemblage_counts: z.array(
    z.object({
      ...provenance,
      table_label: z.string().nullable().describe('e.g. "Table 2.1".'),
      context: z.string().describe('The component, phase, site or provenience the row describes.'),
      counts: z.array(z.object({ category: z.string(), count: z.number().int() })),
      stated_total: z
        .number()
        .int()
        .nullable()
        .describe('The total exactly as printed. Do not compute it yourself.'),
    }),
  ),

  references: z.array(
    z.object({
      ...provenance,
      authors: z.array(z.string()),
      year: z.number().int().nullable(),
      title: z.string(),
      publication: z.string().nullable().describe('Journal, series, publisher, or "paper presented at…".'),
    }),
  ),
});

export type ChunkExtraction = z.infer<typeof ChunkExtractionSchema>;

export const RoleBriefsSchema = z.object({
  crm_archaeologist: z.string(),
  graduate_student: z.string(),
  undergraduate_student: z.string(),
});
