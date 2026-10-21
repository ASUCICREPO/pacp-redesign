'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Check, CircleCheckBig, Download, FileSpreadsheet, RotateCcw, Upload } from 'lucide-react';

import { saveDraft } from '@/lib/extraction/drafts';
import {
  rowHasError,
  rowTitle,
  TEMPLATE_COLUMNS,
  templateCsv,
  validateSheet,
  type ParsedRow,
  type ParsedSheet,
} from '@/lib/bulk-upload';
import { useStoredUser } from '@/lib/user-storage';

import { button, InfoNote, PageHeader, Pill, SectionLabel, Toast } from './pacp-ui';
import { downloadFile } from './reviewShared';

/** The template, offered wherever someone is about to need it. */
export function downloadTemplate() {
  downloadFile('pacp-bulk-vessel-template.csv', templateCsv(), 'text/csv');
}

function IssueList({ row }: { row: ParsedRow }) {
  if (row.issues.length === 0) {
    return <span className="text-sm text-muted-foreground">Ready</span>;
  }
  return (
    <ul className="space-y-1">
      {row.issues.map((issue, i) => (
        <li key={i} className="flex items-start gap-1.5 text-xs">
          <AlertTriangle
            className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${issue.severity === 'error' ? 'text-destructive' : 'text-secondary-foreground'}`}
          />
          <span className={issue.severity === 'error' ? 'text-destructive' : 'text-muted-foreground'}>
            <span className="font-medium">{issue.column}:</span> {issue.message}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Bulk vessel upload.
 *
 * The Submit page has offered this since the first prototype with no code
 * behind either button. It follows the same rule as the PDF extraction
 * screen: a row is a proposal, importing creates Drafts, and nothing reaches
 * the database until a reviewer promotes it.
 *
 * Rows with an error are never imported. Rows with only a warning are — an
 * unfamiliar site or ware usually means the library has not caught up yet,
 * not that the row is wrong.
 */
export function BulkUpload() {
  const { user } = useStoredUser();
  const reviewer = user?.name || 'Unsigned reviewer';
  const inputRef = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [sheet, setSheet] = useState<ParsedSheet | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [imported, setImported] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  const ready = useMemo(() => (sheet ? sheet.rows.filter((r) => !rowHasError(r)) : []), [sheet]);
  const blocked = useMemo(() => (sheet ? sheet.rows.filter(rowHasError) : []), [sheet]);
  const warned = ready.filter((r) => r.issues.length > 0);

  async function choose(file: File | null) {
    setSheet(null);
    setParseError(null);
    setImported(null);
    setFileName(file?.name ?? null);
    if (!file) return;
    if (!/\.(csv|txt)$/i.test(file.name)) {
      setParseError(
        'Please upload a CSV. In Excel or Numbers, choose File → Export and pick "CSV" — .xlsx is not read here.',
      );
      return;
    }
    try {
      setSheet(validateSheet(await file.text()));
    } catch {
      setParseError('That file could not be read as text.');
    }
  }

  function importRows() {
    if (!sheet || !fileName) return;
    const now = new Date().toISOString();
    for (const row of ready) {
      const fields = TEMPLATE_COLUMNS.filter((c) => (row.values[c.key] ?? '').trim()).map((c) => ({
        label: c.label,
        value: row.values[c.key].trim(),
      }));
      saveDraft({
        item: {
          id: `bulk-${fileName}-${row.lineNumber}`,
          kind: 'vessel',
          title: rowTitle(row),
          subtitle: [row.values.site, row.values.period].filter(Boolean).join(' · ') || null,
          fields,
          pages: [],
          // The row as written is the source text for this record.
          quote: fields.map((f) => `${f.label}: ${f.value}`).join(' · '),
          confidence: 'probable',
          reasoning: `Imported from row ${row.lineNumber} of ${fileName}. Values are as the contributor typed them; nothing was inferred.`,
          verification: 'verified',
          checks: [],
        },
        stewardship_status: 'draft',
        source: {
          document: { fileName, title: fileName, totalPages: sheet.rows.length, pageRange: [1, sheet.rows.length] },
          citation: null,
          method: 'bulk_upload',
          row: row.lineNumber,
        },
        reviewed_by: reviewer,
        accepted_at: now,
      });
    }
    setImported(ready.length);
    setToast(`${ready.length} ${ready.length === 1 ? 'row' : 'rows'} saved as drafts`);
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Submit', href: '/submit' }, { label: 'Bulk Upload' }]}
        title="Bulk vessel upload"
        description="Import many vessels at once from a spreadsheet. Each row is checked against PACP's own sites, regions, periods, wares and types before anything is created."
        callout="Importing creates Draft records. Drafts are not published — they appear in your work table for review before anything becomes part of the database."
      />

      <div className="max-w-[1600px] mx-auto px-6 py-12 space-y-8">
        {imported !== null ? (
          <div className="max-w-xl mx-auto text-center">
            <CircleCheckBig className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="font-serif text-foreground mb-3">
              {imported} {imported === 1 ? 'draft' : 'drafts'} created
            </h2>
            <p className="text-muted-foreground mb-6">
              They are in your work table, each carrying the file and row it came from. Nothing has been published.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/browse?status=draft&owner=me" className={button.primary}>
                Open the work table
              </a>
              <button
                type="button"
                className={button.neutral}
                onClick={() => {
                  void choose(null);
                }}
              >
                <RotateCcw className="w-4 h-4" /> Upload another file
              </button>
            </div>
          </div>
        ) : (
          <>
            <section>
              <SectionLabel>1 · Get the template</SectionLabel>
              <div className="bg-card border border-border rounded-lg p-6 flex flex-wrap items-start gap-6">
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-[260px]">
                  <p className="text-muted-foreground mb-4">
                    {TEMPLATE_COLUMNS.length} columns, of which{' '}
                    {TEMPLATE_COLUMNS.filter((c) => c.required).length} are required. The file includes one worked
                    example row — delete it before uploading. Partial rows are fine; anything left blank can be filled
                    in on the record later.
                  </p>
                  <button type="button" className={button.outline} onClick={downloadTemplate}>
                    <Download className="w-4 h-4" /> Download template (CSV)
                  </button>
                </div>
              </div>
            </section>

            <section>
              <SectionLabel>2 · Upload your file</SectionLabel>
              <input
                ref={inputRef}
                type="file"
                accept=".csv,text/csv,text/plain"
                className="sr-only"
                onChange={(e) => void choose(e.target.files?.[0] ?? null)}
              />
              {!sheet ? (
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    void choose(e.dataTransfer.files?.[0] ?? null);
                  }}
                  className={`w-full rounded-lg border-2 border-dashed px-6 py-12 text-center transition-colors ${
                    dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
                  <span className="block text-foreground font-medium">Drop a CSV here, or click to browse</span>
                  <span className="block text-sm text-muted-foreground mt-1">
                    Export from Excel or Numbers as CSV
                  </span>
                </button>
              ) : (
                <div className="bg-card border border-border rounded-lg p-6 flex flex-wrap items-center gap-4">
                  <FileSpreadsheet className="w-5 h-5 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-foreground font-medium">{fileName}</p>
                    <p className="text-sm text-muted-foreground">
                      {sheet.rows.length} {sheet.rows.length === 1 ? 'row' : 'rows'} · {ready.length} ready ·{' '}
                      {blocked.length} with errors
                    </p>
                  </div>
                  <button type="button" className={button.smallNeutral} onClick={() => void choose(null)}>
                    <RotateCcw className="w-3.5 h-3.5" /> Choose another
                  </button>
                </div>
              )}
              {parseError && <InfoNote tone="warning">{parseError}</InfoNote>}
            </section>

            {sheet && (
              <section>
                <SectionLabel>3 · Check the rows</SectionLabel>

                {sheet.missingColumns.length > 0 && (
                  <InfoNote tone="warning">
                    The file has no column for {sheet.missingColumns.join(', ')}. That column is required — add it to
                    the header row and upload again.
                  </InfoNote>
                )}
                {sheet.unknownColumns.length > 0 && (
                  <InfoNote>
                    Ignoring {sheet.unknownColumns.length} column
                    {sheet.unknownColumns.length === 1 ? '' : 's'} the template does not define:{' '}
                    {sheet.unknownColumns.join(', ')}. Put anything you want to keep in the Notes column.
                  </InfoNote>
                )}

                <div className="flex flex-wrap items-center gap-3 my-5">
                  <button
                    type="button"
                    className={button.primary}
                    disabled={ready.length === 0}
                    onClick={importRows}
                  >
                    <Check className="w-4 h-4" /> Import {ready.length} {ready.length === 1 ? 'row' : 'rows'} as
                    Drafts
                  </button>
                  {blocked.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {blocked.length} {blocked.length === 1 ? 'row is' : 'rows are'} held back. Fix them in the
                      spreadsheet and upload again.
                    </span>
                  )}
                  {blocked.length === 0 && warned.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {warned.length} {warned.length === 1 ? 'row has' : 'rows have'} a warning but will import.
                    </span>
                  )}
                </div>

                <div className="bg-card border border-border rounded-lg overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm w-16">Row</th>
                        <th className="text-left px-4 py-3 text-sm">Vessel</th>
                        <th className="text-left px-4 py-3 text-sm">Site &amp; period</th>
                        <th className="text-left px-4 py-3 text-sm min-w-[280px]">Checks</th>
                        <th className="text-left px-4 py-3 text-sm w-32">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sheet.rows.map((row) => {
                        const failed = rowHasError(row);
                        return (
                          <tr
                            key={row.lineNumber}
                            className={`border-b border-border last:border-0 align-top ${failed ? 'opacity-70' : ''}`}
                          >
                            <td className="px-4 py-3 text-sm text-muted-foreground">{row.lineNumber}</td>
                            <td className="px-4 py-3 text-sm text-foreground font-medium">{rowTitle(row)}</td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {[row.values.site, row.values.period].filter(Boolean).join(' · ') || '—'}
                            </td>
                            <td className="px-4 py-3">
                              <IssueList row={row} />
                            </td>
                            <td className="px-4 py-3">
                              {failed ? (
                                <Pill tone="destructive">Not imported</Pill>
                              ) : row.issues.length > 0 ? (
                                <Pill tone="secondary">Imports with warning</Pill>
                              ) : (
                                <Pill tone="primary">Ready</Pill>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
