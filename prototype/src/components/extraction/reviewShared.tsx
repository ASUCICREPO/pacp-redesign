'use client';

import { useState } from 'react';
import { AlertTriangle, Check, CheckCheck, Link2, Undo2, X } from 'lucide-react';

import { ITEM_KIND_META } from '@/lib/extraction/types';
import type { DocumentMeta, ExtractedItem, ItemKind, ReviewDecision } from '@/lib/extraction/types';

import { button, SideList } from './pacp-ui';

export interface ReviewProps {
  items: ExtractedItem[];
  decisions: Record<string, ReviewDecision>;
  onDecide: (ids: string[], decision: ReviewDecision) => void;
  pdfUrl: string | null;
  citation: string | null;
  document: DocumentMeta | null;
  /** Who is reviewing — recorded on any link they make. */
  reviewer: string;
}

/** Items a reviewer should look at closely before accepting. */
export const needsAttention = (item: ExtractedItem) =>
  item.verification !== 'verified' || item.confidence === 'tentative' || item.checks.some((c) => !c.ok);

/** Record-type filter, styled as the Submit page's "Jump to Section" list. */
export function KindSideList({
  items,
  value,
  onChange,
}: {
  items: ExtractedItem[];
  value: ItemKind | 'all';
  onChange: (kind: ItemKind | 'all') => void;
}) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1;
    return acc;
  }, {});
  const kinds = (Object.keys(ITEM_KIND_META) as ItemKind[]).filter((k) => counts[k]);

  return (
    <SideList<ItemKind | 'all'>
      heading="Record Types"
      value={value}
      onChange={onChange}
      items={[
        { id: 'all', label: 'All records', count: items.length },
        ...kinds.map((k) => ({ id: k, label: ITEM_KIND_META[k].plural, count: counts[k] })),
      ]}
    />
  );
}

export function DecisionButtons({
  id,
  decision,
  onDecide,
  linkedTo,
}: {
  id: string;
  decision: ReviewDecision;
  onDecide: ReviewProps['onDecide'];
  /** Set when the reviewer pointed this extraction at an existing record. */
  linkedTo?: string;
}) {
  if (linkedTo) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
        <Link2 className="w-4 h-4" /> Linked to {linkedTo}
      </span>
    );
  }
  if (decision !== 'pending') {
    return (
      <span className="inline-flex items-center gap-3 text-sm">
        <span className={`inline-flex items-center gap-1 font-medium ${decision === 'accepted' ? 'text-primary' : 'text-muted-foreground'}`}>
          {decision === 'accepted' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {decision === 'accepted' ? 'Saved as draft' : 'Rejected'}
        </span>
        <button
          type="button"
          onClick={() => onDecide([id], 'pending')}
          className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
        >
          <Undo2 className="w-3.5 h-3.5" /> Undo
        </button>
      </span>
    );
  }
  // The labels say what the buttons do. "Accept" read to reviewers as
  // "publish"; accepting only ever creates a Draft.
  return (
    <span className="flex flex-wrap items-center gap-2">
      <button type="button" className={button.smallPrimary} onClick={() => onDecide([id], 'accepted')}>
        <Check className="w-3.5 h-3.5" /> Accept as Draft
      </button>
      <button type="button" className={button.smallNeutral} onClick={() => onDecide([id], 'rejected')}>
        <X className="w-3.5 h-3.5" /> Reject &mdash; don&rsquo;t create
      </button>
    </span>
  );
}

/**
 * What accepting actually does, said once at the top of every review.
 *
 * Reviewers read "Accept" as "publish". Nothing here publishes: an accepted
 * record is a Draft sitting in the reviewer's own work table until someone
 * promotes it.
 */
export function AcceptanceNote() {
  return (
    <p className="text-sm text-muted-foreground">
      Accepting creates a <span className="text-foreground font-medium">Draft</span> record in PACP. Drafts are not
      published &mdash; they appear in your work table for review before anything becomes part of the database.
    </p>
  );
}

/**
 * Accept all / Reject all.
 *
 * Rejecting in bulk is the only irreversible-feeling action on this screen, so
 * it asks first and says exactly how many records it is about to drop.
 */
export function BulkActions({
  pending,
  onDecide,
  className,
}: {
  pending: ExtractedItem[];
  onDecide: ReviewProps['onDecide'];
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const count = pending.length;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className={button.smallPrimary}
          disabled={count === 0}
          onClick={() => onDecide(pending.map((i) => i.id), 'accepted')}
        >
          <CheckCheck className="w-4 h-4" /> Accept all as Drafts ({count})
        </button>
        <button
          type="button"
          className={button.smallNeutral}
          disabled={count === 0}
          onClick={() => setConfirming(true)}
        >
          <X className="w-4 h-4" /> Reject all ({count})
        </button>
      </div>

      {confirming && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="reject-all-heading"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirming(false);
          }}
        >
          <div className="w-full max-w-md bg-card border border-border rounded-lg p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
              <div>
                <h3 id="reject-all-heading" className="font-serif text-foreground">
                  Reject all {count} remaining {count === 1 ? 'record' : 'records'}?
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  No drafts will be created for them. Records you already accepted are not affected, and you can undo
                  any single rejection afterwards.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className={button.neutral} onClick={() => setConfirming(false)}>
                Keep reviewing
              </button>
              <button
                type="button"
                className={button.primary}
                onClick={() => {
                  onDecide(pending.map((i) => i.id), 'rejected');
                  setConfirming(false);
                }}
              >
                Reject all {count}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function downloadFile(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = window.document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export function itemsToCsv(items: ExtractedItem[], citation: string | null): string {
  const header = ['Kind', 'Title', 'Details', 'Pages', 'Quote', 'Confidence', 'Verification', 'Checks', 'Source'];
  const rows = items.map((item) => [
    ITEM_KIND_META[item.kind].label,
    item.title,
    item.fields.map((f) => `${f.label}: ${f.value}`).join('; '),
    item.pages.join(', '),
    item.quote,
    item.confidence,
    item.verification,
    item.checks.map((c) => `${c.label} (${c.detail})`).join('; '),
    citation ?? '',
  ]);
  return [header, ...rows].map((r) => r.map((v) => csvCell(String(v))).join(',')).join('\n');
}
