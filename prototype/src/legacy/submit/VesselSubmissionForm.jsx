import { Bold, Camera, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Flame, Globe, Info, Italic, Layers, Link as Link2, List, Lock, Microscope, Package, Pencil, Plus, Search, Underline, Upload, Users, X } from 'lucide-react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { SubmissionEthics, emptyEthicsState } from './SubmissionEthics.jsx';

export function SelectField({
  label: i,
  value: n,
  onChange: o,
  options: s,
  placeholder: c = "Select..."
}) {
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}</label><div className="relative"><select value={n} onChange={u => o(u.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-h-[48px]"><option value="">{c}</option>{s.map(u => <option value={u} key={u}>{u}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" /></div></div>;
}

export function SearchableSelect({
  label: i,
  value: n,
  onChange: o,
  options: s,
  placeholder: c = "Select or search...",
  required: u = !1,
  helperText: h,
  addNewLabel: f,
  onAddNew: p
}) {
  const [b, x] = useState(!1),
    [y, _] = useState(""),
    N = useRef(null),
    P = s.filter(B => B.toLowerCase().includes(y.toLowerCase()));
  useEffect(() => {
    const B = F => {
      N.current && !N.current.contains(F.target) && (x(!1), _(""));
    };
    return document.addEventListener("mousedown", B), () => document.removeEventListener("mousedown", B);
  }, []);
  const S = B => {
      o(B), x(!1), _("");
    },
    E = () => {
      x(!1), _(""), p?.();
    };
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}{u && <span className="ml-2 text-xs text-muted-foreground font-normal">Required</span>}</label><div className="relative" ref={N}><button type="button" onClick={() => x(!b)} className={`w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-h-[48px] text-left flex items-center justify-between ${n ? "bg-primary/5" : ""}`}><span className={n ? "text-foreground" : "text-muted-foreground"}>{n || c}</span><ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${b ? "rotate-180" : ""}`} /></button>{b && <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden"><div className="p-2 border-b border-border"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" value={y} onChange={B => _(B.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm" autoFocus={!0} /></div></div><div className="max-h-60 overflow-y-auto">{P.length > 0 ? P.map(B => <button type="button" onClick={() => S(B)} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors ${n === B ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`} key={B}>{B}</button>) : <p className="px-4 py-3 text-sm text-muted-foreground text-center">No matches found</p>}</div>{p && <div className="border-t border-border"><button type="button" onClick={E} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium hover:bg-primary/5 transition-colors" style={{
            color: "#B5563B"
          }}><Plus className="w-4 h-4" />{f ?? "Add new"}</button></div>}</div>}</div>{h && <p className="text-xs text-muted-foreground">{h}</p>}</div>;
}

export function ReadOnlyField({
  label: i,
  value: n,
  helperText: o
}) {
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}</label><div className="w-full px-4 py-3 bg-muted border border-border rounded-lg min-h-[48px] flex items-center text-muted-foreground">{n || "—"}</div>{o && <p className="text-xs text-muted-foreground">{o}</p>}</div>;
}

export function CheckboxField({
  checked: i,
  onChange: n,
  label: o
}) {
  return <label className="flex items-center gap-3 cursor-pointer">{o && <span className="text-sm text-foreground font-medium">{o}</span>}<button type="button" role="switch" aria-checked={i} onClick={() => n(!i)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${i ? "bg-primary" : "bg-sand/60"}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${i ? "translate-x-6" : "translate-x-1"}`} /></button></label>;
}

export const ENTITY_FORM_FIELDS = {
  Ware: [{
    key: "name",
    label: "Ware name",
    type: "text",
    placeholder: "e.g., Orange Ware",
    required: !0
  }, {
    key: "family",
    label: "Ware family",
    type: "text",
    placeholder: "e.g., Fine wares"
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the ware…"
  }],
  "Ceramic Type": [{
    key: "name",
    label: "Type name",
    type: "text",
    placeholder: "e.g., Jar Type A",
    required: !0
  }, {
    key: "family",
    label: "Type family",
    type: "text",
    placeholder: "e.g., Closed vessels"
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the type…"
  }],
  "Petro-fabric": [{
    key: "name",
    label: "Petro-fabric name",
    type: "text",
    placeholder: "e.g., Volcanic temper with plagioclase",
    required: !0
  }, {
    key: "composition",
    label: "Fabric composition",
    type: "text",
    placeholder: "e.g., fine paste, coarse inclusions"
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the petro-fabric…"
  }],
  "Production Site": [{
    key: "name",
    label: "Site / workshop name",
    type: "text",
    placeholder: "e.g., Teotihuacan Workshop Complex",
    required: !0
  }, {
    key: "region",
    label: "Region / country",
    type: "text",
    placeholder: "e.g., Mexico (State of Mexico)"
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the production site…"
  }],
  Form: [{
    key: "name",
    label: "Form name",
    type: "text",
    placeholder: "e.g., Composite silhouette bowl",
    required: !0
  }, {
    key: "family",
    label: "Shape family",
    type: "text",
    placeholder: "e.g., Open vessels"
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the form…"
  }],
  "Shape Type": [{
    key: "name",
    label: "Shape type name",
    type: "text",
    placeholder: "e.g., Necked composite",
    required: !0
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the shape type…"
  }],
  "Shape Family": [{
    key: "name",
    label: "Shape family name",
    type: "text",
    placeholder: "e.g., Tall-neck forms",
    required: !0
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the shape family…"
  }],
  "Functional Category": [{
    key: "name",
    label: "Category name",
    type: "text",
    placeholder: "e.g., Votive / offering",
    required: !0
  }, {
    key: "description",
    label: "Brief description",
    type: "textarea",
    placeholder: "Describe the functional category…"
  }],
  Fabric: [{
    key: "name",
    label: "Fabric name",
    type: "text",
    placeholder: "e.g., Fine calcareous paste",
    required: !0
  }, {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe the fabric composition, color, inclusions…"
  }],
  Temper: [{
    key: "name",
    label: "Temper name",
    type: "text",
    placeholder: "e.g., Volcanic sand",
    required: !0
  }, {
    key: "material",
    label: "Material",
    type: "text",
    placeholder: "e.g., Basaltic rock fragments"
  }, {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Describe the temper…"
  }],
  Reference: [{
    key: "citation",
    label: "Citation text",
    type: "textarea",
    placeholder: "Author, Year. Title. Publisher, Place.",
    required: !0
  }, {
    key: "authors",
    label: "Author(s)",
    type: "text",
    placeholder: "e.g., Rice, Prudence M."
  }, {
    key: "year",
    label: "Year",
    type: "text",
    placeholder: "e.g., 1987"
  }, {
    key: "doi",
    label: "DOI / URL",
    type: "url",
    placeholder: "https://doi.org/…"
  }],
  Contributor: [{
    key: "name",
    label: "Full name",
    type: "text",
    placeholder: "e.g., Dr. Jane Smith",
    required: !0
  }, {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "your.email@university.edu"
  }, {
    key: "affiliation",
    label: "Affiliation",
    type: "text",
    placeholder: "e.g., University of Arizona"
  }]
};

export function CreateEntityModal({
  entityType: i,
  onSave: n,
  onClose: o
}) {
  const s = ENTITY_FORM_FIELDS[i] ?? [{
      key: "name",
      label: "Name",
      type: "text",
      placeholder: `New ${i}`,
      required: !0
    }],
    [c, u] = useState(Object.fromEntries(s.map(x => [x.key, ""]))),
    h = useRef(null);
  useEffect(() => {
    h.current?.focus();
  }, []);
  const f = x => y => u(_ => ({
      ..._,
      [x]: y.target.value
    })),
    p = () => {
      const x = s.find(_ => _.required)?.key ?? s[0].key,
        y = c[x]?.trim() || `New ${i}`;
      n(c, y);
    };
  return createPortal(<div onClick={x => {
    x.target === x.currentTarget && o();
  }} style={{
    position: "fixed",
    inset: 0,
    zIndex: 1e3,
    background: "rgba(0,0,0,0.40)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  }}><div style={{
      width: "100%",
      maxWidth: 560,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      padding: "28px 32px",
      display: "flex",
      flexDirection: "column",
      gap: 20
    }} onClick={x => x.stopPropagation()}><div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12
      }}><h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: "#3D3530",
          margin: 0,
          lineHeight: 1.25
        }}>{"Add New "}{i}</h3><button type="button" onClick={o} style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8A7E72",
          padding: 4,
          marginTop: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center"
        }} aria-label="Close"><X size={18} /></button></div>{s.map((x, y) => <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 6
      }} key={x.key}><label style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#3D3530"
        }}>{x.label}{x.required && <span style={{
            color: "#B5563B",
            marginLeft: 3
          }}>*</span>}</label>{x.type === "textarea" ? <textarea ref={y === 0 ? _ => {
          h.current = _;
        } : void 0} value={c[x.key]} onChange={f(x.key)} placeholder={x.placeholder} rows={3} style={textareaStyle} onFocus={_ => _.currentTarget.style.boxShadow = "0 0 0 2px rgba(181,86,59,0.25)"} onBlur={_ => _.currentTarget.style.boxShadow = "none"} /> : <input ref={y === 0 ? _ => {
          h.current = _;
        } : void 0} type={x.type} value={c[x.key]} onChange={f(x.key)} placeholder={x.placeholder} onKeyDown={_ => {
          _.key === "Enter" && x.type !== "textarea" && p(), _.key === "Escape" && o();
        }} style={inputStyle} onFocus={_ => _.currentTarget.style.boxShadow = "0 0 0 2px rgba(181,86,59,0.25)"} onBlur={_ => _.currentTarget.style.boxShadow = "none"} />}</div>)}<div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 4
      }}><button type="button" onClick={o} style={secondaryButtonStyle} onMouseEnter={x => x.currentTarget.style.borderColor = "#8A7E72"} onMouseLeave={x => x.currentTarget.style.borderColor = "#E8DFD3"}>Cancel</button><button type="button" onClick={p} style={primaryButtonStyle} onMouseEnter={x => x.currentTarget.style.opacity = "0.88"} onMouseLeave={x => x.currentTarget.style.opacity = "1"}>Save and use</button></div></div></div>, document.body);
}

export function Toast({
  message: i,
  onDismiss: n
}) {
  return useEffect(() => {
    const o = setTimeout(n, 3500);
    return () => clearTimeout(o);
  }, [n]), <div style={{
    position: "fixed",
    bottom: 80,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1100,
    background: "#3D3530",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: 8,
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: 13,
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    whiteSpace: "nowrap"
  }}>{i}</div>;
}

export const inputStyle = {
  padding: "13px 14px",
  background: "#F7F0E5",
  border: "none",
  borderRadius: 8,
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  color: "#3D3530",
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};

export const textareaStyle = {
  ...inputStyle,
  resize: "vertical"
};

export const secondaryButtonStyle = {
  padding: "11px 22px",
  background: "#fff",
  border: "1.5px solid #E8DFD3",
  borderRadius: 8,
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: "#3D3530",
  cursor: "pointer"
};

export const primaryButtonStyle = {
  padding: "11px 22px",
  background: "#B5563B",
  border: "none",
  borderRadius: 8,
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  fontWeight: 600,
  color: "#fff",
  cursor: "pointer"
};

export function SuggestionCards({
  icon: I,
  title: n,
  description: o,
  dropdownLabel: s,
  dropdownPlaceholder: c,
  options: u,
  helperText: h,
  highlightedSuggestions: f,
  entityType: p
}) {
  const [b, x] = useState(!1),
    [y, _] = useState(""),
    [N, P] = useState(u),
    [S, E] = useState(!1),
    [B, F] = useState(null),
    U = (j, V) => {
      N.includes(V) || P(q => [...q, V]), _(V), E(!1), F(`${V} added and selected — finishing your vessel.`);
    };
  return <><div className={`rounded-lg p-6 border transition-all ${b ? "bg-card border-primary/40 shadow-md" : "bg-card border-border opacity-60"}`}><div className="flex items-start justify-between gap-4 mb-4"><div className="flex items-start gap-4 flex-1"><div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${b ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}><I className="w-6 h-6" /></div><div className="flex-1"><h3 className="text-base font-semibold text-foreground mb-1">{n}</h3><p className="text-sm text-muted-foreground">{o}</p></div></div><CheckboxField checked={b} onChange={x} /></div>{b && <div className="mt-6 transition-all duration-200 ease-in-out">{f && f.length > 0 && <div className="mb-4 p-3 bg-primary/5 border border-primary/20 rounded-lg"><p className="text-xs text-muted-foreground mb-2">Suggested based on your selections:</p><div className="flex flex-wrap gap-2">{f.map(j => <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20" key={j}>{j}</span>)}</div></div>}<SearchableSelect label={s} value={y} onChange={_} options={N} placeholder={c} helperText={h} addNewLabel={`Add new ${p}`} onAddNew={() => E(!0)} /><p className="text-xs text-muted-foreground mt-2">Don't see it?{" "}<button type="button" onClick={() => E(!0)} className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer text-xs">Add a new one →</button></p></div>}</div>{S && <CreateEntityModal entityType={p} onSave={U} onClose={() => E(!1)} />}{B && <Toast message={B} onDismiss={() => F(null)} />}</>;
}

export function MultiSelectChips({
  options: i,
  selectedOptions: n,
  onChange: o,
  label: s,
  helperText: c
}) {
  const u = h => {
    n.includes(h) ? o(n.filter(f => f !== h)) : o([...n, h]);
  };
  return <div className="space-y-3">{s && <label className="block text-sm text-foreground font-medium">{s}</label>}<div className="flex flex-wrap gap-2">{i.map(h => {
        const f = n.includes(h);
        return <button type="button" onClick={() => u(h)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${f ? "bg-primary text-primary-foreground border-2 border-primary" : "bg-sand/20 text-foreground border-2 border-sand/40 hover:border-primary/40"}`} key={h}>{f && <Check className="w-3.5 h-3.5" />}{h}</button>;
      })}</div>{c && <p className="text-xs text-muted-foreground">{c}</p>}</div>;
}

