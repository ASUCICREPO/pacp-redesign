'use client';

import { useRef, useState } from 'react';
import { BookOpen, Check, ClipboardCopy, FileText, Loader2, Upload, X } from 'lucide-react';

import { EST_USD_PER_PAGE } from '@/lib/extraction/use-extraction';

import { button, inputClass, Pill } from './pacp-ui';

interface Props {
  credentialHint: boolean | null;
  onDemo: () => void;
  onLive: (file: File, range: [number, number]) => void;
  onFileChosen: (file: File | null) => void;
}

const ENV_LINE = 'ANTHROPIC_API_KEY=sk-ant-...';

/**
 * How to add a key, kept out of the way.
 *
 * The page used to carry a standing warning about `.env.local`, which read
 * as "configure this before anything works" — the opposite of true, since the
 * example report needs nothing. The instructions live here instead, reachable
 * only by someone who has chosen the upload path.
 */
function ApiKeyModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ENV_LINE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard can be blocked; the line is on screen to copy by hand.
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-key-heading"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 id="api-key-heading" className="font-serif text-foreground">
            Add an Anthropic API key
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground">
          Only needed to extract from your own PDF. The example report runs without one.
        </p>

        <ol className="space-y-3 text-sm text-foreground">
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
              1
            </span>
            <span>
              Create a key at{' '}
              <a
                href="https://console.anthropic.com/settings/keys"
                target="_blank"
                rel="noreferrer"
                className={button.link}
              >
                console.anthropic.com
              </a>
              .
            </span>
          </li>
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
              2
            </span>
            <span>
              Add this line to <code className="text-xs">.env.local</code> in the project folder:
            </span>
          </li>
        </ol>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2">
          <code className="flex-1 min-w-0 truncate text-xs text-foreground">{ENV_LINE}</code>
          <button type="button" onClick={copy} className={`${button.smallNeutral} shrink-0`}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <ClipboardCopy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <ol className="text-sm text-foreground" start={3}>
          <li className="flex gap-3">
            <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
              3
            </span>
            <span>Restart the dev server.</span>
          </li>
        </ol>

        <div className="flex justify-end pt-1">
          <button type="button" className={button.primary} onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

/** A stand-in for the report's cover — the volume is a tDAR PDF, not an image. */
function ExampleCover() {
  return (
    <div className="rounded-lg border border-border bg-muted/60 px-4 py-5 text-center">
      <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
      <p className="text-xs uppercase tracking-wider text-muted-foreground">Soil Systems Publications</p>
      <p className="text-sm text-foreground font-medium leading-snug mt-1">The Pueblo Grande Project</p>
      <p className="text-xs text-muted-foreground">Ceramics · Part One · Abbott (ed.) 1994</p>
    </div>
  );
}

/**
 * Start screen: pick a path, rather than face a dropzone you cannot use yet.
 *
 * The two actions were previously side by side as equals, but only one of them
 * worked on arrival — "Extract Records" needed both a file and an API key, and
 * said neither. The example is now the recommended path and the upload path
 * only asks for a decision once a file is actually there.
 */
