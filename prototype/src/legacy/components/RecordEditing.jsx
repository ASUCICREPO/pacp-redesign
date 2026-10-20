import { Check, SquarePen, Undo2, X } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

import { clearRecordField, setRecordField, useRecordEdits } from '@/lib/record-edits';

/**
 * Section-at-a-time editing for the prototype's record pages.
 *
 * Each section already had an "Edit" control; it just had nothing behind it.
 * Pressing it now turns that section's values into inputs, and Done puts them
 * back. The published wording is kept beside every correction, so a field can
 * always be restored and the record can still show what it said before.
 *
 * The markup of the display state is unchanged — an edited value renders
 * exactly like any other value, with a quiet note that it was edited.
 */

const RecordEditContext = createContext(null);

export function RecordEditProvider({ recordId, children }) {
  const [section, setSection] = useState(null);
  const edits = useRecordEdits(recordId);
  return (
    <RecordEditContext.Provider value={{ recordId, edits, section, setSection }}>
      {children}
    </RecordEditContext.Provider>
  );
}

const useRecordEdit = () => useContext(RecordEditContext);

/** The existing "Edit" link, now a toggle for its own section. */
export function SectionEditButton({ section }) {
  const ctx = useRecordEdit();
  if (!ctx) return null;
  const open = ctx.section === section;
  return (
    <button
      type="button"
      onClick={() => ctx.setSection(open ? null : section)}
      className="text-sm text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
    >
      {open ? (
        <>
          <Check className="w-3 h-3" />
          Done
        </>
      ) : (
        <>
          <SquarePen className="w-3 h-3" />
          Edit
        </>
      )}
    </button>
  );
}

/**
 * One editable value.
 *
 * `value` is what the record publishes; anything the reviewer saved replaces
 * it. `multiline` is for prose, which needs a box rather than a slot.
 */
export function Editable({ section, fieldKey, value, multiline = false, className = '', children }) {
  const ctx = useRecordEdit();
  const edit = ctx?.edits[fieldKey];
  const current = edit?.value ?? value;
  const editing = ctx?.section === section;

  const [draft, setDraft] = useState(null);
  const working = draft ?? current;

  if (!ctx) return children ?? current;

  if (!editing) {
    return (
      <span className={className}>
        {edit ? current : (children ?? current)}
        {edit && (
          <span className="ml-2 inline-flex items-center gap-1.5 align-middle text-xs text-muted-foreground">
            Edited
            <button
              type="button"
              onClick={() => clearRecordField(ctx.recordId, fieldKey)}
              title={`Restore the published value: ${edit.original}`}
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <Undo2 className="w-3 h-3" /> Restore
            </button>
          </span>
        )}
      </span>
    );
  }

  const commit = () => {
    const next = (draft ?? '').trim();
    if (draft === null) return;
    if (next && next !== value) setRecordField(ctx.recordId, fieldKey, next, value);
    else if (next === value && edit) clearRecordField(ctx.recordId, fieldKey);
    setDraft(null);
  };

  return (
    <span className={`block w-full min-w-0 ${className}`}>
      {multiline ? (
        <textarea
          value={working}
          rows={Math.min(10, Math.max(3, Math.ceil(working.length / 70)))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            // Enter makes a new line in prose, so saving is explicit.
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) e.currentTarget.blur();
            if (e.key === 'Escape') setDraft(null);
          }}
          aria-label={fieldKey}
          className="w-full min-w-0 px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm leading-relaxed resize-y"
        />
      ) : (
        <input
          type="text"
          value={working}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') setDraft(null);
          }}
          aria-label={fieldKey}
          className="w-full min-w-0 px-3 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
        />
      )}
    </span>
  );
}

/** Shown at the top of a section while it is being edited. */
export function SectionEditNote({ section }) {
  const ctx = useRecordEdit();
  if (!ctx || ctx.section !== section) return null;
  return (
    <p className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
      <SquarePen className="w-3.5 h-3.5 text-primary" />
      Editing this section — changes save as you leave each field.
      <button
        type="button"
        onClick={() => ctx.setSection(null)}
        className="inline-flex items-center gap-1 text-primary hover:underline"
      >
        <X className="w-3 h-3" /> Done
      </button>
    </p>
  );
}
