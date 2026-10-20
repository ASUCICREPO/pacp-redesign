'use client';

import { useState } from 'react';
import { BookOpen, Check, ChevronLeft, ChevronRight, HelpCircle, Search, X } from 'lucide-react';

import { GLOSSARY, KIND_EXPLANATIONS } from '@/lib/extraction/glossary';
import { ITEM_KIND_META } from '@/lib/extraction/types';

import { ChecksList, PageLinks } from './ItemBadges';
import { ItemMatchPanel } from './MatchCallout';
import { button, ProgressBar } from './pacp-ui';
import { AcceptanceNote, type ReviewProps } from './reviewShared';
import { useReviewState } from '@/lib/extraction/review-state';

const PLAIN_VERIFICATION = {
  verified: 'Good sign: PACP found this exact passage on the page.',
  partial:
    'Look carefully: the words are on the page, but in a different order. That usually means it came from a table.',
  unverified: 'PACP could not find this passage in the page text. Open the page and look for it yourself.',
} as const;

/**
 * Undergraduate view — one record at a time, in the layout of the prototype's
 * guided Identify flow, with its "Back / Next" action bar.
 *
 * "I'm Not Sure" is a first-class answer: the Identify-a-Sherd workflow says
 * users must be able to end without forced certainty.
 */
export function UndergradReview({ items, decisions, onDecide, pdfUrl, citation, document, reviewer }: ReviewProps) {
  const [index, setIndex] = useState(0);
  const links = useReviewState().links;

  if (items.length === 0) return null;
  const current = Math.min(index, items.length - 1);
  const item = items[current];
  const decision = decisions[item.id] ?? 'pending';
  const checked = items.filter((i) => (decisions[i.id] ?? 'pending') !== 'pending').length;
  const explanation = KIND_EXPLANATIONS[item.kind];

  const advance = () => setIndex((i) => Math.min(i + 1, items.length - 1));
  const choose = (next: 'accepted' | 'rejected') => {
    onDecide([item.id], next);
    advance();
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <article className="bg-card border border-border rounded-2xl p-6">
          <p className="text-xs text-muted-foreground mb-1">
            Record {current + 1} of {items.length}
          </p>
          <p className="text-xs uppercase tracking-wider text-primary mb-1 font-semibold">{ITEM_KIND_META[item.kind].label}</p>
          <h2 className="font-serif text-foreground text-2xl mb-4">{item.title}</h2>

          <div className="flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 text-sm text-primary mb-6">
            <HelpCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold">What is this? </span>
              {explanation.what}
            </span>
          </div>

          {item.fields.length > 0 && (
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-sm mb-6">
              {item.fields.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="text-muted-foreground">{f.label}</dt>
                  <dd className="text-foreground">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="bg-muted/50 rounded-lg p-5 mb-6 space-y-3">
            <h3 className="flex items-center gap-2 font-serif text-foreground">
              <Search className="w-4 h-4 text-primary" /> Find It in the Report
            </h3>
            <p className="text-sm text-muted-foreground">
              Look on <PageLinks pages={item.pages} pdfUrl={pdfUrl} /> for this passage:
            </p>
            <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-foreground italic">
              &ldquo;{item.quote}&rdquo;
            </blockquote>
            <p className={`text-sm ${item.verification === 'verified' ? 'text-primary' : 'text-secondary-foreground'}`}>
              {PLAIN_VERIFICATION[item.verification]}
            </p>
            <ChecksList checks={item.checks} />
          </div>

          <div className="border border-border rounded-lg p-4 mb-6">
            <h4 className="text-xs uppercase tracking-wider text-primary mb-2 font-semibold">Your Check</h4>
            <p className="text-sm text-foreground">{explanation.check}</p>
          </div>

          <div className="mb-5 empty:mb-0">
            <ItemMatchPanel item={item} document={document} citation={citation} reviewer={reviewer} />
          </div>

          <div className="mb-4">
            <AcceptanceNote />
          </div>

          {links[item.id] ? (
            <p className="text-sm text-primary font-medium">
              Linked to {links[item.id].targetName} — no new record was created.
            </p>
          ) : decision === 'pending' ? (
            <div className="flex flex-wrap gap-3">
              <button type="button" className={button.primary} onClick={() => choose('accepted')}>
                <Check className="w-4 h-4" /> Looks Right — Accept as Draft
              </button>
              <button type="button" className={button.outline} onClick={advance}>
                I&rsquo;m Not Sure — Skip for Now
              </button>
              <button type="button" className={button.neutral} onClick={() => choose('rejected')}>
                <X className="w-4 h-4" /> Doesn&rsquo;t Match — Don&rsquo;t Create
              </button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              You marked this as{' '}
              <span className="text-foreground font-medium">{decision === 'accepted' ? 'looks right' : 'doesn’t match'}</span>.{' '}
              <button type="button" className={button.link} onClick={() => onDecide([item.id], 'pending')}>
                Change your answer
              </button>
            </p>
          )}
        </article>

        <aside className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h4 className="text-xs uppercase tracking-wider text-primary mb-3 font-semibold">Records Checked</h4>
            <ProgressBar value={(checked / items.length) * 100} className="mb-2" />
            <p className="text-xs text-muted-foreground">
              {checked} of {items.length} checked
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 lg:sticky lg:top-24">
            <h3 className="flex items-center gap-2 font-serif text-foreground mb-4">
              <BookOpen className="w-4 h-4 text-primary" /> Key Terms
            </h3>
            <dl className="space-y-3">
              {GLOSSARY.map((g) => (
                <div key={g.term}>
                  <dt className="text-sm text-foreground font-medium">{g.term}</dt>
                  <dd className="text-xs text-muted-foreground leading-relaxed">{g.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <div className="sticky bottom-0 mt-8 bg-card border-t border-border shadow-lg rounded-t-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <button type="button" className={button.neutral} disabled={current === 0} onClick={() => setIndex(Math.max(current - 1, 0))}>
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-sm text-muted-foreground">
            Record {current + 1} of {items.length}
          </span>
          <button type="button" className={button.primary} disabled={current >= items.length - 1} onClick={advance}>
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
