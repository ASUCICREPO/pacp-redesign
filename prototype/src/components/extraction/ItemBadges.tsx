import { AlertTriangle, CheckCircle2, CircleHelp, ExternalLink, XCircle } from 'lucide-react';

import { VERIFICATION_EXPLANATIONS } from '@/lib/extraction/glossary';
import type { ConsistencyCheck, ExtractedItem, Verification } from '@/lib/extraction/types';

import { Pill } from './pacp-ui';

/**
 * Verification maps onto the prototype's own stewardship colours, so the
 * states read the way PACP users already know: primary for solid ground,
 * sand ("Needs Review") for "check this", muted ("Draft") for unconfirmed.
 */
const VERIFICATION: Record<Verification, { label: string; tone: 'primary' | 'secondary' | 'muted'; icon: typeof CheckCircle2 }> = {
  verified: { label: 'Quote found on page', tone: 'primary', icon: CheckCircle2 },
  partial: { label: 'Check the row on the page', tone: 'secondary', icon: AlertTriangle },
  unverified: { label: 'Not matched', tone: 'muted', icon: CircleHelp },
};

export function VerificationBadge({ verification }: { verification: Verification }) {
  const v = VERIFICATION[verification];
  return (
    <Pill tone={v.tone} title={VERIFICATION_EXPLANATIONS[verification]}>
      <v.icon />
      {v.label}
    </Pill>
  );
}

/** Confidence stops at "probable" — PACP never marks anything certain. */
export function ConfidenceBadge({ confidence }: { confidence: ExtractedItem['confidence'] }) {
  return (
    <Pill tone="muted" title="How clearly the source states this. PACP never marks an extraction as certain.">
      <span className="capitalize">{confidence}</span>
    </Pill>
  );
}

export function ChecksList({ checks }: { checks: ConsistencyCheck[] }) {
  if (checks.length === 0) return null;
  return (
    <div className="space-y-2">
      {checks.map((check) => (
        <div
          key={check.label}
          className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
            check.ok ? 'bg-primary/5 border-primary/20' : 'bg-destructive/5 border-destructive/30'
          }`}
        >
          {check.ok ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
          ) : (
            <XCircle className="w-4 h-4 mt-0.5 shrink-0 text-destructive" />
          )}
          <span className="text-foreground">
            <span className="font-medium">{check.label}.</span>{' '}
            <span className="text-muted-foreground">{check.detail}</span>
          </span>
        </div>
      ))}
    </div>
  );
}

/** Page reference; opens the PDF at that page when one is loaded. */
export function PageLinks({ pages, pdfUrl }: { pages: number[]; pdfUrl: string | null }) {
  if (pages.length === 0) return <span className="text-sm text-muted-foreground">No page cited</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-2 text-sm">
      {pages.map((page) =>
        pdfUrl ? (
          <a
            key={page}
            href={`${pdfUrl}#page=${page}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
          >
            p. {page}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span key={page} className="text-foreground font-medium">
            p. {page}
          </span>
        ),
      )}
    </span>
  );
}
