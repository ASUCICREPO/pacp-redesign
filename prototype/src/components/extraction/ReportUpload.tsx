'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FileText, RotateCcw, Square } from 'lucide-react';

import { removeDraft, saveDraft } from '@/lib/extraction/drafts';
import { useReviewState } from '@/lib/extraction/review-state';
import type { ReviewDecision } from '@/lib/extraction/types';
import { useExtraction } from '@/lib/extraction/use-extraction';
import { useStoredUser } from '@/lib/user-storage';
import type { ContributorRole } from '@/types/pacp';

import { CrmReview } from './CrmReview';
import { GradReview } from './GradReview';
import { button, InfoNote, PageHeader, ProgressBar, Toast, UnderlineTabs } from './pacp-ui';
import { StartPanel } from './StartPanel';
import { UndergradReview } from './UndergradReview';

type ViewRole = 'crm_archaeologist' | 'graduate_student' | 'undergraduate_student';

const VIEWS: Array<{ id: ViewRole; label: string }> = [
  { id: 'crm_archaeologist', label: 'CRM Archaeologist' },
  { id: 'graduate_student', label: 'Graduate Student' },
  { id: 'undergraduate_student', label: 'Undergraduate Student' },
];

const viewFor = (role: ContributorRole | null | undefined): ViewRole | null =>
  role === 'specialist' ? 'graduate_student' : (role ?? null);

/**
 * Upload a Report — AI-assisted PDF extraction, in the PACP prototype's own
 * look. The pipeline, verification and review logic are unchanged; this is the
 * interface around them.
 */