export function MeasurementField({
  label: i,
  value: n,
  onChange: o,
  unit: s = "cm",
  placeholder: c = "0.0",
  required: u = !1,
  helperText: h
}) {
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}{u && <span className="ml-2 text-xs text-muted-foreground font-normal">Required</span>}</label><div className="relative"><input type="number" step="0.1" value={n} onChange={f => o(f.target.value)} placeholder={c} className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" /><div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">{s}</div></div>{h && <p className="text-xs text-muted-foreground">{h}</p>}</div>;
}

export function RichTextField({
  label: i,
  value: n,
  onChange: o,
  helperText: s,
  minHeight: c = 160,
  maxHeight: u = 320
}) {
  const [h, f] = useState(n.length);
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}</label><div className="flex items-center gap-1 p-2 bg-muted border border-border rounded-t-lg"><button type="button" className="p-1.5 hover:bg-background rounded transition-colors" title="Bold"><Bold className="w-4 h-4 text-muted-foreground" /></button><button type="button" className="p-1.5 hover:bg-background rounded transition-colors" title="Italic"><Italic className="w-4 h-4 text-muted-foreground" /></button><button type="button" className="p-1.5 hover:bg-background rounded transition-colors" title="Underline"><Underline className="w-4 h-4 text-muted-foreground" /></button><div className="w-px h-4 bg-border mx-1" /><button type="button" className="p-1.5 hover:bg-background rounded transition-colors" title="Link"><Link2 className="w-4 h-4 text-muted-foreground" /></button><button type="button" className="p-1.5 hover:bg-background rounded transition-colors" title="Bullet list"><List className="w-4 h-4 text-muted-foreground" /></button></div><div className="relative"><textarea value={n} onChange={b => {
        const x = b.target.value;
        o(x), f(x.length);
      }} className="w-full px-4 py-3 bg-input-background border border-t-0 border-border rounded-b-lg focus:outline-none focus:ring-2 focus:ring-ring resize-y" style={{
        minHeight: `${c}px`,
        maxHeight: `${u}px`
      }} placeholder="Enter description..." /><div className="absolute bottom-2 right-2 text-xs text-muted-foreground">{h}</div></div>{s && <p className="text-xs text-muted-foreground">{s}</p>}</div>;
}

export function AddTechniqueModal({
  groupTitle: i,
  onSave: n,
  onClose: o
}) {
  const [s, c] = useState(""),
    [u, h] = useState(""),
    f = useRef(null);
  useEffect(() => {
    f.current?.focus();
  }, []);
  const p = y => {
      y.target === y.currentTarget && o();
    },
    b = () => {
      n(s.trim() || "New technique");
    },
    x = `Add New ${i}`;
  return createPortal(<div onClick={p} style={{
    position: "fixed",
    inset: 0,
    zIndex: 1e3,
    background: "rgba(0,0,0,0.40)",
    backdropFilter: "blur(2px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24
  }}><div style={{
      width: "100%",
      maxWidth: 560,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      padding: "28px 32px 28px",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      position: "relative"
    }} onClick={y => y.stopPropagation()}><div style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12
      }}><h3 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 22,
          fontWeight: 600,
          color: "#3D3530",
          margin: 0,
          lineHeight: 1.25
        }}>{x}</h3><button type="button" onClick={o} style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#8A7E72",
          padding: 4,
          marginTop: 2,
          flexShrink: 0,
          display: "flex",
          alignItems: "center"
        }} aria-label="Close"><X size={18} /></button></div><div style={{
        display: "flex",
        flexDirection: "column",
        gap: 6
      }}><label style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#3D3530"
        }}>Technique name{" "}<span style={{
            color: "#B5563B",
            marginLeft: 2
          }}>*</span></label><input ref={f} type="text" value={s} onChange={y => c(y.target.value)} onKeyDown={y => {
          y.key === "Enter" && b(), y.key === "Escape" && o();
        }} placeholder="e.g., Hand-building" style={{
          padding: "13px 14px",
          background: "#F7F0E5",
          border: "none",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          color: "#3D3530",
          outline: "none",
          width: "100%",
          boxSizing: "border-box"
        }} onFocus={y => y.currentTarget.style.boxShadow = "0 0 0 2px rgba(181,86,59,0.25)"} onBlur={y => y.currentTarget.style.boxShadow = "none"} /></div><div style={{
        display: "flex",
        flexDirection: "column",
        gap: 6
      }}><label style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 500,
          color: "#3D3530"
        }}>Brief description</label><textarea value={u} onChange={y => h(y.target.value)} placeholder="Describe the technique…" rows={4} style={{
          padding: "13px 14px",
          background: "#F7F0E5",
          border: "none",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          color: "#3D3530",
          outline: "none",
          resize: "vertical",
          width: "100%",
          boxSizing: "border-box"
        }} onFocus={y => y.currentTarget.style.boxShadow = "0 0 0 2px rgba(181,86,59,0.25)"} onBlur={y => y.currentTarget.style.boxShadow = "none"} /></div><div style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 4
      }}><button type="button" onClick={o} style={{
          padding: "11px 22px",
          background: "#fff",
          border: "1.5px solid #E8DFD3",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: "#3D3530",
          cursor: "pointer"
        }} onMouseEnter={y => y.currentTarget.style.borderColor = "#8A7E72"} onMouseLeave={y => y.currentTarget.style.borderColor = "#E8DFD3"}>Cancel</button><button type="button" onClick={b} style={{
          padding: "11px 22px",
          background: "#B5563B",
          border: "none",
          borderRadius: 8,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "#fff",
          cursor: "pointer"
        }} onMouseEnter={y => y.currentTarget.style.opacity = "0.88"} onMouseLeave={y => y.currentTarget.style.opacity = "1"}>Save and use</button></div></div></div>, document.body);
}

