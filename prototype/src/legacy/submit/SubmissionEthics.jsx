import { FileCheck, ShieldAlert, Upload } from 'lucide-react';
import { useRef } from 'react';

/**
 * Ethics, permissions and licensing at submission.
 *
 * Covers the Functional Requirements' "Desired Additions" to §3 (the
 * affirmation statement and a place to upload permissions), FR-14.2.4
 * (licensing agreed at submission) and §14.3.4 (sensitive content flagged so
 * it can be restricted and reviewed).
 *
 * The affirmation text is quoted from the requirements unchanged — it is a
 * legal and ethical undertaking, not copy to reword.
 */

export const AFFIRMATION_TEXT =
  'By submitting data to the PanAmerican Ceramics Project, you affirm that all materials have been collected, documented, and shared in accordance with applicable ethical standards, legal requirements, and professional guidelines. You confirm that you have the authority and permission to upload these data, including any associated images, metadata, or documentation, and that doing so does not infringe on the rights of any individuals, communities, institutions, or governing bodies. If you choose to make your submission publicly accessible, you further confirm that you have obtained all necessary permissions for public dissemination and that no restrictions—cultural, legal, or contractual—prohibit such access. You acknowledge responsibility for the accuracy of the information provided and for ensuring that sensitive or restricted data are handled appropriately.';

export const LICENCE_OPTIONS = [
  { value: 'cc-by-4.0', label: 'CC BY 4.0 — reuse with attribution' },
  { value: 'cc-by-nc-4.0', label: 'CC BY-NC 4.0 — non-commercial reuse with attribution' },
  { value: 'cc-by-sa-4.0', label: 'CC BY-SA 4.0 — attribution, share alike' },
  { value: 'cc0-1.0', label: 'CC0 1.0 — no rights reserved' },
  { value: 'all-rights-reserved', label: 'All rights reserved — no reuse without permission' },
];

export const emptyEthicsState = () => ({
  affirmed: false,
  licence: 'cc-by-4.0',
  sensitive: false,
  permissionFiles: [],
});

export function SubmissionEthics({ value, onChange }) {
  const inputRef = useRef(null);
  const set = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="bg-card rounded-lg p-6 border border-border text-left space-y-6">
      <h3 className="text-xs uppercase tracking-wider text-primary font-semibold">Ethics &amp; Permissions</h3>

      <div>
        <div className="bg-muted/50 rounded-lg p-4 max-h-44 overflow-y-auto">
          <p className="text-sm text-muted-foreground leading-relaxed">{AFFIRMATION_TEXT}</p>
        </div>
        <label className="flex items-start gap-3 mt-3 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-border mt-0.5"
            checked={value.affirmed}
            onChange={(e) => set({ affirmed: e.target.checked })}
          />
          <span className="text-sm text-foreground">
            I affirm the statement above.
            <span className="ml-2 text-xs text-muted-foreground font-normal">Required</span>
          </span>
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-foreground font-medium">
          Permission documentation
          <span className="ml-2 text-xs text-muted-foreground font-normal">(optional)</span>
        </label>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="sr-only"
          onChange={(e) => set({ permissionFiles: [...value.permissionFiles, ...Array.from(e.target.files ?? [])] })}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-lg border-2 border-dashed border-border px-6 py-6 text-center hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
          <span className="block text-sm text-foreground font-medium">Attach permits, agreements or correspondence</span>
          <span className="block text-xs text-muted-foreground mt-1">
            Held with the record and visible to admins and attributed contributors
          </span>
        </button>
        {value.permissionFiles.length > 0 && (
          <ul className="space-y-1.5">
            {value.permissionFiles.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-lg border border-border bg-input-background px-3 py-2"
              >
                <FileCheck className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate text-sm text-foreground flex-1">{file.name}</span>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => set({ permissionFiles: value.permissionFiles.filter((_, i) => i !== index) })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="licence" className="block text-sm text-foreground font-medium">
          Licence for reuse
        </label>
        <select
          id="licence"
          value={value.licence}
          onChange={(e) => set({ licence: e.target.value })}
          className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {LICENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Applies to the data you are contributing. It travels with the record and appears in its recommended citation.
        </p>
      </div>

      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-border mt-0.5"
            checked={value.sensitive}
            onChange={(e) => set({ sensitive: e.target.checked })}
          />
          <span className="text-sm text-foreground">
            This record includes culturally sensitive or restricted information
          </span>
        </label>
        {value.sensitive && (
          <div className="mt-3 flex items-start gap-3 rounded-lg border border-secondary bg-secondary/20 p-4">
            <ShieldAlert className="w-5 h-5 text-secondary-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              Flagged records are withheld from public access and routed for additional review before publication. If
              the material concerns a specific community, record who was consulted in the discussion field, and set the
              privacy level to Restricted or Private.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SubmissionEthics;
