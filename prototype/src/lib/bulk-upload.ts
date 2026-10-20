import { ceramicTypes, periods, regions, sites, wares } from '@/lib/data';

/**
 * Bulk vessel upload.
 *
 * The Submit page has offered "Upload Spreadsheet" and "Download Template"
 * since the first prototype, and neither did anything. This is the model
 * behind them: the columns of the template, a CSV reader, and row-by-row
 * validation against PACP's own controlled lists.
 *
 * The rule from the PDF extraction work holds here too — a spreadsheet row is
 * a *proposal*. Accepting one creates a Draft that a reviewer promotes; a
 * bulk upload never writes published records.
 */

export interface TemplateColumn {
  key: string;
  label: string;
  required: boolean;
  help: string;
  /** When set, the value must be one of these (case-insensitive). */
  options?: () => string[];
  kind?: 'number';
}

/**
 * The template's columns.
 *
 * Deliberately short. Asking for forty fields up front is how a bulk upload
 * stops being quicker than typing; everything omitted can be filled in later
 * on the record, and a partial record is a first-class citizen in PACP.
 */
export const TEMPLATE_COLUMNS: TemplateColumn[] = [
  {
    key: 'registration_number',
    label: 'Registration number',
    required: true,
    help: 'Your own identifier for the vessel, e.g. LQ-V-112. Must be unique in the file.',
  },
  {
    key: 'name_or_label',
    label: 'Name or label',
    required: false,
    help: 'A readable name, e.g. "La Quemada V-112".',
  },
  {
    key: 'site',
    label: 'Site',
    required: true,
    help: 'A site already in PACP, or a new site name.',
    options: () => sites.map((s) => s.name),
  },
  {
    key: 'region',
    label: 'Region',
    required: false,
    help: 'A region already in PACP.',
    options: () => regions.map((r) => r.name),
  },
  {
    key: 'period',
    label: 'Period',
    required: false,
    help: 'A period already in PACP.',
    options: () => periods.map((p) => p.term),
  },
  { key: 'date_bce_ce', label: 'Date BCE/CE', required: false, help: 'e.g. 600–900 CE.' },
  {
    key: 'ware',
    label: 'Ware',
    required: false,
    help: 'A ware already in PACP.',
    options: () => wares.map((w) => w.name),
  },
  {
    key: 'ceramic_type',
    label: 'Ceramic type',
    required: false,
    help: 'A type already in PACP.',
    options: () => ceramicTypes.map((t) => t.name),
  },
  { key: 'shape', label: 'Shape', required: false, help: 'e.g. bowl, olla, jar.' },
  {
    key: 'functional_category',
    label: 'Functional category',
    required: false,
    help: 'e.g. Serving, Storage, Cooking.',
  },
  { key: 'vessel_height_cm', label: 'Height (cm)', required: false, help: 'A number.', kind: 'number' },
  { key: 'max_diameter_cm', label: 'Max diameter (cm)', required: false, help: 'A number.', kind: 'number' },
  {
    key: 'archaeological_context',
    label: 'Archaeological context',
    required: false,
    help: 'e.g. Terrace 18, Structure 3, floor contact.',
  },
  { key: 'notes', label: 'Notes', required: false, help: 'Anything that does not fit a column above.' },
];

/* ── CSV ────────────────────────────────────────────────────────────────── */

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);

/** The template, with one worked example row so the format is unambiguous. */
export function templateCsv(): string {
  const header = TEMPLATE_COLUMNS.map((c) => c.label);
  const example = [
    'LQ-V-900',
    'La Quemada V-900',
    'La Quemada',
    'Zacatecas',
    'Epiclassic',
    '600–900 CE',
    'Buff Ware',
    'Zacatecas Red-on-buff',
    'bowl',
    'Serving',
    '9.4',
    '25.9',
    'Terrace 18, Structure 3, floor contact',
    'Example row — delete before uploading.',
  ];
  return [header, example].map((row) => row.map((v) => csvCell(String(v))).join(',')).join('\n') + '\n';
}

