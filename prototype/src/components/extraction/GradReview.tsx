'use client';

import { useMemo, useState } from 'react';
import { Database, Eye } from 'lucide-react';

import { VERIFICATION_EXPLANATIONS } from '@/lib/extraction/glossary';
import { ITEM_KIND_META } from '@/lib/extraction/types';
import type { ItemKind } from '@/lib/extraction/types';

import { ChecksList, ConfidenceBadge, PageLinks, VerificationBadge } from './ItemBadges';
import { ItemMatchPanel } from './MatchCallout';
import { button } from './pacp-ui';
import {
  AcceptanceNote,
  BulkActions,
  DecisionButtons,
  downloadFile,
  KindSideList,
  needsAttention,
  type ReviewProps,
} from './reviewShared';
import { useReviewState } from '@/lib/extraction/review-state';

/**
 * Graduate student view — record cards in the style of the prototype's detail
 * pages, showing why each record was extracted and what it rests on.
 *
 * The scope document asks that PACP "teach reasoning rather than merely
 * returning answers"; "Needs a Closer Look" surfaces the records where that
 * reasoning is weakest.
 */
export function GradReview({ items, decisions, onDecide, pdfUrl, citation, document, reviewer }: ReviewProps) {
  const links = useReviewState().links;
  const [kind, setKind] = useState<ItemKind | 'all'>('all');
  const [attentionOnly, setAttentionOnly] = useState(false);

  const visible = useMemo(
    () => items.filter((i) => (kind === 'all' || i.kind === kind) && (!attentionOnly || needsAttention(i))),
    [items, kind, attentionOnly],
  );
  const attentionCount = items.filter(needsAttention).length;
  const accepted = items.filter((i) => decisions[i.id] === 'accepted');
  const pending = items.filter((i) => (decisions[i.id] ?? 'pending') === 'pending' && !links[i.id]);

  function exportDataset() {
    const dataset = {
      source: { document, citation },
      exported_at: new Date().toISOString(),
      note:
        'AI-assisted extraction, individually reviewed. Each record carries the page, quote and checks it rests on; confidence reflects how clearly the source states it, not whether the interpretation is correct.',
      records: accepted.map(({ id, ...record }) => ({ extraction_id: id, ...record })),
    };
    downloadFile(
      `${(document?.fileName ?? 'report').replace(/\.pdf$/i, '')}-dataset.json`,
      JSON.stringify(dataset, null, 2),
      'application/json',
    );
  }

  return (
    <div className="flex gap-12">
      <aside className="hidden lg:block w-56 shrink-0">
        <KindSideList items={items} value={kind} onChange={setKind} />
      </aside>

      <div className="flex-1 min-w-0 space-y-6">
        <div className="space-y-3">
          <AcceptanceNote />
          <BulkActions pending={pending} onDecide={onDecide} />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={attentionOnly ? button.smallPrimary : button.smallNeutral}
            onClick={() => setAttentionOnly((v) => !v)}
          >
            <Eye className="w-4 h-4" /> Needs a Closer Look ({attentionCount})
          </button>
          <button type="button" className={`${button.smallNeutral} ml-auto`} disabled={accepted.length === 0} onClick={exportDataset}>
            <Database className="w-4 h-4" /> Export Dataset ({accepted.length})
          </button>
        </div>

        <div className="grid xl:grid-cols-2 gap-6">
          {visible.map((item) => {
            const decision = decisions[item.id] ?? 'pending';
            return (
              <article
                key={item.id}
                className={`flex flex-col bg-card rounded-lg p-6 border transition-all ${
                  needsAttention(item) ? 'border-secondary' : 'border-border'
                } ${decision === 'rejected' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-primary mb-1 font-semibold">
                      {ITEM_KIND_META[item.kind].label}
                    </p>
                    <h3 className="font-serif text-foreground">{item.title}</h3>
                    {item.subtitle && <p className="text-sm text-muted-foreground">{item.subtitle}</p>}
                  </div>
                  <PageLinks pages={item.pages} pdfUrl={pdfUrl} />
                </div>

                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm mb-5">
                  {item.fields.map((f) => (
                    <div key={f.label} className="contents">
                      <dt className="text-muted-foreground">{f.label}</dt>
                      <dd className="text-foreground">{f.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="bg-muted/50 rounded-lg p-4 mb-5 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-primary font-semibold">Evidence</h4>
                  <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-foreground italic">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <div className="flex flex-wrap items-center gap-2">
                    <VerificationBadge verification={item.verification} />
                    <ConfidenceBadge confidence={item.confidence} />
                  </div>
                  <p className="text-xs text-muted-foreground">{VERIFICATION_EXPLANATIONS[item.verification]}</p>
                </div>

                <div className="mb-5 space-y-2">
                  <h4 className="text-xs uppercase tracking-wider text-primary font-semibold">Why This Was Extracted</h4>
                  <p className="text-sm text-foreground leading-relaxed">{item.reasoning}</p>
                </div>

                {item.checks.length > 0 && (
                  <div className="mb-5">
                    <ChecksList checks={item.checks} />
                  </div>
                )}

                <div className="mb-5 empty:mb-0">
                  <ItemMatchPanel item={item} document={document} citation={citation} reviewer={reviewer} />
                </div>

                <div className="mt-auto pt-4 border-t border-border">
                  <DecisionButtons
                    id={item.id}
                    decision={decision}
                    onDecide={onDecide}
                    linkedTo={links[item.id]?.targetName}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
