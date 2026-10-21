import { Check, ChevronRight, Download, Ellipsis, FileText, SquarePen, Undo2, X } from 'lucide-react';
import { useState } from 'react';

import { removeDraft, setDraftStatus } from '@/lib/extraction/drafts';
import { ItemMatchPanel } from '@/components/extraction/MatchCallout';
import {
  FIELD_SECTIONS,
  editField,
  moveField,
  undoEdit,
  undoMove,
  useReviewState,
} from '@/lib/extraction/review-state';

import { Link, useNavigate } from '../router.jsx';
import { ExternalResources } from '../components/ExternalResources.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { OnThisPageNav, PrivacyBadge } from './VesselDetailPage.jsx';

/**
 * A record accepted from a PDF, shown on the detail page the reviewer already
 * knows rather than on a review screen of its own.
 *
 * Two things stakeholders asked for on 3 October live here:
 *
 * - **Rerouting.** Extraction regularly puts a sentence in the wrong section.
 *   Every extracted field carries a "Move to…" menu, and the original
 *   position keeps a struck-through placeholder saying where it went, so the
 *   record still shows what the PDF said and where it first landed.
 * - **The source trail.** Which PDF, which page, who uploaded it and when —
 *   kept in the sidebar for the life of the record, not just while it is a
 *   draft, with each field able to show the passage it was read from.
 */

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'needs_review', label: 'Needs Review' },
  { value: 'community_reviewed', label: 'Community Reviewed' },
  { value: 'stewarded', label: 'Stewarded' },
];

const BADGE_STATUS = {
  draft: 'draft',
  needs_review: 'needs-review',
  community_reviewed: 'community-reviewed',
  stewarded: 'stewarded',
};

/** Where extraction puts a field before anyone reroutes it. */
const SECTION_RULES = [
  [/shape|form|dimension|height|diameter|thickness|rim|base|morpholog/i, 'Morphological'],
  [/site|provenience|context|date|phase|period|region|location|county/i, 'Site & Date'],
  [/belongs to|ware|type|assemblage|associat|fabric|petro/i, 'Associations'],
  [/temper|paste|slip|firing|surface|technolog|diagnostic|trait|manufactur/i, 'Technological'],
  [/reference|citation|biblio|author|publish|page/i, 'Bibliography'],
];

export const defaultSection = (label) => {
  for (const [pattern, section] of SECTION_RULES) if (pattern.test(label)) return section;
  return 'Discussion';
};

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
};

/** The passage a field was read from, revealed on hover or keyboard focus. */
function SourceSnippet({ quote, pages, original }) {
  return (
    <span className="relative inline-flex group/src align-middle">
      <button
        type="button"
        aria-label="Show the passage this came from"
        title={`“${quote}”`}
        className="ml-1.5 align-middle text-muted-foreground/70 hover:text-primary focus:text-primary transition-colors"
      >
        <FileText className="w-3.5 h-3.5" />
      </button>
      <span className="pointer-events-none absolute left-0 top-6 z-20 hidden w-72 rounded-lg border border-border bg-card p-3 text-xs shadow-lg group-hover/src:block">
        <span className="block text-muted-foreground mb-1">
          From the PDF{pages.length > 0 ? ` · page ${pages.join(', ')}` : ''}
        </span>
        <span className="block text-foreground italic">&ldquo;{quote}&rdquo;</span>
        {original !== undefined && (
          <span className="mt-2 block border-t border-border pt-2 text-muted-foreground">
            Originally extracted as: <span className="text-foreground">{original}</span>
          </span>
        )}
      </span>
    </span>
  );
}

