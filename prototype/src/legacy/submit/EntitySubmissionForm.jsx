import { Check, ChevronRight, CircleCheckBig, Plus } from 'lucide-react';
import { useState } from 'react';

import { Link } from '../router.jsx';
import { SectionNav } from '../pages/SubmitPage.jsx';
import {
  CreateEntityModal,
  FormField,
  InfoBanner,
  MultiSelectChips,
  PrivacySelector,
  RichTextField,
  SelectField,
  SubmitReviewPanel,
  inputStyle,
  textareaStyle,
} from './VesselSubmissionForm.jsx';

/**
 * Chips that also let you add someone who isn't on the list.
 *
 * Contributors are the people credited with the data, so the fixed list will
 * never be complete — a collaborator, a student, a colleague at another
 * institution. The add control opens the prototype's own CreateEntityModal,
 * which already knows the Contributor fields (name, email, affiliation).
 *
 * Markup mirrors MultiSelectChips so the two look identical; it is copied
 * rather than shared so the vessel form's chips are left untouched.
 */
function MultiSelectChipsWithAdd({ label, options, selectedOptions, onChange, onAddOption, helperText, addEntityType, addLabel }) {
  const [creating, setCreating] = useState(false);

  const toggle = (option) =>
    onChange(
      selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option],
    );

  return (
    <div className="space-y-3">
      {label && <label className="block text-sm text-foreground font-medium">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = selectedOptions.includes(option);
          return (
            <button
              type="button"
              onClick={() => toggle(option)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selected
                  ? 'bg-primary text-primary-foreground border-2 border-primary'
                  : 'bg-sand/20 text-foreground border-2 border-sand/40 hover:border-primary/40'
              }`}
              key={option}
            >
              {selected && <Check className="w-3.5 h-3.5" />}
              {option}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all bg-transparent text-primary border-2 border-dashed border-primary/40 hover:bg-primary/5 hover:border-primary"
        >
          <Plus className="w-3.5 h-3.5" />
          {addLabel}
        </button>
      </div>
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}

      {creating && (
        <CreateEntityModal
          entityType={addEntityType}
          onClose={() => setCreating(false)}
          onSave={(fields, fallbackName) => {
            // The modal's second argument falls back to "New Contributor" when
            // the name is blank, which would credit a placeholder person. Use
            // what was actually typed, and keep the modal open if it is empty.
            const trimmed = (fields?.name ?? fallbackName ?? '').trim();
            if (!trimmed || trimmed === `New ${addEntityType}`) return;
            // Remember the person as an option, so deselecting them later
            // leaves the chip in place rather than losing them.
            onAddOption(trimmed);
            if (!selectedOptions.includes(trimmed)) onChange([...selectedOptions, trimmed]);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

/**
 * One submission page, driven by a field spec from entityForms.js.
 *
 * Built entirely from the vessel form's own components and the Submit page's
 * layout, so the nine entity forms look like the one that already existed
 * rather than a second style of form.
 */
export function EntitySubmissionForm({ spec }) {
  const [values, setValues] = useState({});
  const [addedOptions, setAddedOptions] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const set = (key, value) => setValues((prev) => ({ ...prev, [key]: value }));
  const addOption = (key, option) =>
    setAddedOptions((prev) => ({ ...prev, [key]: [...new Set([...(prev[key] ?? []), option])] }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md text-center">
          <CircleCheckBig className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="font-serif text-foreground mb-3">Submission Received!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your contribution. Your submission is now in the approval queue and will be reviewed by our
            editorial team.
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              to="/profile"
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              View My Submissions
            </Link>
            <Link to="/submit" className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
              Submit Something Else
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const renderField = (field) => {
    const value = values[field.key] ?? (field.type === 'multiselect' ? [] : '');

    if (field.type === 'privacy') {
      return <PrivacySelector key={field.key} value={values.privacy ?? 'public'} onChange={(v) => set('privacy', v)} />;
    }
    if (field.type === 'richtext') {
      return (
        <RichTextField
          key={field.key}
          label={field.label}
          value={value}
          onChange={(v) => set(field.key, v)}
          helperText={field.helper}
        />
      );
    }
    if (field.type === 'multiselect') {
      // Anything added by hand is not in the spec's option list, so union the
      // two — otherwise a newly added person would vanish from the chips.
      const options = [...new Set([...field.options, ...(addedOptions[field.key] ?? []), ...value])];
      if (field.allowAdd) {
        return (
          <MultiSelectChipsWithAdd
            key={field.key}
            label={field.label}
            options={options}
            selectedOptions={value}
            onChange={(v) => set(field.key, v)}
            onAddOption={(option) => addOption(field.key, option)}
            helperText={field.helper}
            addEntityType={field.allowAdd}
            addLabel={field.addLabel ?? 'Add someone not listed'}
          />
        );
      }
      return (
        <MultiSelectChips
          key={field.key}
          label={field.label}
          options={options}
          selectedOptions={value}
          onChange={(v) => set(field.key, v)}
          helperText={field.helper}
        />
      );
    }
    if (field.type === 'select') {
      return (
        <FormField key={field.key} label={field.label} required={field.required} helperText={field.helper}>
          <SelectField value={value} onChange={(v) => set(field.key, v)} options={field.options} />
        </FormField>
      );
    }
    if (field.type === 'textarea') {
      return (
        <FormField key={field.key} label={field.label} required={field.required} helperText={field.helper}>
          <textarea
            value={value}
            onChange={(e) => set(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            style={textareaStyle}
          />
        </FormField>
      );
    }
    if (field.type === 'files') {
      return (
        <FormField key={field.key} label={field.label} required={field.required} helperText={field.helper}>
          <button
            type="button"
            onClick={(e) => e.currentTarget.nextElementSibling?.click()}
            className="w-full rounded-lg border-2 border-dashed border-border px-6 py-6 text-center hover:border-primary hover:bg-primary/5 transition-colors text-sm text-foreground"
          >
            Choose files
          </button>
          <input
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => set(field.key, Array.from(e.target.files ?? []).map((f) => f.name).join(', '))}
          />
          {value && <p className="text-xs text-muted-foreground mt-2">{value}</p>}
        </FormField>
      );
    }
    return (
      <FormField key={field.key} label={field.label} required={field.required} helperText={field.helper}>
        <input
          type="text"
          value={value}
          onChange={(e) => set(field.key, e.target.value)}
          placeholder={field.placeholder}
          style={inputStyle}
        />
      </FormField>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/submit" className="hover:text-primary transition-colors">
              Submit
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium">{spec.title}</span>
          </nav>
          <h1 className="font-serif text-foreground mb-4">{spec.title}</h1>
          <p className="text-muted-foreground max-w-3xl">{spec.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-56 shrink-0">
            <SectionNav sections={spec.sections.map((s) => ({ id: s.id, label: s.label }))} />
          </aside>

          <div className="flex-1 min-w-0 space-y-12">
            <InfoBanner message="Submissions can be partial — only the fields marked Required are needed to save a draft. You can come back and fill in the rest at any time." />

            {spec.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">{section.label}</h2>
                <div className="bg-card rounded-lg p-6 border border-border space-y-5">
                  {section.fields.map(renderField)}
                </div>
              </section>
            ))}

            <SubmitReviewPanel
              onSaveDraft={() => setSubmitted(true)}
              onSubmit={() => setSubmitted(true)}
              onGoBack={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntitySubmissionForm;