/** Minimal RFC-4180 reader: quoted fields, escaped quotes, embedded newlines. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  // Strip a BOM, which Excel writes and which otherwise corrupts the first header.
  const input = text.replace(/^﻿/, '');

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (quoted) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          cell += '"';
          i += 1;
        } else quoted = false;
      } else cell += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(cell);
      cell = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && input[i + 1] === '\n') i += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else cell += char;
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/* ── Validation ─────────────────────────────────────────────────────────── */

export interface RowIssue {
  column: string;
  message: string;
  /** A warning still imports; an error does not. */
  severity: 'error' | 'warning';
}

export interface ParsedRow {
  /** 1-based row number as the spreadsheet shows it, header included. */
  lineNumber: number;
  values: Record<string, string>;
  issues: RowIssue[];
}

export interface ParsedSheet {
  rows: ParsedRow[];
  /** Columns in the file that the template does not define. */
  unknownColumns: string[];
  /** Required template columns the file is missing entirely. */
  missingColumns: string[];
}

const norm = (value: string) => value.trim().toLowerCase();

/**
 * Read a CSV into rows, flagging what a reviewer needs to decide.
 *
 * An unrecognised site or ware is a **warning**, not an error: PACP is a
 * growing type library and a name it has not seen may simply be new. Only a
 * missing required value or an unparseable number blocks the row.
 */
export function validateSheet(text: string): ParsedSheet {
  const table = parseCsv(text);
  if (table.length === 0) return { rows: [], unknownColumns: [], missingColumns: [] };

  const header = table[0].map((h) => h.trim());
  const byLabel = new Map(TEMPLATE_COLUMNS.map((c) => [norm(c.label), c]));
  const byKey = new Map(TEMPLATE_COLUMNS.map((c) => [norm(c.key), c]));

  // Accept either the printed label or the underlying key as a heading.
  const mapped = header.map((h) => byLabel.get(norm(h)) ?? byKey.get(norm(h)) ?? null);
  const unknownColumns = header.filter((h, i) => h !== '' && mapped[i] === null);
  const present = new Set(mapped.filter(Boolean).map((c) => c!.key));
  const missingColumns = TEMPLATE_COLUMNS.filter((c) => c.required && !present.has(c.key)).map((c) => c.label);

  const seenRegistrations = new Map<string, number>();

  const rows = table.slice(1).map((cells, index) => {
    const values: Record<string, string> = {};
    mapped.forEach((column, i) => {
      if (column) values[column.key] = (cells[i] ?? '').trim();
    });

    const issues: RowIssue[] = [];
    for (const column of TEMPLATE_COLUMNS) {
      const value = values[column.key] ?? '';
      if (!value) {
        if (column.required && present.has(column.key)) {
          issues.push({ column: column.label, message: 'Required, but empty.', severity: 'error' });
        }
        continue;
      }
      if (column.kind === 'number' && Number.isNaN(Number(value))) {
        issues.push({ column: column.label, message: `"${value}" is not a number.`, severity: 'error' });
      }
      if (column.options) {
        const known = column.options().some((option) => norm(option) === norm(value));
        if (!known) {
          issues.push({
            column: column.label,
            message: `"${value}" is not in PACP yet — it will be recorded as written, for an editor to match or create.`,
            severity: 'warning',
          });
        }
      }
    }

    const registration = values.registration_number ?? '';
    if (registration) {
      const first = seenRegistrations.get(norm(registration));
      if (first) {
        issues.push({
          column: 'Registration number',
          message: `Same as row ${first}.`,
          severity: 'error',
        });
      } else seenRegistrations.set(norm(registration), index + 2);
    }

    return { lineNumber: index + 2, values, issues };
  });

  return { rows, unknownColumns, missingColumns };
}

export const rowHasError = (row: ParsedRow) => row.issues.some((i) => i.severity === 'error');

/** A one-line summary of the row, for the review table and the draft title. */
export function rowTitle(row: ParsedRow): string {
  return (
    row.values.name_or_label?.trim() ||
    row.values.registration_number?.trim() ||
    `Row ${row.lineNumber}`
  );
}