/** The "⋯" menu: correct a field's value, or reroute it to another section. */
function FieldMenu({ currentSection, onMove, onEdit }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Field options"
        title="Edit or move this field"
        className="text-muted-foreground/70 hover:text-primary transition-colors"
      >
        <Ellipsis className="w-4 h-4" />
      </button>
      {open && (
        <>
          <span className="fixed inset-0 z-20" onClick={() => setOpen(false)} />
          <span className="absolute right-0 top-6 z-30 w-56 rounded-lg border border-border bg-card py-1 shadow-lg">
            <button
              type="button"
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
            >
              <SquarePen className="w-3.5 h-3.5 text-muted-foreground" /> Edit value
            </button>
            <span className="my-1 block border-t border-border" />
            <span className="block px-3 py-1.5 text-xs uppercase tracking-wider text-primary font-semibold">
              Move to…
            </span>
            {FIELD_SECTIONS.filter((section) => section !== currentSection).map((section) => (
              <button
                type="button"
                key={section}
                onClick={() => {
                  onMove(section);
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors"
              >
                {section}
              </button>
            ))}
          </span>
        </>
      )}
    </span>
  );
}

function FieldRow({ field, item, section, move, edit, onMove, onUndoMove, onSave, onUndoEdit }) {
  const movedAway = move && move.from === section;
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(edit?.value ?? field.value);
  const multiline = value.length > 60 || value.includes('\n');

  const start = () => {
    setValue(edit?.value ?? field.value);
    setEditing(true);
  };
  const commit = () => {
    const next = value.trim();
    // Saving the extracted wording unchanged is the same as never editing it.
    if (next && next !== field.value) onSave(next);
    else if (next === field.value && edit) onUndoEdit();
    setEditing(false);
  };

  return (
    <div className="group grid grid-cols-[1fr_auto] sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)_auto] gap-x-4 gap-y-1 items-start py-2 border-b border-border last:border-0">
      <dt className="min-w-0 text-sm text-muted-foreground">
        {field.label}
        <SourceSnippet quote={item.quote} pages={item.pages} original={edit?.original} />
      </dt>
      <dd className="col-span-2 sm:col-span-1 min-w-0 text-foreground text-sm">
        {editing ? (
          <span className="flex w-full min-w-0 flex-col gap-2">
            {multiline ? (
              <textarea
                value={value}
                autoFocus
                rows={Math.min(8, Math.max(3, Math.ceil(value.length / 48)))}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  // Enter makes a new line here, so saving is explicit.
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) commit();
                  if (e.key === 'Escape') setEditing(false);
                }}
                aria-label={`${field.label} value`}
                className="w-full min-w-0 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm leading-relaxed resize-y"
              />
            ) : (
              <input
                type="text"
                value={value}
                autoFocus
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commit();
                  if (e.key === 'Escape') setEditing(false);
                }}
                aria-label={`${field.label} value`}
                className="w-full min-w-0 px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              />
            )}
            <span className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={commit}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Check className="w-3.5 h-3.5" /> Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            {multiline && (
              <span className="text-xs text-muted-foreground">Enter adds a line · ⌘↵ saves</span>
            )}
            </span>
          </span>
        ) : movedAway ? (
          <span className="flex flex-wrap items-center gap-2">
            <s className="text-muted-foreground">{edit?.value ?? field.value}</s>
            <span className="text-xs text-muted-foreground">Moved to {move.to}</span>
            <button
              type="button"
              onClick={onUndoMove}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Undo2 className="w-3 h-3" /> Undo
            </button>
          </span>
        ) : (
          <span className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={start}
              title="Click to edit this value"
              className="group/edit inline-flex items-start gap-1.5 text-left underline decoration-dotted decoration-muted-foreground/50 underline-offset-4 hover:text-primary hover:decoration-primary transition-colors"
            >
              {edit?.value ?? field.value}
              <SquarePen className="w-3 h-3 mt-1 shrink-0 text-muted-foreground/0 group-hover/edit:text-primary transition-colors" />
            </button>
            {edit && (
              <>
                <span className="text-xs text-muted-foreground">Edited</span>
                <button
                  type="button"
                  onClick={onUndoEdit}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <Undo2 className="w-3 h-3" /> Restore extracted
                </button>
              </>
            )}
          </span>
        )}
      </dd>
      {!movedAway && !editing && <FieldMenu currentSection={section} onMove={onMove} onEdit={start} />}
    </div>
  );
}

