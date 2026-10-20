'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Link2, Link2Off, Plus, Search } from 'lucide-react';

import { findMatches } from '@/lib/extraction/matching';
import type { BadgeStatus, PacpMatch } from '@/lib/extraction/matching';
import { linkToExisting, unlink, useReviewState } from '@/lib/extraction/review-state';
import type { RecordLink } from '@/lib/extraction/review-state';
import type { DocumentMeta, ExtractedItem } from '@/lib/extraction/types';

import { button, Pill } from './pacp-ui';

/**
 * "Possible match in PACP" — offered before a duplicate gets created.
 *
 * Costellina and Andrea, 3 October: the expensive mistake is a second record
 * for a type the library already holds, because the evidence for that type
 * then sits in two places and nobody notices. So when an extracted ware or
 * type looks like something PACP already has, say so here, with enough of the
 * existing record to judge it — and make "create new anyway" an equally
 * easy click, because a near-identical name is not proof.
 */

const STATUS_TONE: Record<BadgeStatus, 'muted' | 'secondary' | 'accent' | 'primary'> = {
  draft: 'muted',
  'needs-review': 'secondary',
  'community-reviewed': 'accent',
  stewarded: 'primary',
};

const STATUS_LABEL: Record<BadgeStatus, string> = {
  draft: 'Draft',
  'needs-review': 'Needs Review',
  'community-reviewed': 'Community Reviewed',
  stewarded: 'Stewarded',
};

/** The extraction's own words, carried onto whichever record it joins. */
export function linkNote(item: ExtractedItem, citation: string | null): string {
  const pages = item.pages.length > 0 ? `p. ${item.pages.join(', ')}` : 'page not recorded';
  return [
    `Extracted as “${item.title}” (${pages}): “${item.quote}”`,
    citation ? `Source: ${citation}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
}

export function LinkedNotice({ link, onUndo }: { link: RecordLink; onUndo: () => void }) {
  return (
    <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 space-y-2">
      <p className="text-sm text-foreground flex items-start gap-2">
        <Link2 className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
        <span>
          <span className="font-medium">Linked to {link.targetName}</span> — no new record was created. The extracted
          passage was added to that record as a note, so the reason for the link is kept.
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-3 pl-6">
        <a
          href={link.targetHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        >
          View existing record <ExternalLink className="w-3 h-3" />
        </a>
        <button type="button" onClick={onUndo} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors">
          <Link2Off className="w-3.5 h-3.5" /> Undo link
        </button>
      </div>
    </div>
  );
}

export function MatchCallout({
  item,
  matches,
  citation,
  reviewer,
  link,
  onCreateNew,
}: {
  item: ExtractedItem;
  matches: PacpMatch[];
  citation: string | null;
  reviewer: string;
  link: RecordLink | undefined;
  /** Dismisses the callout for this item without linking. */
  onCreateNew: () => void;
}) {
  if (link) return <LinkedNotice link={link} onUndo={() => unlink(item.id)} />;
  if (matches.length === 0) return null;

  return (
    <div className="rounded-lg border border-secondary bg-secondary/10 p-4 space-y-3">
      <div className="flex items-start gap-2">
        <Search className="w-4 h-4 mt-0.5 shrink-0 text-secondary-foreground" />
        <div>
          <h4 className="text-sm font-semibold text-foreground">Possible match in PACP</h4>
          <p className="text-xs text-muted-foreground">
            {matches.length === 1 ? 'A record' : `${matches.length} records`} already in the database could be this one.
            Check before creating a second.
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {matches.map((match) => (
          <li key={match.id} className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">{match.name}</span>
              <Pill tone={STATUS_TONE[match.status]}>{STATUS_LABEL[match.status]}</Pill>
            </div>
            <p className="text-xs text-muted-foreground">
              {match.wareFamily}
              {match.context && ` · ${match.context}`}
            </p>
            <p className={`text-xs font-medium ${match.strength === 'strong' ? 'text-primary' : 'text-muted-foreground'}`}>
              {match.label}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                className={button.smallPrimary}
                onClick={() => linkToExisting(item.id, match, linkNote(item, citation), reviewer)}
              >
                <Link2 className="w-3.5 h-3.5" /> Link to this existing record
              </button>
              <button type="button" className={button.smallNeutral} onClick={onCreateNew}>
                <Plus className="w-3.5 h-3.5" /> Create new anyway
              </button>
              <a
                href={match.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
              >
                View existing record <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The callout as each review view uses it: works out whether this extraction
 * looks like an existing record, and remembers a "create new anyway" so the
 * suggestion stops nagging once the reviewer has judged it.
 */
export function ItemMatchPanel({
  item,
  document,
  citation,
  reviewer,
}: {
  item: ExtractedItem;
  document: DocumentMeta | null;
  citation: string | null;
  reviewer: string;
}) {
  const [dismissed, setDismissed] = useState(false);
  const links = useReviewState().links;
  const link = links[item.id];

  const matches = useMemo(
    () => findMatches(item, { documentContext: [document?.title ?? '', citation ?? ''].join(' ') }),
    [item, document?.title, citation],
  );

  if (!link && (dismissed || matches.length === 0)) return null;
  return (
    <MatchCallout
      item={item}
      matches={matches}
      citation={citation}
      reviewer={reviewer}
      link={link}
      onCreateNew={() => setDismissed(true)}
    />
  );
}