export function OptionGroupCard({
  title: i,
  description: n,
  options: o,
  citation: s
}) {
  const [c, u] = useState(!1),
    [h, f] = useState([]),
    [p, b] = useState(o),
    [x, y] = useState(!1),
    _ = P => {
      f(S => S.includes(P) ? S.filter(E => E !== P) : [...S, P]);
    },
    N = P => {
      p.includes(P) || b(S => [...S, P]), f(S => S.includes(P) ? S : [...S, P]), y(!1);
    };
  return <><div className={`rounded-lg p-4 border transition-all ${c ? "bg-card border-primary/30" : "bg-card border-border"}`}><div className="flex items-center justify-between gap-4"><div className="flex-1"><h4 className="text-sm font-semibold text-foreground">{i}{!c && h.length > 0 && <span className="ml-2 text-xs text-muted-foreground font-normal">{"— "}{h.length}{" selected"}</span>}</h4>{s && <p className="text-xs italic text-primary mt-0.5">{s}</p>}{n && !c && <p className="text-xs text-muted-foreground mt-1">{n}</p>}</div><CheckboxField checked={c} onChange={u} /></div>{c && <div className="mt-4 pt-4 border-t border-border"><div className="flex flex-wrap gap-2">{p.map(P => {
            const S = h.includes(P);
            return <button type="button" onClick={() => _(P)} className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${S ? "bg-primary text-primary-foreground border-2 border-primary" : "bg-sand/20 text-foreground border-2 border-sand/40 hover:border-primary/40"}`} key={P}>{S && <Check className="w-3.5 h-3.5" />}{P}</button>;
          })}<button type="button" onClick={() => y(!0)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border-2 border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 transition-all"><Plus className="w-3.5 h-3.5" />Add new</button></div></div>}</div>{x && <AddTechniqueModal groupTitle={i} onSave={N} onClose={() => y(!1)} />}</>;
}

export const REFERENCE_EXAMPLES = ["Rice, Prudence M. 1987. Pottery Analysis: A Sourcebook. University of Chicago Press, Chicago.", "Shepard, Anna O. 1956. Ceramics for the Archaeologist. Carnegie Institution of Washington, Washington, D.C.", "Arnold, Dean E. 1985. Ceramic Theory and Cultural Process. Cambridge University Press, Cambridge.", "Sinopoli, Carla M. 1991. Approaches to Archaeological Ceramics. Plenum Press, New York."];

export const REFERENCE_LOCATOR_TYPES = ["Figure", "Page", "Plate", "Table", "Chapter", "Section", "Other"];

export function ReferencesEditor({
  references: i,
  onChange: n
}) {
  const [o, s] = useState(!1),
    [c, u] = useState(""),
    [h, f] = useState("Figure"),
    [p, b] = useState([""]),
    [x, y] = useState(!1),
    _ = E => {
      n(i.filter(B => B.id !== E));
    },
    N = () => {
      b([...p, ""]);
    },
    P = (E, B) => {
      const F = [...p];
      F[E] = B, b(F);
    },
    S = () => {
      if (c) {
        const E = {
          id: Date.now().toString(),
          citation: c,
          year: "1987",
          type: h,
          specifics: p.filter(B => B.trim() !== "")
        };
        n([...i, E]), s(!1), u(""), f("Figure"), b([""]);
      }
    };
  return <div className="space-y-4"><div className="flex items-center justify-between"><button type="button" onClick={() => s(!o)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Plus className="w-4 h-4" />Search or Add Reference</button>{i.length > 0 && <span className="text-sm text-muted-foreground">{i.length}{" "}{i.length === 1 ? "reference" : "references"}{" linked"}</span>}</div>{o && <div className="bg-muted/30 border border-border rounded-lg p-6 space-y-4"><div className="grid grid-cols-3 gap-4"><div className="col-span-2 space-y-2"><label className="block text-sm font-medium text-foreground">Reference Title</label><div className="relative"><input type="text" value={c} onChange={E => u(E.target.value)} placeholder="Search for a title..." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" />{c && <div className="absolute z-10 w-full mt-2 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">{REFERENCE_EXAMPLES.filter(E => E.toLowerCase().includes(c.toLowerCase())).map((E, B) => <button type="button" onClick={() => {
                u(E);
              }} className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors border-b border-border last:border-b-0" key={B}>{E}</button>)}<button type="button" onClick={() => {
                u(""), s(!0);
              }} className="w-full px-4 py-3 text-left text-sm text-primary hover:bg-primary/5 transition-colors border-t border-border">+ Add a new reference manually</button></div>}</div></div><div className="space-y-2"><label className="block text-sm font-medium text-foreground">Type</label><div className="relative"><select value={h} onChange={E => f(E.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer min-h-[48px]">{REFERENCE_LOCATOR_TYPES.map(E => <option value={E} key={E}>{E}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" /></div><p className="text-xs text-muted-foreground">What part of the source does this reference cite?</p></div></div><div className="space-y-2"><label className="block text-sm font-medium text-foreground">Reference specifics</label>{p.map((E, B) => <input type="text" value={E} onChange={F => P(B, F.target.value)} placeholder="e.g., page nos., figure nos., etc." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" key={B} />)}<button type="button" onClick={N} className="text-sm text-primary hover:underline">+ Add more specifics</button></div><div className="flex items-center gap-3 pt-4 border-t border-border"><button type="button" onClick={S} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Add Reference</button><button type="button" onClick={() => {
          s(!1), u(""), b([""]);
        }} className="text-sm text-muted-foreground hover:text-foreground">Cancel</button></div></div>}{i.length > 0 ? <div className="space-y-3">{i.map(E => <div className="p-4 bg-card border border-border rounded-lg" key={E.id}><div className="flex items-start justify-between gap-3"><div className="flex-1"><p className="text-sm text-foreground mb-2">{E.citation}</p><div className="flex items-center gap-2 flex-wrap">{E.specifics.map((B, F) => <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20" key={F}>{E.type}{" "}{B}</span>)}</div>{E.specifics.length > 0 && <p className="text-xs text-muted-foreground mt-2">{E.specifics.join(", ")}</p>}</div><div className="flex items-center gap-2"><button type="button" className="p-1.5 text-muted-foreground hover:text-primary transition-colors" title="Edit"><Pencil className="w-4 h-4" /></button><button type="button" onClick={() => _(E.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors" title="Remove"><X className="w-4 h-4" /></button></div></div></div>)}</div> : <div className="text-center py-8 border-2 border-dashed border-border rounded-lg"><p className="text-sm text-muted-foreground">No references linked yet. Search above to add one.</p></div>}</div>;
}

export const PRIVACY_OPTIONS = [{
  value: "public",
  icon: Globe,
  title: "Public",
  description: "Visible to anyone visiting the PACP"
}, {
  value: "restricted",
  icon: Users,
  title: "Restricted",
  description: "Visible only to PACP Contributors"
}, {
  value: "private",
  icon: Lock,
  title: "Private",
  description: "Visible only to you, attributed contributors, and admins"
}];

export function PrivacySelector({
  value: i,
  onChange: n
}) {
  return <div className="space-y-4"><div className="grid grid-cols-3 gap-4">{PRIVACY_OPTIONS.map(o => {
        const S = o.icon,
          c = i === o.value;
        return <button type="button" onClick={() => n(o.value)} className={`relative p-4 rounded-lg border-2 text-left transition-all ${c ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`} key={o.value}>{c && <div className="absolute top-3 right-3"><Check className="w-4 h-4 text-primary" /></div>}<div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}><S className="w-5 h-5" /></div><h4 className="text-sm font-semibold text-foreground mb-1">{o.title}</h4><p className="text-xs text-muted-foreground leading-relaxed">{o.description}</p></button>;
      })}</div><p className="text-xs text-muted-foreground">You can change privacy settings later from your profile.</p></div>;
}

export function ReviewStepCard({
  stepNumber: i,
  stepName: n,
  fields: o,
  onEdit: s
}) {
  return <div className="bg-card border border-border rounded-lg p-6"><div className="flex items-center justify-between mb-6"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">{i}</div><h3 className="text-base font-semibold text-foreground">{n}</h3></div><button type="button" onClick={s} className="inline-flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium text-sm"><Pencil className="w-3.5 h-3.5" />Edit</button></div><dl className="space-y-4">{o.map((c, u) => {
        const h = !c.value || c.value === "";
        return <div className="flex flex-col gap-1" key={u}><dt className="text-sm font-semibold text-foreground">{c.label}</dt><dd className={h ? "text-sm italic text-muted-foreground" : "text-sm text-foreground"}>{h ? "Not provided" : c.value}</dd></div>;
      })}</dl></div>;
}

export const PHOTO_VIEWS = ["Front view", "Profile / side view", "Rim", "Base", "Interior", "Exterior detail", "Cross-section"];

export const emptyPhotoMeta = () => ({
  caption: "",
  credit: "",
  dateTaken: "",
  notes: ""
});

export function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export function isImageFile(i) {
  return i.type.startsWith("image/") || i.name.endsWith(".tiff") || i.name.endsWith(".tif");
}

export function PhotoMetaModal({
  meta: i,
  onChange: n,
  onClose: o
}) {
  const s = c => u => n({
    ...i,
    [c]: u.target.value
  });
  return <div style={{
    marginTop: 8,
    padding: "14px 16px",
    background: "#FAF7F2",
    border: "1px solid #E8DFD3",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10
  }}>{["caption", "credit", "notes"].map(c => <div key={c}><label style={{
        display: "block",
        fontSize: 11,
        color: "#8A7E72",
        marginBottom: 3,
        textTransform: "capitalize"
      }}>{c === "credit" ? "Photographer / Illustrator credit" : c.charAt(0).toUpperCase() + c.slice(1)}</label>{c === "notes" ? <textarea value={i[c]} onChange={s(c)} rows={2} style={metaInputStyle} placeholder="Optional notes..." /> : <input type="text" value={i[c]} onChange={s(c)} style={metaInputStyle} placeholder={c === "caption" ? "Optional caption" : c === "credit" ? "Optional credit" : ""} />}</div>)}<div><label style={{
        display: "block",
        fontSize: 11,
        color: "#8A7E72",
        marginBottom: 3
      }}>Date taken</label><input type="date" value={i.dateTaken} onChange={s("dateTaken")} style={metaInputStyle} /></div><button type="button" onClick={o} style={metaSaveButtonStyle}>Done</button></div>;
}

export const metaInputStyle = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 13,
  border: "1px solid #E8DFD3",
  borderRadius: 6,
  background: "#fff",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#3D3530"
};

export const metaSaveButtonStyle = {
  alignSelf: "flex-end",
  padding: "6px 16px",
  background: "#B5563B",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "Inter, system-ui, sans-serif"
};

export function PhotoUploadSlot({
  category: i,
  photo: n,
  onUpload: o,
  onRemove: s,
  onMetaChange: c
}) {
  const [u, h] = useState(!1),
    [f, p] = useState(!1),
    [b, x] = useState(!1),
    y = useRef(null),
    _ = useCallback(S => {
      S.preventDefault(), p(!1);
      const E = S.dataTransfer.files[0];
      E && isImageFile(E) && o(E);
    }, [o]);
  return <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 0
  }}><div onClick={() => !n && y.current?.click()} onMouseEnter={() => h(!0)} onMouseLeave={() => h(!1)} onDragOver={S => {
      S.preventDefault(), p(!0);
    }} onDragLeave={() => p(!1)} onDrop={_} style={{
      position: "relative",
      width: "100%",
      aspectRatio: "1",
      border: `1.5px ${n ? "solid" : "dashed"} ${f || u ? "#B5563B" : "#D4C4B8"}`,
      borderRadius: 10,
      background: n ? "#fff" : "#FAF7F2",
      cursor: n ? "default" : "pointer",
      overflow: "hidden",
      transition: "border-color 0.15s, transform 0.12s",
      transform: u && !n ? "scale(1.02)" : "scale(1)",
      boxShadow: n && u ? "0 4px 16px rgba(61,53,48,0.12)" : "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>{n ? <><img src={n.preview} alt={i} style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block"
        }} onClick={() => x(S => !S)} /><button type="button" onClick={S => {
          S.stopPropagation(), s();
        }} style={{
          position: "absolute",
          top: 6,
          right: 6,
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "rgba(61,53,48,0.75)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer"
        }}><X size={11} color="#fff" /></button><button type="button" onClick={S => {
          S.stopPropagation(), x(E => !E);
        }} style={{
          position: "absolute",
          bottom: 6,
          right: 6,
          background: "rgba(255,255,255,0.88)",
          border: "none",
          borderRadius: 5,
          padding: "3px 6px",
          fontSize: 11,
          color: "#B5563B",
          fontWeight: 600,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 3,
          fontFamily: "Inter, system-ui, sans-serif"
        }}>{b ? <ChevronUp size={11} /> : <ChevronDown size={11} />}{" Info"}</button></> : <><Camera size={26} color="#C4A090" strokeWidth={1.4} /></>}<input ref={y} type="file" accept="image/*" style={{
        display: "none"
      }} onChange={S => {
        const E = S.target.files?.[0];
        E && o(E), S.target.value = "";
      }} /></div><p style={{
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 12,
      color: "#8A7E72",
      textAlign: "center",
      marginTop: 6,
      lineHeight: 1.3
    }}>{i}</p>{n && b && <PhotoMetaModal meta={n.metadata} onChange={c} onClose={() => x(!1)} />}</div>;
}

export function PhotoThumb({
  photo: i,
  onRemove: n,
  onMetaChange: o
}) {
  const [s, c] = useState(!1),
    [u, h] = useState(!1);
  return <div style={{
    width: 120,
    display: "flex",
    flexDirection: "column",
    gap: 0
  }}><div onMouseEnter={() => c(!0)} onMouseLeave={() => c(!1)} style={{
      position: "relative",
      width: 120,
      height: 120,
      borderRadius: 10,
      overflow: "hidden",
      border: "1.5px solid #E8DFD3",
      boxShadow: s ? "0 4px 12px rgba(61,53,48,0.12)" : "none",
      transition: "box-shadow 0.15s"
    }}><img src={i.preview} alt="Additional" style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        cursor: "pointer"
      }} onClick={() => h(f => !f)} /><button type="button" onClick={n} style={{
        position: "absolute",
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "rgba(61,53,48,0.72)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}><X size={10} color="#fff" /></button></div>{u && <PhotoMetaModal meta={i.metadata} onChange={o} onClose={() => h(!1)} />}</div>;
}

export function IllustrationThumb({
  illus: i,
  onRemove: n,
  onMetaChange: o
}) {
  const [s, c] = useState(!1),
    u = i.file.type === "application/pdf";
  return <div style={{
    width: 140,
    display: "flex",
    flexDirection: "column",
    gap: 4
  }}><div style={{
      position: "relative",
      width: 140,
      height: 140,
      borderRadius: 10,
      overflow: "hidden",
      border: "1.5px solid #E8DFD3",
      background: "#FAF7F2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }} onClick={() => c(h => !h)}>{u ? <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6
      }}><Upload size={28} color="#C4A090" strokeWidth={1.4} /><span style={{
          fontSize: 10,
          color: "#8A7E72",
          fontFamily: "Inter, system-ui, sans-serif"
        }}>PDF</span></div> : <img src={i.preview} alt={i.file.name} style={{
        width: "100%",
        height: "100%",
        objectFit: "contain"
      }} />}<button type="button" onClick={h => {
        h.stopPropagation(), n();
      }} style={{
        position: "absolute",
        top: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "rgba(61,53,48,0.72)",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}><X size={10} color="#fff" /></button></div><p style={{
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: 11,
      color: "#8A7E72",
      lineHeight: 1.3,
      wordBreak: "break-word",
      margin: 0
    }}>{i.file.name.length > 22 ? i.file.name.slice(0, 20) + "…" : i.file.name}</p>{s && <PhotoMetaModal meta={i.metadata} onChange={o} onClose={() => c(!1)} />}</div>;
}

export function MediaStep({
  photos: i,
  onPhotosChange: n,
  illustrations: o,
  onIllustrationsChange: s
}) {
  const [c, u] = useState(!1),
    h = useRef(null),
    f = useRef(null),
    p = useId(),
    b = j => i.find(V => V.category === j && !V.id.startsWith("extra-")),
    x = (j, V) => {
      const q = b(j);
      q && URL.revokeObjectURL(q.preview);
      const C = {
        id: randomId(),
        category: j,
        file: V,
        preview: URL.createObjectURL(V),
        metadata: emptyPhotoMeta()
      };
      n([...i.filter($ => !($.category === j && !$.id.startsWith("extra-"))), C]);
    },
    y = j => {
      const V = b(j);
      V && URL.revokeObjectURL(V.preview), n(i.filter(q => !(q.category === j && !q.id.startsWith("extra-"))));
    },
    _ = (j, V) => {
      n(i.map(q => q.category === j && !q.id.startsWith("extra-") ? {
        ...q,
        metadata: V
      } : q));
    },
    N = i.filter(j => j.id.startsWith("extra-")),
    P = j => {
      if (!j) return;
      const V = Array.from(j).filter(isImageFile).map(q => ({
        id: `extra-${randomId()}`,
        category: "Additional",
        file: q,
        preview: URL.createObjectURL(q),
        metadata: emptyPhotoMeta()
      }));
      n([...i, ...V]);
    },
    S = j => {
      const V = i.find(q => q.id === j);
      V && URL.revokeObjectURL(V.preview), n(i.filter(q => q.id !== j));
    },
    E = (j, V) => {
      n(i.map(q => q.id === j ? {
        ...q,
        metadata: V
      } : q));
    },
    B = j => {
      if (!j) return;
      const V = ["image/jpeg", "image/png", "image/tiff", "image/svg+xml", "application/pdf"],
        q = Array.from(j).filter(C => V.includes(C.type) || C.name.endsWith(".tiff") || C.name.endsWith(".tif") || C.name.endsWith(".svg")).map(C => ({
          id: randomId(),
          file: C,
          preview: C.type.startsWith("image/") ? URL.createObjectURL(C) : "",
          metadata: emptyPhotoMeta()
        }));
      s([...o, ...q]);
    },
    F = j => {
      const V = o.find(q => q.id === j);
      V?.preview && URL.revokeObjectURL(V.preview), s(o.filter(q => q.id !== j));
    },
    U = (j, V) => {
      s(o.map(q => q.id === j ? {
        ...q,
        metadata: V
      } : q));
    };
  return <div style={{
    display: "flex",
    flexDirection: "column",
    gap: 32
  }}><section><h3 style={reviewHeadingStyle}>Images & Illustrations</h3><p style={reviewBodyStyle}>Upload photos and illustrations of the vessel. All are optional, but more views help with comparison and identification.</p><p style={reviewCaptionStyle}>Accepted: JPG, PNG, TIFF</p><div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: 16,
        marginBottom: 24
      }}>{PHOTO_VIEWS.map(j => <PhotoUploadSlot category={j} photo={b(j)} onUpload={V => x(j, V)} onRemove={() => y(j)} onMetaChange={V => _(j, V)} key={j} />)}</div>{N.length > 0 && <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16
      }}>{N.map(j => <PhotoThumb photo={j} onRemove={() => S(j.id)} onMetaChange={V => E(j.id, V)} key={j.id} />)}</div>}<button type="button" onClick={() => f.current?.click()} style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 18px",
        border: "1.5px dashed #C4A090",
        borderRadius: 8,
        background: "#FAF7F2",
        cursor: "pointer",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: 13,
        color: "#B5563B",
        fontWeight: 500
      }} onMouseEnter={j => j.currentTarget.style.borderStyle = "solid"} onMouseLeave={j => j.currentTarget.style.borderStyle = "dashed"}><Camera size={15} />{" + Add another photo"}</button><input ref={f} type="file" accept="image/*" multiple={!0} style={{
        display: "none"
      }} onChange={j => {
        P(j.target.files), j.target.value = "";
      }} /></section><section><h4 style={{
        ...reviewHeadingStyle,
        fontSize: 14
      }}>Illustrations & Drawings</h4><p style={reviewBodyStyle}>Upload scanned profile drawings, rim profiles, decorative diagrams, or other illustrations.</p><p style={reviewCaptionStyle}>Accepted: JPG, PNG, TIFF, SVG, PDF</p><div onClick={() => h.current?.click()} onDragOver={j => {
        j.preventDefault(), u(!0);
      }} onDragLeave={() => u(!1)} onDrop={j => {
        j.preventDefault(), u(!1), B(j.dataTransfer.files);
      }} style={{
        width: "100%",
        padding: "32px 24px",
        border: `1.5px dashed ${c ? "#B5563B" : "#C4A090"}`,
        borderRadius: 10,
        background: c ? "#F5EBE7" : "#FAF7F2",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        transition: "background 0.15s, border-color 0.15s",
        boxSizing: "border-box"
      }}><Upload size={24} color="#C4A090" strokeWidth={1.5} /><p style={{
          margin: 0,
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
          color: "#8A7E72"
        }}>{"Drag and drop or "}<span style={{
            color: "#B5563B",
            fontWeight: 500
          }}>click to browse</span></p></div><input ref={h} type="file" accept="image/*,.pdf,.svg,.tiff,.tif" multiple={!0} style={{
        display: "none"
      }} id={p} onChange={j => {
        B(j.target.files), j.target.value = "";
      }} />{o.length > 0 && <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginTop: 16
      }}>{o.map(j => <IllustrationThumb illus={j} onRemove={() => F(j.id)} onMetaChange={V => U(j.id, V)} key={j.id} />)}</div>}</section></div>;
}

export const reviewHeadingStyle = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 13,
  fontWeight: 600,
  color: "#B5563B",
  textTransform: "uppercase",
  letterSpacing: "0.07em",
  margin: "0 0 6px"
};

export const reviewBodyStyle = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 14,
  color: "#8A7E72",
  lineHeight: 1.6,
  margin: "0 0 4px"
};

export const reviewCaptionStyle = {
  fontFamily: "Inter, system-ui, sans-serif",
  fontSize: 11,
  color: "#A89C90",
  margin: "0 0 16px"
};

export function SubmitReviewPanel({
  onSaveDraft: i,
  onSubmit: n,
  onGoBack: o
}) {
  // Ethics affirmation, permissions, licence and sensitivity flag travel with
  // the submission. The affirmation gates the Submit button because the
  // requirements call for explicit affirmation, not an assumed one.
  const [ethics, setEthics] = useState(emptyEthicsState);
  return <div className="space-y-6"><SubmissionEthics value={ethics} onChange={setEthics} /><div className="bg-card border-2 border-primary/40 rounded-lg p-8 text-center"><h3 className="text-xl font-serif text-foreground mb-2">Ready to submit?</h3><p className="text-sm text-muted-foreground mb-6">Your entry will be sent to the PACP admin team for review before being published.</p><div className="flex items-center justify-center gap-3 mb-4"><button type="button" onClick={i} className="px-6 py-3 border-2 border-sand/60 text-foreground rounded-lg hover:bg-sand/20 transition-colors font-medium">Save Draft</button><button type="button" onClick={n} disabled={!ethics.affirmed} title={ethics.affirmed ? undefined : "Affirm the ethics statement above to submit"} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed">Submit Entry</button></div>{!ethics.affirmed && <p className="text-sm text-muted-foreground mb-4">Affirm the ethics statement above to submit. You can still save a draft.</p>}<button type="button" onClick={o} className="text-sm text-primary hover:underline">Or go back to edit</button></div></div>;
}

export function StepSidebar({
  steps: i,
  currentStep: n,
  completedSteps: o,
  completionPct: s,
  onStepClick: c
}) {
  return <div className="sticky top-24 flex flex-col gap-1"><h4 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Submission Steps</h4>{i.map((u, h) => {
      const f = o.includes(h),
        p = h === n;
      return <button onClick={() => c(h)} className={`flex items-center gap-3 w-full text-left px-3 py-3 rounded-md transition-all ${p ? "bg-primary/10 text-primary" : f ? "text-foreground hover:bg-muted" : "text-muted-foreground hover:bg-muted/50"}`} key={h}><div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${p || f ? "bg-primary text-primary-foreground" : "bg-sand/40 text-muted-foreground"}`}>{f && !p ? <Check className="w-4 h-4" /> : <span className="text-sm font-medium">{h + 1}</span>}</div><span className={`text-sm ${p ? "font-semibold" : ""}`}>{u}</span></button>;
    })}<div className="mt-4 pt-4 border-t border-border"><p className="text-xs text-muted-foreground mb-2">Record Completion</p><div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-1"><div className="h-full bg-primary transition-all duration-300 rounded-full" style={{
          width: `${s}%`
        }} /></div><p className="text-xs text-muted-foreground">{"Record "}{s}% complete</p></div></div>;
}