export function StartPanel({ credentialHint, onDemo, onLive, onFileChosen }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const [keyWarning, setKeyWarning] = useState(false);

  async function choose(next: File | null) {
    setFile(next);
    onFileChosen(next);
    setPageCount(null);
    setReadError(null);
    setKeyWarning(false);
    if (!next) return;
    if (next.type && next.type !== 'application/pdf') {
      setReadError('That file is not a PDF.');
      return;
    }
    setReading(true);
    try {
      // Loaded on demand — only needed once someone picks a file.
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.load(await next.arrayBuffer(), { ignoreEncryption: true, updateMetadata: false });
      const count = doc.getPageCount();
      setPageCount(count);
      setFrom(1);
      setTo(count);
    } catch {
      setReadError('Could not read this PDF. It may be damaged or password-protected.');
    } finally {
      setReading(false);
    }
  }

  const pages = pageCount ? Math.max(0, Math.min(to, pageCount) - Math.max(from, 1) + 1) : 0;
  const [low, high] = EST_USD_PER_PAGE.map((rate) => rate * pages);
  const hasKey = credentialHint !== false;
  const ready = Boolean(file) && pageCount !== null && pages > 0 && !reading;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="font-serif text-foreground text-xl">How would you like to start?</h2>
        <p className="text-sm text-muted-foreground">
          Extracted records are saved as Drafts. You review every one before it becomes part of PACP.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 items-stretch">
        {/* Recommended: works on arrival, with nothing to configure. */}
        <section className="relative flex h-full flex-col rounded-xl border-2 border-primary bg-primary/5 p-6">
          <span className="absolute right-4 top-4">
            <Pill tone="primary">Recommended</Pill>
          </span>
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-foreground font-semibold mb-2">Try the example report</h3>
          <p className="text-sm text-muted-foreground mb-5">
            See how extraction works with a real archaeological report — no setup, no API key needed.
          </p>

          <div className="mb-5">
            <ExampleCover />
          </div>

          <div className="mt-auto space-y-2">
            <button type="button" className={button.primary} onClick={onDemo}>
              Try the example →
            </button>
            <p className="text-xs text-muted-foreground">489 pages · 29 records · ready in seconds</p>
          </div>
        </section>

        {/* The upload path only asks for a decision once there is a file. */}
        <section className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary mb-4">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-foreground font-semibold mb-2">Upload your own PDF</h3>
          <p className="text-sm text-muted-foreground mb-5">
            A CRM report, thesis, or monograph you want to extract records from.
          </p>

          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="sr-only"
            onChange={(e) => void choose(e.target.files?.[0] ?? null)}
          />

          {!file ? (
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
              className={`w-full rounded-lg border-2 border-dashed px-6 py-10 text-center transition-colors ${
                dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
            >
              <FileText className="w-8 h-8 text-primary mx-auto mb-3" />
              <span className="block text-foreground font-medium">Drop a PDF here, or click to browse</span>
              <span className="block text-sm text-muted-foreground mt-1">PDF up to 500 MB</span>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border bg-input-background px-4 py-3">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground font-medium">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                    {reading && ' · reading…'}
                    {pageCount !== null && ` · ${pageCount} ${pageCount === 1 ? 'page' : 'pages'}`}
                  </p>
                </div>
                <button type="button" className={button.link + ' text-sm'} onClick={() => void choose(null)}>
                  Change
                </button>
              </div>

              {readError && <p className="text-sm text-destructive">{readError}</p>}

              {pageCount !== null && (
                <div className="space-y-2">
                  <label className="block text-sm text-foreground font-medium">Pages to process</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={from}
                      onChange={(e) => setFrom(Number(e.target.value))}
                      aria-label="From page"
                      className={`${inputClass} max-w-[110px] py-2`}
                    />
                    <span className="text-sm text-muted-foreground">to</span>
                    <input
                      type="number"
                      min={1}
                      max={pageCount}
                      value={to}
                      onChange={(e) => setTo(Number(e.target.value))}
                      aria-label="To page"
                      className={`${inputClass} max-w-[110px] py-2`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pages} {pages === 1 ? 'page' : 'pages'} · rough estimate{' '}
                    <span className="text-foreground font-medium">
                      ${low.toFixed(2)}–${high.toFixed(2)}
                    </span>
                    . Start with one chapter to check quality before running a whole volume.
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mt-auto pt-5 space-y-2">
            {/* No file: nothing to decide yet, so no button at all. */}
            {file && (
              <button
                type="button"
                className={hasKey ? button.primary : button.outline}
                disabled={!ready}
                onClick={() => {
                  if (!hasKey) {
                    setKeyWarning(true);
                    return;
                  }
                  if (file) onLive(file, [from, to]);
                }}
              >
                {reading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Reading the PDF…
                  </>
                ) : (
                  'Extract records →'
                )}
              </button>
            )}

            {file && keyWarning && !hasKey && (
              <p className="text-xs text-muted-foreground">
                No API key detected —{' '}
                <button type="button" className={button.link} onClick={() => setShowKeyHelp(true)}>
                  set it up
                </button>{' '}
                or{' '}
                <button type="button" className={button.link} onClick={onDemo}>
                  try the example report
                </button>{' '}
                instead.
              </p>
            )}

            {!keyWarning && (
              <p className="text-xs text-muted-foreground">
                Requires an Anthropic API key.{' '}
                <button type="button" className={button.link} onClick={() => setShowKeyHelp(true)}>
                  Set up →
                </button>
              </p>
            )}
          </div>
        </section>
      </div>

      {showKeyHelp && <ApiKeyModal onClose={() => setShowKeyHelp(false)} />}
    </div>
  );
}