export function ReportUpload({ startWithExample = false }: { startWithExample?: boolean }) {
  const { state, runDemo, runLive, cancel, reset, decide } = useExtraction();
  const { user } = useStoredUser();
  const links = useReviewState().links;
  const reviewer = user?.name || 'Unsigned reviewer';

  const [chosenView, setChosenView] = useState<ViewRole | null>(null);
  const view = chosenView ?? viewFor(user?.role) ?? 'crm_archaeologist';

  const [file, setFile] = useState<File | null>(null);
  const pdfUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(
    () => () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    },
    [pdfUrl],
  );

  const [credentialHint, setCredentialHint] = useState<boolean | null>(null);
  useEffect(() => {
    fetch('/api/extract/status')
      .then((r) => r.json())
      .then((d: { credentialHint: boolean }) => setCredentialHint(d.credentialHint))
      .catch(() => setCredentialHint(null));
  }, []);

  // "Try the Example Report" on the Submit page links here with ?example=1.
  const autoStarted = useRef(false);
  useEffect(() => {
    if (startWithExample && !autoStarted.current) {
      autoStarted.current = true;
      void runDemo();
    }
  }, [startWithExample, runDemo]);

  const [toast, setToast] = useState<string | null>(null);
  const dismissToast = useCallback(() => setToast(null), []);

  /** Accepting saves a Draft; anything else takes it back out. */
  const onDecide = useCallback(
    (ids: string[], decision: ReviewDecision) => {
      decide(ids, decision);
      if (!state.document) return;
      let saved = 0;
      for (const id of ids) {
        const item = state.items.find((i) => i.id === id);
        if (!item) continue;
        // A linked extraction belongs to the record it was linked to; it
        // must not also arrive as a new draft.
        if (decision === 'accepted' && !links[id]) {
          saveDraft({
            item,
            stewardship_status: 'draft',
            source: {
              document: state.document,
              citation: state.citation,
              method: state.mode === 'demo' ? 'curated_demo' : 'ai_assisted',
            },
            reviewed_by: reviewer,
            accepted_at: new Date().toISOString(),
          });
          saved++;
        } else {
          removeDraft(id, state.document.fileName);
        }
      }
      if (saved > 0) setToast(saved === 1 ? 'Saved as a draft record' : `${saved} records saved as drafts`);
    },
    [decide, state.document, state.items, state.citation, state.mode, reviewer, links],
  );

  const done = state.chunks.filter((c) => c.status === 'done').length;
  const failed = state.chunks.filter((c) => c.status === 'error');
  const accepted = Object.values(state.decisions).filter((d) => d === 'accepted').length;

  const reviewProps = {
    items: state.items,
    decisions: state.decisions,
    onDecide,
    pdfUrl,
    citation: state.citation,
    document: state.document,
    reviewer,
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <PageHeader
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Submit', href: '/submit' }, { label: 'Extract Records' }]}
        title="Extract records from a report"
        description="Turn a CRM report, thesis, or monograph into PACP records. AI reads every page — including tables — and proposes wares, types, sites, petrographic samples, counts and references. Every proposal cites the page it came from, and nothing becomes part of PACP until you review it."
        callout="Accepting creates a Draft record in PACP. Drafts are not published — they appear in your work table for review before anything becomes part of the database."
      />

      <div className="max-w-[1600px] mx-auto px-6 py-12">
        {state.phase === 'idle' ? (
          <StartPanel credentialHint={credentialHint} onDemo={runDemo} onLive={runLive} onFileChosen={setFile} />
        ) : (
          <div className="space-y-8">
            <section className="bg-card border border-border rounded-lg p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-serif text-foreground">
                      {state.document?.title ?? (state.phase === 'failed' ? 'Extraction did not start' : 'Reading the PDF…')}
                    </h2>
                    {state.document && (
                      <p className="text-sm text-muted-foreground">
                        Pages {state.document.pageRange[0]}–{state.document.pageRange[1]} of {state.document.totalPages} ·{' '}
                        {state.mode === 'demo' ? 'Example records' : 'Extracted with AI (Claude Opus 5)'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {state.phase === 'running' && (
                    <button type="button" className={button.smallNeutral} onClick={cancel}>
                      <Square className="w-3.5 h-3.5" /> Stop
                    </button>
                  )}
                  <button
                    type="button"
                    className={button.smallNeutral}
                    onClick={() => {
                      reset();
                      setFile(null);
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Start Over
                  </button>
                </div>
              </div>

              {state.chunks.length > 0 && (
                <div className="mt-5 pt-5 border-t border-border">
                  <ProgressBar value={(done / state.chunks.length) * 100} className="mb-2" />
                  <p className="text-xs text-muted-foreground">
                    {done} of {state.chunks.length} page ranges read · {state.items.length} proposed records · {accepted} saved
                    as drafts
                    {state.usage &&
                      ` · ${(state.usage.inputTokens + state.usage.outputTokens).toLocaleString()} tokens, about $${state.usage.estimatedCostUsd.toFixed(2)}`}
                  </p>
                </div>
              )}
            </section>

            {state.fatal && <InfoNote tone="warning">{state.fatal}</InfoNote>}
            {failed.length > 0 && (
              <InfoNote tone="warning">
                {failed.length} page range{failed.length === 1 ? '' : 's'} could not be read —{' '}
                {failed.map((c) => `pages ${c.pages[0]}–${c.pages[1]}: ${c.error}`).join('; ')}. Records from the other
                pages are unaffected.
              </InfoNote>
            )}

            {state.mode === 'demo' && (
              <InfoNote
                action={
                  <div className="flex flex-wrap items-center gap-4 whitespace-nowrap">
                    {!file && (
                      <label className="text-sm text-primary hover:underline font-medium cursor-pointer">
                        Attach the PDF
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          className="sr-only"
                          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                        />
                      </label>
                    )}
                    <button
                      type="button"
                      className="text-sm text-primary hover:underline font-medium"
                      onClick={() => {
                        reset();
                        setFile(null);
                      }}
                    >
                      Try with your own PDF →
                    </button>
                  </div>
                }
              >
                This is the example report — no PDF was processed. These records were prepared by hand from the Pueblo
                Grande report so review can be tried without a key or a cost; quote checks and totals are computed
                exactly as in a real run. Attach the report PDF to make page numbers open the page.
              </InfoNote>
            )}

            {state.items.length > 0 && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xs uppercase tracking-wider text-primary mb-3 font-semibold">Review As</h2>
                  <UnderlineTabs<ViewRole> tabs={VIEWS} value={view} onChange={setChosenView} />
                </div>

                {state.briefs && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                    <h3 className="text-xs uppercase tracking-wider text-primary mb-2 font-semibold">What This Report Offers You</h3>
                    <p className="text-foreground leading-relaxed">{state.briefs[view]}</p>
                  </div>
                )}

                {view === 'crm_archaeologist' && <CrmReview {...reviewProps} />}
                {view === 'graduate_student' && <GradReview {...reviewProps} />}
                {view === 'undergraduate_student' && <UndergradReview {...reviewProps} />}
              </div>
            )}
          </div>
        )}
      </div>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