export function FormField({
  label: i,
  required: n = !1,
  helperText: o,
  error: s,
  children: c
}) {
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}{n && <span className="ml-2 text-xs text-muted-foreground font-normal">Required</span>}</label>{c}{o && !s && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Info className="w-3 h-3" />{o}</p>}{s && <p className="text-xs text-destructive">{s}</p>}</div>;
}

export function InfoBanner({
  message: i,
  dismissible: n = !0,
  actionLink: o
}) {
  const [s, c] = useState(!0);
  return !s && n ? null : <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3"><Info className="w-5 h-5 text-primary shrink-0 mt-0.5" /><div className="text-sm text-foreground flex-1">{i}{o && <>{" "}<a href={o.href} className="text-primary hover:underline font-medium">{o.text}</a></>}</div>{n && <button onClick={() => c(!1)} className="text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>}</div>;
}

export function SaveAndContinueBar({
  onBack: i,
  onNext: n,
  backDisabled: o = !1,
  nextLabel: s = "Save and Continue",
  currentStep: c,
  totalSteps: u
}) {
  return <div className="sticky bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg"><div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"><button type="button" onClick={i} disabled={o} className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"><ChevronLeft className="w-4 h-4" />Back</button>{c !== void 0 && u !== void 0 && <span className="text-sm text-muted-foreground">{"Step "}{c + 1}{" of "}{u}</span>}<button type="button" onClick={n} className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">{s}<ChevronRight className="w-4 h-4" /></button></div></div>;
}

