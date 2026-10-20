'use client';

import { Fragment, useMemo, useState } from 'react';
import { Check, ChevronDown, ClipboardCopy, Download, ListChecks } from 'lucide-react';

import { ITEM_KIND_META } from '@/lib/extraction/types';
import type { ItemKind } from '@/lib/extraction/types';

import { ChecksList, ConfidenceBadge, PageLinks, VerificationBadge } from './ItemBadges';
import { ItemMatchPanel } from './MatchCallout';
import { button, inputClass } from './pacp-ui';
import {
  AcceptanceNote,
  BulkActions,
  DecisionButtons,
  downloadFile,
  itemsToCsv,
  KindSideList,
  needsAttention,
  type ReviewProps,
} from './reviewShared';
import { useReviewState } from '@/lib/extraction/review-state';

/**
 * CRM archaeologist view — the Admin page's table, built for speed.
 *
 * "If PACP is slower than PDFs or personal spreadsheets, they will not use it."
 * Bulk accept only takes items whose quote was found and whose totals
 * reconcile, so going fast never skips a check.
 */
export function CrmReview({ items, decisions, onDecide, pdfUrl, citation, document, reviewer }: ReviewProps) {
  const links = useReviewState().links;
  const [kind, setKind] = useState<ItemKind | 'all'>('all');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const visible = useMemo(() => items.filter((i) => kind === 'all' || i.kind === kind), [items, kind]);
  const pendingClean = visible.filter((i) => (decisions[i.id] ?? 'pending') === 'pending' && !needsAttention(i) && !links[i.id]);
  const pending = items.filter((i) => (decisions[i.id] ?? 'pending') === 'pending' && !links[i.id]);
  const accepted = items.filter((i) => decisions[i.id] === 'accepted');

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  async function copyCitation() {
    if (!citation) return;
    await navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
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
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as ItemKind | 'all')}
            className={`${inputClass} lg:hidden max-w-[220px] py-2`}
            aria-label="Record type"
          >
            <option value="all">All records ({items.length})</option>
            {(Object.keys(ITEM_KIND_META) as ItemKind[])
              .filter((k) => items.some((i) => i.kind === k))
              .map((k) => (
                <option key={k} value={k}>
                  {ITEM_KIND_META[k].plural}
                </option>
              ))}
          </select>
          <button
            type="button"
            className={button.smallPrimary}
            disabled={pendingClean.length === 0}
            onClick={() => onDecide(pendingClean.map((i) => i.id), 'accepted')}
            title="Accepts only records whose quote was found on the page and whose totals reconcile."
          >
            <ListChecks className="w-4 h-4" /> Accept {pendingClean.length} Verified
          </button>
          {selected.size > 0 && (
            <button
              type="button"
              className={button.smallNeutral}
              onClick={() => {
                onDecide([...selected], 'accepted');
                setSelected(new Set());
              }}
            >
              <Check className="w-4 h-4" /> Accept {selected.size} Selected
            </button>
          )}
          <span className="ml-auto flex flex-wrap gap-3">
            <button
              type="button"
              className={button.smallNeutral}
              disabled={accepted.length === 0}
              onClick={() =>
                downloadFile(
                  `${(document?.fileName ?? 'report').replace(/\.pdf$/i, '')}-accepted.csv`,
                  itemsToCsv(accepted, citation),
                  'text/csv',
                )
              }
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            {citation && (
              <button type="button" className={button.smallNeutral} onClick={copyCitation}>
                <ClipboardCopy className="w-4 h-4" /> {copied ? 'Copied' : 'Copy Citation'}
              </button>
            )}
          </span>
        </div>

        <div className="bg-card border border-border rounded-lg overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="w-12 px-4 py-3" />
                <th className="text-left px-4 py-3 text-sm">Record</th>
                <th className="text-left px-4 py-3 text-sm">Details</th>
                <th className="text-left px-4 py-3 text-sm">Page</th>
                <th className="text-left px-4 py-3 text-sm">Check</th>
                <th className="text-left px-4 py-3 text-sm min-w-[184px]">Decision</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => {
                const decision = decisions[item.id] ?? 'pending';
                const isOpen = expanded === item.id;
                const failed = item.checks.some((c) => !c.ok);
                return (
                  <Fragment key={item.id}>
                    <tr className={`border-b border-border last:border-0 hover:bg-muted/30 align-top ${decision === 'rejected' ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-border"
                          checked={selected.has(item.id)}
                          disabled={decision !== 'pending'}
                          onChange={() => toggle(item.id)}
                          aria-label={`Select ${item.title}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm max-w-[240px]">
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : item.id)}
                          className="group flex items-start gap-1.5 text-left"
                        >
                          <ChevronDown className={`w-4 h-4 mt-0.5 shrink-0 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          <span>
                            <span className="block text-foreground font-medium group-hover:text-primary transition-colors">
                              {item.title}
                            </span>
                            <span className="text-xs text-muted-foreground">{ITEM_KIND_META[item.kind].label}</span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground max-w-[280px]">
                        {item.fields.slice(0, 3).map((f) => (
                          <div key={f.label} className="truncate">
                            <span className="text-foreground">{f.label}:</span> {f.value}
                          </div>
                        ))}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <PageLinks pages={item.pages} pdfUrl={pdfUrl} />
                      </td>
                      <td className="px-4 py-3 text-sm space-y-1">
                        <VerificationBadge verification={item.verification} />
                        {item.checks.length > 0 && (
                          <span className={`block text-xs font-medium ${failed ? 'text-destructive' : 'text-primary'}`}>
                            {failed ? 'Totals do not reconcile' : 'Totals reconcile'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 min-w-[184px]">
                        <DecisionButtons
                          id={item.id}
                          decision={decision}
                          onDecide={onDecide}
                          linkedTo={links[item.id]?.targetName}
                        />
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-border bg-muted/30">
                        <td />
                        <td colSpan={5} className="px-4 py-4 space-y-3">
                          <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-foreground italic">
                            &ldquo;{item.quote}&rdquo;
                          </blockquote>
                          <p className="text-sm text-muted-foreground">{item.reasoning}</p>
                          <ChecksList checks={item.checks} />
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            {item.fields.slice(3).map((f) => (
                              <span key={f.label}>
                                <span className="text-foreground">{f.label}:</span> {f.value}
                              </span>
                            ))}
                          </div>
                          <ConfidenceBadge confidence={item.confidence} />
                          <ItemMatchPanel item={item} document={document} citation={citation} reviewer={reviewer} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