export function DraftRecordDetail({ draft }) {
  const { item, source } = draft;
  const navigate = useNavigate();
  const reviewState = useReviewState();
  const moves = reviewState.moves[item.id] ?? {};
  const edits = reviewState.edits[item.id] ?? {};
  const link = reviewState.links[item.id];

  const sectionOf = (field) => moves[field.label]?.to ?? defaultSection(field.label);

  // A field shows in the section it now belongs to, plus — struck through —
  // the one it was moved out of.
  const fieldsFor = (section) =>
    item.fields.filter((field) => sectionOf(field) === section || moves[field.label]?.from === section);

  const sections = FIELD_SECTIONS.map((label) => ({ id: label.toLowerCase().replace(/[^a-z]+/g, '-'), label }));

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/browse?status=draft&owner=me" className="hover:text-foreground transition-colors">
              Work table
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{item.title}</span>
          </nav>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="font-serif text-foreground mb-2">{item.title}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Accepted by {draft.reviewed_by}</span>
                <span>·</span>
                <span>{formatDate(draft.accepted_at)}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={BADGE_STATUS[draft.stewardship_status] ?? 'draft'} />
              <PrivacyBadge privacy="Public" />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              Status
              <select
                value={draft.stewardship_status}
                onChange={(e) => setDraftStatus(item.id, source.document.fileName, e.target.value)}
                className="px-3 py-2 bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Get Citation
            </button>
            <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Data
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6 min-w-0">
            <OnThisPageNav sections={sections} />

            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-xs uppercase tracking-wider text-primary mb-3 font-semibold">Source</h3>
              <p className="text-sm text-foreground leading-relaxed">
                {source.method === 'bulk_upload' ? 'Imported from' : 'Extracted from'}{' '}
                <span className="font-medium">{source.document.fileName}</span>
                {source.method === 'bulk_upload'
                  ? source.row != null && <> · row {source.row}</>
                  : item.pages.length > 0 && <> · page {item.pages.join(', ')}</>}{' '}
                · uploaded by {draft.reviewed_by} · {formatDate(draft.accepted_at)}
              </p>
              {source.citation && <p className="text-xs text-muted-foreground mt-3">{source.citation}</p>}
              <p className="text-xs text-muted-foreground mt-3">
                {source.method === 'curated_demo'
                  ? 'Prepared by hand from the report as an example.'
                  : source.method === 'bulk_upload'
                    ? 'Imported from a spreadsheet row and accepted by a reviewer. No AI was involved.'
                    : 'Proposed by AI from the PDF and accepted by a reviewer.'}{' '}
                This trail stays with the record through every status change.
              </p>
            </div>

            <ExternalResources context={`${source.document.title} ${item.title} ${item.quote}`} />
          </div>

          <div className="lg:col-span-3 space-y-12 min-w-0">
            {/* A duplicate can be spotted at review time just as easily as at
                extraction time, so the same offer is made here. */}
            <div className="space-y-4 empty:hidden">
              <ItemMatchPanel
                item={item}
                document={source.document}
                citation={source.citation}
                reviewer={draft.reviewed_by}
              />
              {link && (
                <div className="bg-card border border-border rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-muted-foreground">
                    This draft duplicates {link.targetName}. Removing it leaves the extracted passage on that record as
                    a note.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      removeDraft(item.id, source.document.fileName);
                      navigate('/browse?status=draft&owner=me');
                    }}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors text-sm whitespace-nowrap"
                  >
                    Remove this draft
                  </button>
                </div>
              )}
            </div>

            {sections.map(({ id, label }) => {
              const fields = fieldsFor(label);
              return (
                <section id={id} key={id}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-foreground">{label}</h2>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-6">
                    {fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Nothing was extracted into this section. Use the ⋯ menu on any field to move it here.
                      </p>
                    ) : (
                      <dl>
                        {fields.map((field) => (
                          <FieldRow
                            key={`${label}-${field.label}`}
                            field={field}
                            item={item}
                            section={label}
                            move={moves[field.label]}
                            edit={edits[field.label]}
                            onMove={(to) => moveField(item.id, field.label, defaultSection(field.label), to)}
                            onUndoMove={() => undoMove(item.id, field.label)}
                            onSave={(next) => editField(item.id, field.label, next, field.value)}
                            onUndoEdit={() => undoEdit(item.id, field.label)}
                          />
                        ))}
                      </dl>
                    )}
                  </div>
                </section>
              );
            })}

            <section id="evidence">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-foreground">Evidence</h2>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 space-y-3">
                <blockquote className="border-l-2 border-primary/40 pl-3 text-sm text-foreground italic">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <p className="text-sm text-muted-foreground">{item.reasoning}</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DraftRecordDetail;