export const VESSEL_FORM_STEPS = ["Vessel Information", "Site Name, Type, and Date", "Associations", "Morphological Attributes", "Technological Attributes", "Bibliography & Final Details", "Images & Illustrations", "Summary"];

export const SITE_NAMES = ["La Quemada", "Monte Albán", "Teotihuacan", "Chichen Itzá", "Tikal", "Copán", "Cerro Sechín", "Tula", "Cholula", "El Tajín", "Cantona", "Xochicalco"];

export const PERIOD_OPTIONS = ["Epiclassic (600-900 CE)", "Late Classic (600-900 CE)", "Early Classic (200-600 CE)", "Terminal Classic (800-1000 CE)", "Early Postclassic (900-1200 CE)", "Late Postclassic (1200-1521 CE)"];

export const SITE_COUNTRIES = {
  "La Quemada": "Mexico (Zacatecas)",
  "Monte Albán": "Mexico (Oaxaca)",
  Teotihuacan: "Mexico (State of Mexico)",
  "Chichen Itzá": "Mexico (Yucatán)",
  Tikal: "Guatemala (Petén)",
  Copán: "Honduras",
  "Cerro Sechín": "Peru (Ancash)",
  Tula: "Mexico (Hidalgo)",
  Cholula: "Mexico (Puebla)",
  "El Tajín": "Mexico (Veracruz)",
  Cantona: "Mexico (Puebla)",
  Xochicalco: "Mexico (Morelos)"
};

export const WARE_OPTIONS = ["Orange Ware", "Red Ware", "Black-on-Orange", "Thin Orange", "Plumbate", "Fine Gray"];

export const TYPE_OPTIONS = ["Jar Type A", "Bowl Type B", "Amphora Type C", "Tripod Vessel", "Cooking Pot Type D"];

export const PETRO_FABRIC_OPTIONS = ["Volcanic temper with plagioclase", "Calcareous fabric", "Quartz-rich fabric", "Micaceous fabric"];

export const KILN_WORKSHOP_OPTIONS = ["La Quemada Kiln 1", "Teotihuacan Workshop Complex", "Monte Albán Production Area"];

export const VESSEL_SHAPE_OPTIONS = ["Bowl", "Plate", "Jar", "Olla", "Amphora", "Cup"];

export const VESSEL_PART_OPTIONS = ["Rim", "Neck", "Body", "Base", "Support", "Handle", "Other"];

export const FIRING_ATMOSPHERE_OPTIONS = ["Oxidized", "Reduced", "Mixed", "Unknown"];

export const WHEEL_MARK_OPTIONS = ["Centered", "Off-center", "None visible"];

