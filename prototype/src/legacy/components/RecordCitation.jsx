import { Check, ClipboardCopy, Download } from 'lucide-react';
import { useState } from 'react';

/**
 * Recommended citation and data export for a record.
 *
 * FR-14.2.4 asks for a generated citation per record, and FR-14.2.2 for export
 * in CSV and JSON. Both are FAIR requirements: a record nobody can cite or
 * take away with them is not really reusable.
 *
 * The citation names a version and an access date because PACP records are
 * revisable — what someone cites is a record *as it stood*, not a fixed fact.
 */

const DEFAULT_LICENCE = 'CC BY 4.0';

function download(name, contents, type) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

export function RecordCitation({ record, recordType = 'Record', version = 1, licence = DEFAULT_LICENCE }) {
  const [copied, setCopied] = useState(false);

  const accessed = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const url = typeof window === 'undefined' ? '' : window.location.href;
  const contributor = record.contributor || 'Pan-American Ceramics Project';

  const citation = `${contributor}. “${record.name}” (${recordType.toLowerCase()} record ${record.id}, version ${version}). Pan-American Ceramics Project. Licensed under ${licence}. Accessed ${accessed}. ${url}`;

  const exportable = {
    record_id: record.id,
    record_type: recordType,
    version,
    licence,
    citation,
    accessed,
    ...record,
  };

  const baseName = `pacp-${String(record.id).toLowerCase()}`;

  async function copy() {
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section id="citation">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-foreground">Recommended Citation</h2>
        <span className="text-xs text-muted-foreground">Licensed under {licence}</span>
      </div>
      <div className="bg-card border border-border rounded-lg p-6">
        <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-lg p-4">{citation}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Records are revised over time. Cite the version and access date so a reader can tell which state of the
          record you worked from.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            {copied ? <Check className="w-4 h-4" /> : <ClipboardCopy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Citation'}
          </button>
          <button
            type="button"
            onClick={() => download(`${baseName}.json`, JSON.stringify(exportable, null, 2), 'application/json')}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              const entries = Object.entries(exportable).filter(([, v]) => typeof v !== 'object' || v === null);
              const csv = `${entries.map(([k]) => csvCell(k)).join(',')}\n${entries
                .map(([, v]) => csvCell(v))
                .join(',')}`;
              download(`${baseName}.csv`, csv, 'text/csv');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
    </section>
  );
}

export default RecordCitation;