export const CONTRIBUTOR_OPTIONS = ["Dr. Sarah Martinez", "Prof. Michael Chen", "Dr. Lisa Anderson", "Dr. James Wilson", "Dr. Maria Garcia"];

export function SiteAutocomplete({
  label: i = "Site Name",
  helperText: n,
  value: o,
  onChange: s,
  allSites: c,
  onAddSite: u
}) {
  const [h, f] = useState(!1),
    [p, b] = useState(""),
    [x, y] = useState(!1),
    [_, N] = useState(""),
    [P, S] = useState(""),
    [E, B] = useState(""),
    F = useRef(null);
  useEffect(() => {
    const C = $ => {
      F.current && !F.current.contains($.target) && (f(!1), b(""));
    };
    return document.addEventListener("mousedown", C), () => document.removeEventListener("mousedown", C);
  }, []);
  const U = c.filter(C => C.toLowerCase().includes(p.toLowerCase()));
  function j(C) {
    s(C), f(!1), b(""), y(!1);
  }
  function V() {
    f(!1), b(""), N(""), S(""), B(""), y(!0);
  }
  function q() {
    const C = _.trim() || "New site";
    u(C, P.trim(), E.trim()), s(C), y(!1);
  }
  return <div className="space-y-2"><label className="block text-sm text-foreground font-medium">{i}</label><div className="relative" ref={F}><button type="button" onClick={() => {
        f(C => !C), y(!1);
      }} className={`w-full px-4 py-3 border border-border rounded-lg cursor-pointer min-h-[48px] text-left flex items-center justify-between transition-colors focus:outline-none focus:ring-2 focus:ring-ring ${o ? "bg-primary/5 border-primary/30" : "bg-input-background"}`}><span className={`text-sm ${o ? "text-foreground" : "text-muted-foreground"}`}>{o || "Search or select a site"}</span><ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${h ? "rotate-180" : ""}`} /></button>{h && <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-lg shadow-lg overflow-hidden"><div className="p-2 border-b border-border"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" /><input type="text" value={p} onChange={C => b(C.target.value)} placeholder="Search sites…" className="w-full pl-9 pr-3 py-2 bg-input-background border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" autoFocus={!0} /></div></div><div className="max-h-52 overflow-y-auto">{U.map(C => <button type="button" onClick={() => j(C)} className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${o === C ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-secondary/40"}`} key={C}>{C}</button>)}{U.length === 0 && <p className="px-4 py-3 text-sm text-muted-foreground text-center italic">No sites match "{p}"</p>}</div><div className="border-t border-border"><button type="button" onClick={V} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"><Plus className="w-4 h-4 shrink-0" />Add new site</button></div></div>}</div>{n && <p className="text-xs text-muted-foreground">{n}</p>}{!x && <button type="button" onClick={V} className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors mt-0.5"><Plus className="w-3 h-3 shrink-0" />Add a new site</button>}{x && <div className="bg-secondary/20 border border-border rounded-lg p-4 space-y-3"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-foreground">Create new site</span><button type="button" onClick={() => y(!1)} className="text-xs text-muted-foreground hover:text-primary transition-colors">– Cancel</button></div><input type="text" value={_} onChange={C => N(C.target.value)} placeholder="Site name" className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" autoFocus={!0} /><input type="text" value={P} onChange={C => S(C.target.value)} placeholder="Region — e.g., Oaxaca, Mexico" className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" /><input type="text" value={E} onChange={C => B(C.target.value)} placeholder="Period — e.g., Late Classic" className="w-full px-3 py-2.5 bg-white border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors" /><button type="button" onClick={q} className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">Create site & link to vessel</button></div>}</div>;
}

export function VesselSubmissionForm({
  onComplete: i,
  initialStep: n
}) {
  const [o, s] = useState(n ?? 0),
    [c, u] = useState(!1),
    [h, f] = useState(""),
    [p, b] = useState(""),
    [x, y] = useState(""),
    [_, N] = useState(""),
    [P, S] = useState(""),
    [E, B] = useState(""),
    [F, U] = useState(""),
    [j, V] = useState([]),
    [q, C] = useState(""),
    [$, me] = useState(""),
    [Le, ce] = useState(""),
    [ye, We] = useState(""),
    [_e, we] = useState(""),
    [ne, W] = useState(""),
    [R, ae] = useState(""),
    [K, re] = useState(["Fine orange paste", "Coarse red paste", "Fine gray fabric", "Micaceous fabric", "Calcareous paste"]),
    [Ce, xe] = useState(["Crushed volcanic rock", "Quartz sand", "Crushed sherds (grog)", "Organic temper", "Mica flakes"]),
    [ue, fe] = useState(""),
    [pe, Ae] = useState([]),
    [Ve, vt] = useState(""),
    [st, kt] = useState(""),
    [Te, lt] = useState(""),
    [Mt, dr] = useState([]),
    [nt, Qt] = useState([]),
    [At, Ar] = useState(""),
    [ur, hr] = useState(""),
    [mr, Rr] = useState(""),
    [_t, Ct] = useState("public"),
    [ct, Zt] = useState([]),
    [D, X] = useState([]),
    [Ue, gt] = useState(VESSEL_SHAPE_OPTIONS),
    [Ut, dt] = useState(["Restricted", "Unrestricted", "Composite", "Simple", "Complex"]),
    [Xe, Xt] = useState(["Open vessels", "Closed vessels", "Semi-closed vessels"]),
    [mi, er] = useState(["Serving", "Storage", "Ceremonial", "Cooking", "Transport", "Ritual"]),
    [zi, fi] = useState(CONTRIBUTOR_OPTIONS),
    [tr, Vr] = useState(SITE_NAMES),
    [fr, Di] = useState({
      ...SITE_COUNTRIES
    });
  function qr(k, O, Z) {
    Vr(Y => Y.includes(k) ? Y : [...Y, k]), O && Di(Y => ({
      ...Y,
      [k]: O
    }));
  }
  const [St, wt] = useState(null),
    [pr, gr] = useState(null),
    br = [p || h ? 0 : -1, x || P ? 1 : -1, -1, q || E ? 3 : -1, _e || ne || ue ? 4 : -1, Mt.length > 0 || nt.length > 0 ? 5 : -1, ct.length > 0 || D.length > 0 ? 6 : -1].filter(k => k >= 0),
    Ii = [p, h, x, _, P, q, E, F, _e, ne, ue, Mt.length > 0 ? "x" : "", nt.length > 0 ? "x" : ""].filter(Boolean).length,
    yr = Math.round(Ii / 12 * 100);
  useEffect(() => {
    if (!h.trim()) {
      u(!1);
      return;
    }
    const k = setTimeout(() => u(!0), 800);
    return () => clearTimeout(k);
  }, [h]);
  const v = () => {
      o < VESSEL_FORM_STEPS.length - 1 ? s(o + 1) : i();
    },
    T = () => {
      o > 0 && s(o - 1);
    },
    z = k => {
      s(k);
    };
  return <div className="min-h-screen bg-background pb-24"><div className="max-w-7xl mx-auto px-6 py-8"><nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6"><a href="/submit" className="hover:text-primary transition-colors">Submit</a><span>/</span><span className="text-foreground">Vessel</span><span>/</span><span className="text-primary font-medium">{VESSEL_FORM_STEPS[o]}</span></nav><div className="lg:hidden mb-6 overflow-x-auto pb-1"><div className="flex gap-2 min-w-max">{VESSEL_FORM_STEPS.map((k, O) => {
            const Z = br.includes(O),
              Y = O === o;
            return <button type="button" onClick={() => z(O)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all ${Y ? "bg-primary text-primary-foreground border-primary" : Z ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/60 text-muted-foreground border-border hover:border-primary/40"}`} key={O}><span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${Y ? "bg-white/20" : Z ? "bg-primary/20" : "bg-muted"}`}>{Z && !Y ? "✓" : O + 1}</span>{k}</button>;
          })}</div></div><div className="flex gap-12"><aside className="hidden lg:block w-64 shrink-0"><StepSidebar steps={VESSEL_FORM_STEPS} currentStep={o} completedSteps={br} completionPct={yr} onStepClick={z} /></aside><div className="flex-1 max-w-3xl">{o < 7 && <div className="mb-6"><InfoBanner message={o === 2 ? "Use the sidebar to navigate between steps. All associations are optional — only enable the ones that apply to your vessel." : o === 3 ? "Select all vessel parts present on your sample. Each selection will unlock additional detail fields in the next step." : o === 4 ? "Toggle on the form and finishing techniques present on your vessel. Each section will reveal additional detail options." : o === 5 ? "Add references, contributors, and final details for this vessel entry." : o === 6 ? "Upload photos and illustrations of the vessel. All are optional, but more views help with comparison and identification." : "Move between steps in any order by clicking the bubbles. Only Site Name + Vessel Registration Number is required. Only the final Submit saves your entry."} dismissible={!0} /></div>}{c && o === 0 && <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-5 shadow-sm"><div className="flex items-start justify-between mb-1"><h4 className="font-serif text-foreground">Potential Duplicate Detected</h4><button type="button" onClick={() => u(!1)} className="text-muted-foreground hover:text-foreground ml-4 shrink-0"><X className="w-4 h-4" /></button></div><p className="text-sm text-muted-foreground mb-4">{"A record with registration number "}<span className="font-medium text-foreground">"{h}"</span>{" may already exist. Review before continuing:"}</p><div className="flex gap-4 bg-white p-4 rounded-lg border border-amber-100"><div className="flex-1"><p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Your entry</p><p className="text-sm font-medium text-foreground">{h}</p><p className="text-xs text-muted-foreground">{p || "No site set"}</p></div><div className="w-px bg-amber-100" /><div className="flex-1"><p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Existing record</p><p className="text-sm font-medium text-foreground">La Quemada V-112</p><p className="text-xs text-muted-foreground">La Quemada · Epiclassic · Stewarded</p></div></div><div className="flex gap-2 mt-4"><button type="button" onClick={() => u(!1)} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Keep as New Entry</button><button type="button" onClick={() => u(!1)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors font-medium">Merge with Existing</button><button type="button" onClick={() => u(!1)} className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors font-medium">Link Records</button></div></div>}<div className="bg-card border border-border rounded-lg p-8 shadow-sm">{o < 7 && <div className="flex items-center gap-3 mb-6 px-1"><div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary transition-all duration-300" style={{
                  width: `${yr}%`
                }} /></div><span className="text-xs text-muted-foreground whitespace-nowrap">{"Record "}{yr}% complete</span></div>}{o === 0 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-1">Vessel Information</h2><p className="text-sm text-muted-foreground">Enter the site and vessel identifier. All fields except the registration number are optional.</p></div><div className="space-y-4"><h3 className="text-xs uppercase tracking-wider text-primary font-semibold">Vessel ID</h3><SiteAutocomplete value={p} onChange={k => {
                  b(k), N(fr[k] || "");
                }} allSites={tr} onAddSite={(k, O, Z) => {
                  qr(k, O), b(k), N(O || "");
                }} helperText="Search existing sites or type to add new" /><FormField label="Vessel Registration Number" required={!0} helperText="e.g., La Quemada V-112"><input type="text" value={h} onChange={k => f(k.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-shadow min-h-[48px]" placeholder="Enter vessel registration number" /></FormField></div><div className="border-t border-border" /><div className="space-y-3"><h3 className="text-xs uppercase tracking-wider text-primary font-semibold">Privacy</h3><PrivacySelector value={_t} onChange={Ct} /></div></div>}{o === 1 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-1">Site, Type & Date</h2><p className="text-sm text-muted-foreground">Provide site context and temporal information for this vessel.</p></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Site Information</h3><div className="bg-card border border-border rounded-lg p-6 space-y-4"><SiteAutocomplete value={p} onChange={k => {
                    b(k), N(fr[k] || "");
                  }} allSites={tr} onAddSite={(k, O, Z) => {
                    qr(k, O), b(k), N(O || "");
                  }} helperText="Search existing sites or type to add new" /><ReadOnlyField label="Country / Region" value={_ || "—"} helperText="Auto-fills based on selected site" /><FormField label="Site type" helperText="e.g., ceremonial center, settlement, burial site"><input type="text" value={x} onChange={k => y(k.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" placeholder="Enter site type" /></FormField></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Date & Context</h3><div className="bg-card border border-border rounded-lg p-6 space-y-4"><FormField label="Archaeological context" helperText="e.g., Platform 2 (67-4-3)"><textarea className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-24" placeholder="Describe the archaeological context..." /></FormField><FormField label="Date BCE/CE" helperText="e.g., 600-800 CE or 500 BCE"><input type="text" className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" placeholder="Enter date range" /></FormField><SearchableSelect label="Period" value={P} onChange={S} options={PERIOD_OPTIONS} placeholder="Select period" helperText="e.g., Epiclassic, Late Classic" /></div></div></div>}{o === 2 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-2">Associations</h2><p className="text-sm text-muted-foreground mb-6">Link this vessel to existing wares, types, petro-fabrics, and production sites. All associations are optional — only enable the ones that apply to your vessel.</p></div><div className="space-y-6"><SuggestionCards icon={Package} title="Ware / Ware Family" description="Link this vessel to an existing ware. If you've already added a petro-fabric, related wares will appear at the top." dropdownLabel="Select ware" dropdownPlaceholder="Search wares..." options={WARE_OPTIONS} highlightedSuggestions={["Orange Ware", "Thin Orange"]} entityType="Ware" /><SuggestionCards icon={Layers} title="Ceramic Type" description="Link this vessel to an existing type. Existing PACP associations are highlighted." dropdownLabel="Select type" dropdownPlaceholder="Search types..." options={TYPE_OPTIONS} entityType="Ceramic Type" /><SuggestionCards icon={Microscope} title="Petro-fabric" description="Link this vessel to a petro-fabric. If a ware is already selected, related petro-fabrics will appear at the top." dropdownLabel="Select petro-fabric" dropdownPlaceholder="Search petro-fabrics..." options={PETRO_FABRIC_OPTIONS} highlightedSuggestions={["Volcanic temper with plagioclase"]} entityType="Petro-fabric" /><SuggestionCards icon={Flame} title="Kiln / Workshop" description="Link this vessel to a known kiln or workshop site." dropdownLabel="Select kiln or workshop" dropdownPlaceholder="Search kilns and workshops..." options={KILN_WORKSHOP_OPTIONS} entityType="Production Site" /></div></div>}{o === 3 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-2">Morphological Attributes</h2><p className="text-sm text-muted-foreground mb-6">Describe the vessel's shape, dimensions, and structural components.</p></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Shape & Classification</h3><div className="bg-card border border-border rounded-lg p-6"><div className="grid grid-cols-2 gap-4"><SearchableSelect label="Shape" value={q} onChange={C} options={Ue} placeholder="Select shape" helperText="e.g., bowl, plate, jar, olla" addNewLabel="Add new form" onAddNew={() => wt("Form")} /><SearchableSelect label="Shape type" value={$} onChange={me} options={Ut} placeholder="Select shape type" helperText="e.g., restricted, unrestricted, composite" addNewLabel="Add new shape type" onAddNew={() => wt("Shape Type")} /><SearchableSelect label="Shape family" value={Le} onChange={ce} options={Xe} placeholder="Select shape family" helperText="e.g., open vessels, closed vessels" addNewLabel="Add new shape family" onAddNew={() => wt("Shape Family")} /><SearchableSelect label="Functional category" value={ye} onChange={We} options={mi} placeholder="Select category" helperText="e.g., serving, storage, ceremonial" addNewLabel="Add new functional category" onAddNew={() => wt("Functional Category")} /></div></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Dimensions & Vessel Parts</h3><div className="bg-card border border-border rounded-lg p-6 space-y-6"><div className="grid grid-cols-2 gap-4"><MeasurementField label="Vessel height" value={E} onChange={B} unit="cm" placeholder="0.0" required={!0} /><MeasurementField label="Maximum diameter" value={F} onChange={U} unit="cm" placeholder="0.0" required={!0} /></div><div className="pt-4 border-t border-border"><MultiSelectChips label="Vessel parts present" options={VESSEL_PART_OPTIONS} selectedOptions={j} onChange={V} helperText="Selected parts will appear as expandable detail sections in the next step for further description" /></div></div></div></div>}{o === 4 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-2">Technological Attributes</h2><p className="text-sm text-muted-foreground mb-6">Document the fabric, forming techniques, finishing methods, and firing characteristics of the vessel.</p></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Fabric & Technology</h3><div className="bg-card border border-border rounded-lg p-6 space-y-5"><div className="grid grid-cols-2 gap-4"><SearchableSelect label="Fabric" value={_e} onChange={we} options={K} placeholder="Select fabric type" helperText="e.g., fine orange paste, coarse red paste" addNewLabel="Add new fabric" onAddNew={() => wt("Fabric")} /><SearchableSelect label="Temper" value={ne} onChange={W} options={Ce} placeholder="Select temper type" helperText="e.g., crushed volcanic rock, quartz sand" addNewLabel="Add new temper" onAddNew={() => wt("Temper")} /></div><FormField label="Additional fabric notes" helperText="Provide any additional details about fabric composition and inclusions."><input type="text" value={R} onChange={k => ae(k.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring min-h-[48px]" placeholder="e.g., fine-grained with mica inclusions" /></FormField><RichTextField label="Technological description" value={ue} onChange={fe} helperText="Describe forming technique, primary and secondary finish, decoration, etc." minHeight={160} maxHeight={320} /></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Form & Finishing Details</h3><div className="bg-card border border-border rounded-lg p-6 space-y-3"><OptionGroupCard title="Forming Techniques" options={["Coiling", "Slab", "Molding", "Modeling", "Hammering", "Wheel-thrown"]} /><OptionGroupCard title="Primary Finish" options={["Continuous pressure", "Scraping", "Shaving", "Beating / Paddling", "Hammering", "Pushing", "Paddling"]} /><OptionGroupCard title="Secondary Finish" options={["Smoothing (wet)", "Smoothing (LH)", "Brushing (LH)", "Light burnishing", "Burnishing", "Shining / polishing", "Slip", "Coating (clay, organics, varnish or glaze)"]} /><OptionGroupCard title="Decorative Technique" options={["Simple impressing", "Stamping", "Rouletting", "Rocker stamping", "Punctuation", "Incising", "Excising", "Appliqué", "Inlay", "Painting", "Polychrome", "Resist Painting"]} citation="Rice 1987: 144–149" /></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Firing</h3><div className="bg-card border border-border rounded-lg p-6 space-y-4"><MultiSelectChips label="Atmosphere" options={FIRING_ATMOSPHERE_OPTIONS} selectedOptions={pe} onChange={Ae} /><div className="grid grid-cols-2 gap-4"><MeasurementField label="Carbon streak width" value={Ve} onChange={vt} unit="mm" placeholder="0.0" /><SelectField label="Carbon symmetry" value={st} onChange={kt} options={WHEEL_MARK_OPTIONS} placeholder="Select symmetry" /></div><FormField label="Firing notes" helperText="Capture firing conditions visible in vessel cross-section"><textarea value={Te} onChange={k => lt(k.target.value)} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring h-24" placeholder="Additional firing observations..." /></FormField></div></div></div>}{o === 5 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-2">Bibliography & Final Details</h2><p className="text-sm text-muted-foreground mb-6">Add bibliographic references, contributors, housing information, and set privacy preferences for this vessel entry.</p></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Bibliography</h3><div className="bg-card border border-border rounded-lg p-6"><ReferencesEditor references={Mt} onChange={dr} /></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Contributors</h3><div className="bg-card border border-border rounded-lg p-6"><MultiSelectChips label="Add contributors" options={zi} selectedOptions={nt} onChange={Qt} helperText="Add yourself and any co-contributors who should be attributed to this entry" /><div className="flex items-center gap-4 mt-3 flex-wrap"><button type="button" onClick={() => wt("Contributor")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-dashed border-primary/40 text-primary hover:border-primary hover:bg-primary/5 transition-all"><Plus className="w-3.5 h-3.5" />{" Add new contributor"}</button><a href="/contributors/invite" className="text-xs text-muted-foreground hover:text-primary transition-colors">Invite someone to PACP →</a></div></div></div><div><h3 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Additional Information</h3><div className="bg-card border border-border rounded-lg p-6 space-y-6"><RichTextField label="Vessel Housing Location" value={At} onChange={Ar} helperText="e.g., Florida Museum of Natural History, Catalog #2018.45.2" minHeight={96} maxHeight={240} /><div className="border-t border-border pt-6"><RichTextField label="External Data Sources" value={ur} onChange={hr} helperText="Link to related data sources, repositories, or external project pages" minHeight={96} maxHeight={240} /></div><div className="border-t border-border pt-6"><RichTextField label="Discussion / Questions / Acknowledgements" value={mr} onChange={Rr} helperText="Add any open questions, ongoing discussion, or acknowledgements for this entry" minHeight={120} maxHeight={320} /></div></div></div></div>}{o === 6 && <div className="space-y-6"><div><h2 className="font-serif text-foreground mb-1">Images & Illustrations</h2><p className="text-sm text-muted-foreground mb-6">Upload photos and illustrations of the vessel. All are optional, but more views help with comparison and identification.</p></div><div className="bg-card border border-border rounded-lg p-6"><MediaStep photos={ct} onPhotosChange={Zt} illustrations={D} onIllustrationsChange={X} /></div></div>}{o === 7 && <div className="space-y-6 max-w-4xl"><div className="mb-8"><div className="flex items-start justify-between mb-4"><h2 className="font-serif text-foreground text-3xl">Review Your Submission</h2><StatusBadge status="draft" /></div><p className="text-sm text-muted-foreground mb-4">Take a moment to review all details before submitting your vessel entry to the PACP.</p><div className="bg-muted/50 rounded-lg p-4 border border-border"><div className="flex items-center justify-between mb-2"><span className="text-sm font-medium text-foreground">Record Completion</span><span className="text-sm text-primary font-semibold">{yr}%</span></div><div className="w-full bg-muted rounded-full h-2 overflow-hidden"><div className="bg-primary h-full transition-all duration-300" style={{
                      width: `${yr}%`
                    }} /></div><p className="text-xs text-muted-foreground mt-2">Incomplete records are marked "Needs Review" and can be completed incrementally by you or other contributors</p></div></div><InfoBanner message="This is your final review. Click Submit at the bottom to publish your entry to the PACP. Submissions go through admin review before publication." dismissible={!1} /><div className="space-y-6"><ReviewStepCard stepNumber={1} stepName="Vessel Information" onEdit={() => s(0)} fields={[{
                  label: "Site name + Vessel registration number",
                  value: "La Quemada V-112",
                  required: !0
                }, {
                  label: "Vessel description",
                  value: "",
                  required: !0
                }, {
                  label: "Privacy",
                  value: _t
                }]} /><ReviewStepCard stepNumber={2} stepName="Site, Type & Date" onEdit={() => s(1)} fields={[{
                  label: "Site name",
                  value: p,
                  required: !0
                }, {
                  label: "Country/region",
                  value: _
                }, {
                  label: "Site type",
                  value: x
                }, {
                  label: "Archaeological context",
                  value: ""
                }, {
                  label: "Date BCE/CE",
                  value: "",
                  required: !0
                }, {
                  label: "Period",
                  value: P
                }]} /><ReviewStepCard stepNumber={3} stepName="Associations" onEdit={() => s(2)} fields={[{
                  label: "Associated Ware/Ware family",
                  value: ""
                }, {
                  label: "Associated Type",
                  value: ""
                }, {
                  label: "Associated Petro-fabric",
                  value: ""
                }, {
                  label: "Associated Kiln/Workshop",
                  value: ""
                }]} /><ReviewStepCard stepNumber={4} stepName="Morphological Attributes" onEdit={() => s(3)} fields={[{
                  label: "Shape",
                  value: q
                }, {
                  label: "Shape type",
                  value: $
                }, {
                  label: "Shape family",
                  value: Le
                }, {
                  label: "Functional category",
                  value: ye
                }, {
                  label: "Vessel height (cm)",
                  value: E,
                  required: !0
                }, {
                  label: "Maximum diameter (cm)",
                  value: F,
                  required: !0
                }, {
                  label: "Vessel parts",
                  value: j.length > 0 ? <div className="flex flex-wrap gap-2">{j.map(k => <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20" key={k}>{k}</span>)}</div> : ""
                }]} /><ReviewStepCard stepNumber={5} stepName="Technological Attributes" onEdit={() => s(4)} fields={[{
                  label: "Fabric",
                  value: _e
                }, {
                  label: "Temper",
                  value: ne
                }, {
                  label: "Fabric notes",
                  value: R
                }, {
                  label: "Technological description",
                  value: ue ? ue.substring(0, 100) + "..." : ""
                }, {
                  label: "Firing atmosphere",
                  value: pe.length > 0 ? <div className="flex flex-wrap gap-2">{pe.map(k => <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20" key={k}>{k}</span>)}</div> : ""
                }, {
                  label: "Carbon streak width (mm)",
                  value: Ve
                }, {
                  label: "Carbon symmetry",
                  value: st
                }]} /><ReviewStepCard stepNumber={6} stepName="Bibliography & Final Details" onEdit={() => s(5)} fields={[{
                  label: "References",
                  value: `${Mt.length} reference${Mt.length === 1 ? "" : "s"} linked`
                }, {
                  label: "Contributors",
                  value: nt.length > 0 ? <div className="flex flex-wrap gap-2">{nt.map(k => <span className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20" key={k}>{k}</span>)}</div> : ""
                }, {
                  label: "Vessel Housing Location",
                  value: At
                }, {
                  label: "External Data Sources",
                  value: ur
                }, {
                  label: "Discussion / Questions / Acknowledgements",
                  value: mr
                }]} />{(ct.length > 0 || D.length > 0) && <div className="bg-card border border-border rounded-lg p-6"><div className="flex items-center justify-between mb-4"><h4 className="text-xs uppercase tracking-wider text-primary font-semibold">Images & Illustrations</h4><button type="button" onClick={() => s(6)} className="text-xs text-primary hover:underline">Edit</button></div>{ct.length > 0 && <div className="mb-4"><p className="text-xs text-muted-foreground mb-2">{ct.length}{" photo"}{ct.length !== 1 ? "s" : ""}</p><div className="flex flex-wrap gap-2">{ct.map(k => <div style={{
                        position: "relative"
                      }} key={k.id}><img src={k.preview} alt={k.category} style={{
                          width: 72,
                          height: 72,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #E8DFD3"
                        }} /><span style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(61,53,48,0.55)",
                          borderRadius: "0 0 8px 8px",
                          fontSize: 9,
                          color: "#fff",
                          textAlign: "center",
                          padding: "2px 4px",
                          fontFamily: "Inter, system-ui, sans-serif",
                          lineHeight: 1.3
                        }}>{k.category}</span></div>)}</div></div>}{D.length > 0 && <div><p className="text-xs text-muted-foreground mb-2">{D.length}{" illustration"}{D.length !== 1 ? "s" : ""}</p><div className="flex flex-wrap gap-2">{D.map(k => <div style={{
                        width: 72,
                        height: 72,
                        borderRadius: 8,
                        border: "1px solid #E8DFD3",
                        overflow: "hidden",
                        background: "#FAF7F2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }} key={k.id}>{k.preview ? <img src={k.preview} alt={k.file.name} style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain"
                        }} /> : <span style={{
                          fontSize: 10,
                          color: "#8A7E72",
                          fontFamily: "Inter, system-ui, sans-serif",
                          textAlign: "center",
                          padding: 4
                        }}>PDF</span>}</div>)}</div></div>}</div>}</div><SubmitReviewPanel onSaveDraft={() => console.log("Save draft")} onSubmit={v} onGoBack={() => s(6)} /></div>}</div></div></div></div>{o < 7 && <SaveAndContinueBar onBack={T} onNext={v} backDisabled={o === 0} nextLabel={o === 6 ? "Summary" : "Save and Continue"} currentStep={o} totalSteps={VESSEL_FORM_STEPS.length} />}{St && <CreateEntityModal entityType={St} onSave={(k, O) => {
      St === "Form" ? (gt(Z => Z.includes(O) ? Z : [...Z, O]), C(O)) : St === "Shape Type" ? (dt(Z => Z.includes(O) ? Z : [...Z, O]), me(O)) : St === "Shape Family" ? (Xt(Z => Z.includes(O) ? Z : [...Z, O]), ce(O)) : St === "Functional Category" ? (er(Z => Z.includes(O) ? Z : [...Z, O]), We(O)) : St === "Fabric" ? (re(Z => Z.includes(O) ? Z : [...Z, O]), we(O)) : St === "Temper" ? (xe(Z => Z.includes(O) ? Z : [...Z, O]), W(O)) : St === "Contributor" && (fi(Z => Z.includes(O) ? Z : [...Z, O]), Qt(Z => Z.includes(O) ? Z : [...Z, O])), wt(null), gr(`${O} added and selected — finishing your vessel.`);
    }} onClose={() => wt(null)} />}{pr && <Toast message={pr} onDismiss={() => gr(null)} />}</div>;
}

export default VesselSubmissionForm;
