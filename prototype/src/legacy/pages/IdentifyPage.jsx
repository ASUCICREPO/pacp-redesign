import { ArrowDown, ArrowRight, ArrowUp, Bookmark, BookmarkPlus, Check, ChevronDown, ChevronRight, ChevronUp, CircleHelp, Clock, Download, ImagePlus, Info, Minus, Pencil, Plus, Sparkles, Tag, Users, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from '../router.jsx';

export const DEMO_DESCRIPTIONS = ["red slipped bowl", "Panama Plain", "black on white jar", "possible Formative period serving vessel", "Cubita Polychrome jar"];

export const DEMO_FABRIC_NOTES = ["coarse fabric with quartz temper", "reddish brown matrix with light inclusions", "vesicular fabric", "gritty temper"];

export const DEMO_MATCHES = [{
  id: "r1",
  name: "Panama Plain",
  ware: "Orange Ware family",
  matchStrength: "strong",
  matchLabel: "Strong match — 4 of 5 attributes align",
  matchedAttrs: ["red slipped", "bowl", "Panama region", "Orange Ware"],
  missedAttrs: ["coarse temper"]
}, {
  id: "r2",
  name: "Cubita Polychrome",
  ware: "Polychrome Ware family",
  matchStrength: "moderate",
  matchLabel: "Moderate match — 3 of 5 attributes align",
  matchedAttrs: ["bowl", "Panama region", "Formative period"],
  missedAttrs: ["red slipped", "coarse temper"]
}, {
  id: "r3",
  name: "Tonosi Trichrome",
  ware: "Polychrome Ware family",
  matchStrength: "weak",
  matchLabel: "Weak match — 2 of 5 attributes align",
  matchedAttrs: ["bowl", "Panama region"],
  missedAttrs: ["red slipped", "coarse temper", "Formative period"]
}];

export const REFINE_REASONS = ["Wrong region", "Surface treatment differs", "Form is similar but not exact", "Temper composition off", "Date / period mismatch", "Decoration differs", "Vessel size doesn't match", "Other"];

export const DEMO_TIMELINE = [{
  id: "demo-1",
  type: "describe",
  time: "9:42 AM",
  text: "Started identification",
  subtext: "Described: red slipped bowl, Panama Plain, coarse fabric with quartz temper"
}, {
  id: "demo-2",
  type: "compare",
  time: "9:43 AM",
  text: "Compared possibilities",
  subtext: "3 matches found: Panama Plain (strong), Cubita Polychrome (moderate), Tonosi Trichrome (weak)"
}];

export const IDENTIFY_STEPS = [{
  id: "describe",
  label: "Describe"
}, {
  id: "compare",
  label: "Compare"
}, {
  id: "refine",
  label: "Refine"
}, {
  id: "reason",
  label: "Reason"
}, {
  id: "save",
  label: "Save"
}];

export function stepIndex(i) {
  return IDENTIFY_STEPS.findIndex(n => n.id === i);
}

export function currentTime() {
  const i = new Date(),
    n = i.getHours(),
    o = String(i.getMinutes()).padStart(2, "0"),
    s = n >= 12 ? "PM" : "AM";
  return `${n % 12 || 12}:${o} ${s}`;
}

export function IdentifyStepper({
  current: i,
  onStepClick: n
}) {
  const o = stepIndex(i),
    s = {
      describe: "Describe what you observe.",
      compare: "Compare to possible matches.",
      refine: "Refine your reasoning.",
      reason: "Build your reasoning history.",
      save: "Save your work."
    };
  return <div className="w-full"><div className="flex items-start justify-between max-w-xl mx-auto">{IDENTIFY_STEPS.map((c, u) => {
        const h = u < o,
          f = u === o;
        return <div className="flex-1 flex flex-col items-center gap-1.5" key={c.id}><div className="relative flex items-center w-full justify-center">{u > 0 && <div className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-px w-full ${h ? "bg-primary" : "bg-border"}`} />}<button type="button" onClick={() => n(c.id)} title={`Go to ${c.label}`} className={`relative z-10 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer hover:ring-2 hover:ring-primary/30 hover:ring-offset-1 focus:outline-none focus:ring-2 focus:ring-primary/40 ${f ? "w-5 h-5 bg-primary border-primary" : h ? "w-4 h-4 bg-primary border-primary hover:bg-primary/80" : "w-4 h-4 bg-card border-border hover:border-primary/60"}`}>{h && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}</button></div><button type="button" onClick={() => n(c.id)} className={`text-xs text-center cursor-pointer transition-colors hover:text-primary focus:outline-none ${f ? "text-primary font-semibold" : h ? "text-primary/60" : "text-muted-foreground"}`}>{c.label}</button></div>;
      })}</div><p className="text-center text-xs text-muted-foreground mt-3">{"Step "}{o + 1}{" of "}{IDENTIFY_STEPS.length}{" · "}{s[i]}</p></div>;
}

export function StrengthBar({
  strength: i
}) {
  return <div className="h-1.5 bg-border rounded-full overflow-hidden w-full"><div className={`h-full rounded-full ${i === "strong" ? "bg-primary" : i === "moderate" ? "bg-amber-500" : "bg-muted-foreground/40"} ${i === "strong" ? "w-4/5" : i === "moderate" ? "w-3/5" : "w-2/5"} transition-all`} /></div>;
}

export function PlaceholderIcon() {
  return <div className="w-20 h-20 rounded-lg bg-secondary/40 flex items-center justify-center shrink-0"><div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center"><Sparkles className="w-5 h-5 text-primary/40" /></div></div>;
}

export function IdentifyToast({
  message: i,
  onDismiss: n
}) {
  return createPortal(<div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-xl shadow-xl text-sm max-w-xs"><Check className="w-4 h-4 text-primary shrink-0" /><span>{i}</span><button onClick={n} className="ml-auto opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button></div>, document.body);
}

export function IdentifyPage() {
  const [i, n] = useState("describe"),
    [o, s] = useState(null),
    [c, u] = useState("describe"),
    [h, f] = useState([]),
    [p, b] = useState(""),
    [x, y] = useState(null),
    _ = useRef(null),
    [N, P] = useState(DEMO_MATCHES),
    [S, E] = useState(!1),
    [B, F] = useState(new Set()),
    [U, j] = useState([]),
    [V, q] = useState(""),
    [C, $] = useState(!1),
    [me, Le] = useState(!1),
    [ce, ye] = useState(DEMO_TIMELINE),
    [We, _e] = useState(""),
    [we, ne] = useState(null),
    [W, R] = useState(""),
    [ae, K] = useState(null),
    [re, Ce] = useState("tentative"),
    [xe, ue] = useState("private"),
    [fe, pe] = useState("tentative"),
    [Ae, Ve] = useState("pacp-general"),
    [vt, st] = useState(null),
    kt = useNavigate(),
    Te = N.find(D => D.id === o) ?? N[0];
  function lt(D) {
    !D.trim() || h.find(X => X.text === D) || f(X => [...X, {
      id: crypto.randomUUID(),
      text: D
    }]);
  }
  function Mt() {
    ye([{
      id: crypto.randomUUID(),
      type: "describe",
      time: currentTime(),
      text: "Started identification",
      subtext: `Described: ${h.map(D => D.text).join(", ") || "(no descriptors entered)"}`
    }, {
      id: crypto.randomUUID(),
      type: "compare",
      time: currentTime(),
      text: "Compared possibilities",
      subtext: "3 matches found: Panama Plain (strong), Cubita Polychrome (moderate), Tonosi Trichrome (weak)"
    }]), n("compare");
  }
  function dr(D) {
    s(D), j([]), q(""), $(!1), n("refine");
  }
  function nt() {
    const D = Te;
    P(X => [...X.map(gt => gt.id === D.id ? {
      ...gt,
      matchStrength: "weak",
      matchLabel: "Re-ranked — does not fit your refinement",
      reranked: !0
    } : gt)].sort((gt, Ut) => {
      const dt = {
        strong: 0,
        moderate: 1,
        weak: 2
      };
      return dt[gt.matchStrength] - dt[Ut.matchStrength];
    })), ye(X => [...X, {
      id: crypto.randomUUID(),
      type: "refine",
      time: currentTime(),
      text: `Refined: rejected ${D.name}`,
      subtext: [U.length ? `Reason: ${U.join(", ")}` : null, V ? `Note: "${V}"` : null, C ? "Boosted: form-similar matches re-ranked higher" : null].filter(Boolean).join(" · ")
    }]), Le(!0), n("compare"), setTimeout(() => Le(!1), 5e3);
  }
  function Qt() {
    We.trim() && (ye(D => [...D, {
      id: crypto.randomUUID(),
      type: "note",
      time: currentTime(),
      text: `Note: "${We.trim()}"`
    }]), _e(""));
  }
  function At(D) {
    ye(X => X.map(Ue => Ue.id === D ? {
      ...Ue,
      text: W
    } : Ue)), ne(null);
  }
  function Ar(D) {
    ye(X => X.filter(Ue => Ue.id !== D)), K(null);
  }
  function ur(D) {
    const X = re === "tentative" ? `${Te.name} — tentative match` : re === "unresolved" ? "unresolved" : "flagged for expert review";
    st(`Saved to your workspace. ${X}.`), setTimeout(() => st(null), 4e3);
  }
  function hr(D) {
    D.preventDefault();
    const X = D.dataTransfer.files[0];
    X && y(URL.createObjectURL(X));
  }
  function mr() {
    return N.map((D, X) => {
      const gt = [...N.map((dt, Xe) => ({
          ...dt,
          tempStrength: dt.id === o && U.length > 0 ? "weak" : dt.matchStrength,
          origIdx: Xe
        }))].sort((dt, Xe) => {
          const Xt = {
            strong: 0,
            moderate: 1,
            weak: 2
          };
          return Xt[dt.tempStrength] - Xt[Xe.tempStrength];
        }).findIndex(dt => dt.id === D.id),
        Ut = gt < X ? "up" : gt > X ? "down" : "same";
      return {
        result: D,
        direction: Ut
      };
    }).slice(0, 3);
  }
  const Rr = c === "describe" || c === "both",
    _t = c === "upload" || c === "both",
    Ct = ce.filter(D => D.type === "refine").length,
    ct = {
      describe: {
        label: "← Back",
        action: () => kt("/")
      },
      compare: {
        label: "← Back",
        action: () => n("describe")
      },
      refine: {
        label: "← Back",
        action: () => n("compare")
      },
      reason: {
        label: "← Back",
        action: () => n("refine")
      },
      save: {
        label: "← Back",
        action: () => n("reason")
      }
    },
    Zt = {
      describe: {
        label: "Continue to Compare",
        action: () => n("compare")
      },
      compare: {
        label: "Continue to Refine",
        action: () => n("refine")
      },
      refine: {
        label: "Continue to Reason",
        action: () => n("reason")
      },
      reason: {
        label: "Continue to Save",
        action: () => n("save")
      },
      save: {
        label: "Save and finish",
        action: () => ur()
      }
    };
  return <div className="min-h-screen bg-background pb-28"><div className="bg-card border-b border-border px-6 py-5"><div className="max-w-6xl mx-auto"><nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"><Link to="/" className="hover:text-primary transition-colors">Home</Link><ChevronRight className="w-3 h-3" /><span>Identify a Sherd</span><ChevronRight className="w-3 h-3" /><span className="text-foreground font-medium">Guided Identification</span></nav><h1 className="font-serif text-foreground text-3xl mb-1">Guided Identification</h1><p className="text-muted-foreground text-sm max-w-2xl">Walk through structured questions to narrow possibilities. Your reasoning is preserved at every step — you decide what to keep, refine, or set aside.</p><div className="mt-4 flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 text-sm text-primary max-w-2xl"><Info className="w-4 h-4 mt-0.5 shrink-0" /><span>This is a comparative reasoning tool — it surfaces possibilities, you make the interpretation.</span></div></div></div><div className="max-w-6xl mx-auto px-6 pt-8 pb-6"><IdentifyStepper current={i} onStepClick={n} /></div>{i === "describe" && <div className="max-w-6xl mx-auto px-6"><div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"><div className="bg-card border border-border rounded-2xl p-6"><h2 className="font-serif text-foreground text-lg mb-1">What do you observe?</h2><p className="text-sm text-muted-foreground mb-5">Use your own terms — descriptive, typological, technological, or uncertain. The system understands all of them.</p><div className="flex gap-1 bg-secondary/30 rounded-lg p-1 mb-5 w-fit">{["describe", "upload", "both"].map(D => <button onClick={() => u(D)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${c === D ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`} key={D}>{D === "both" ? "Both" : D === "describe" ? "Describe" : "Upload image"}</button>)}</div>{Rr && <div className="mb-5"><p className="text-xs text-muted-foreground mb-2 font-medium">Vessel descriptions</p><div className="flex flex-wrap gap-2 mb-3">{DEMO_DESCRIPTIONS.map(D => <button onClick={() => lt(D)} className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${h.find(X => X.text === D) ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`} key={D}>{D}</button>)}</div><p className="text-xs text-muted-foreground mb-2 font-medium">Fabric & petrographic</p><div className="flex flex-wrap gap-2 mb-4">{DEMO_FABRIC_NOTES.map(D => <button onClick={() => lt(D)} className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${h.find(X => X.text === D) ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`} key={D}>{D}</button>)}</div><div className="flex gap-2"><input value={p} onChange={D => b(D.target.value)} onKeyDown={D => {
                D.key === "Enter" && (lt(p.trim()), b(""));
              }} placeholder="Add your own observation…" className="flex-1 bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary" /><button onClick={() => {
                lt(p.trim()), b("");
              }} className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"><Plus className="w-4 h-4" /></button></div></div>}{_t && <div className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center mb-5 hover:border-primary/60 transition-colors cursor-pointer" onDrop={hr} onDragOver={D => D.preventDefault()} onClick={() => _.current?.click()}>{x ? <div className="relative inline-block"><img src={x} alt="Uploaded sherd" className="max-h-40 rounded-lg mx-auto object-contain" /><button onClick={D => {
                D.stopPropagation(), y(null);
              }} className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-white flex items-center justify-center"><X className="w-3 h-3" /></button></div> : <><ImagePlus className="w-8 h-8 text-primary/40 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Drop a photo or click to browse.</p><p className="text-xs text-muted-foreground/60 mt-1">Vessel photos, sherd images, and petrographic thin-sections all work.</p></>}<input ref={_} type="file" accept="image/*" className="hidden" onChange={D => {
              const X = D.target.files?.[0];
              X && y(URL.createObjectURL(X));
            }} /></div>}<p className="text-xs text-muted-foreground mb-5">Not sure how to describe it? That's okay — partial or uncertain descriptions work fine.</p><button onClick={Mt} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Sparkles className="w-4 h-4" />{" Find similar →"}</button></div><div className="bg-card border border-border rounded-2xl p-6 h-fit"><h3 className="font-semibold text-foreground text-sm mb-3">What we're matching on</h3>{h.length === 0 && !x ? <p className="text-xs text-muted-foreground italic">Add observations on the left to see them here.</p> : <div className="flex flex-wrap gap-2 mb-4">{h.map(D => <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs" key={D.id}>{D.text}<button onClick={() => f(X => X.filter(Ue => Ue.id !== D.id))} className="opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button></span>)}{x && <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs"><ImagePlus className="w-3 h-3" />{" Image attached"}</span>}</div>}<div className="bg-secondary/30 rounded-xl p-4 text-xs text-muted-foreground leading-relaxed">We'll search structured records, fabrics, types, and vessels for matches. You'll see ranked possibilities with the reasoning behind each match.</div></div></div></div>}{i === "compare" && <div className="max-w-6xl mx-auto px-6">{me && <div className="mb-4 flex items-center gap-2 px-4 py-2.5 bg-primary/10 border border-primary/20 rounded-lg text-sm text-primary"><Check className="w-4 h-4 shrink-0" />Refinements applied. Your reasoning is saved in the workspace below.</div>}<div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"><div><div className="flex items-center justify-between mb-4"><div><h2 className="font-serif text-foreground text-lg">Possible matches</h2><p className="text-xs text-muted-foreground">{N.length}{" possibilities found · Ranked by match strength"}</p></div><p className="text-xs text-muted-foreground/70 italic text-right max-w-[200px]">You decide — these are suggestions, not classifications.</p></div><div className="space-y-4 mb-6">{N.map(D => <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow" key={D.id}><div className="flex gap-4"><PlaceholderIcon /><div className="flex-1 min-w-0"><div className="flex items-start justify-between gap-2 mb-1"><div><p className="font-semibold text-foreground text-sm">{D.name}</p><p className="text-xs text-muted-foreground">{D.ware}</p></div><button onClick={() => F(X => {
                      const Ue = new Set(X);
                      return Ue.has(D.id) ? Ue.delete(D.id) : Ue.add(D.id), Ue;
                    })} className="shrink-0 text-muted-foreground hover:text-primary transition-colors">{B.has(D.id) ? <Bookmark className="w-4 h-4 text-primary" fill="currentColor" /> : <BookmarkPlus className="w-4 h-4" />}</button></div><p className={`text-xs mb-1.5 ${D.matchStrength === "strong" ? "text-primary" : D.matchStrength === "moderate" ? "text-amber-600" : "text-muted-foreground"}`}>{D.matchLabel}</p><StrengthBar strength={D.matchStrength} /><div className="flex flex-wrap gap-1.5 mt-2">{D.matchedAttrs.map(X => <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs" key={X}><Check className="w-2.5 h-2.5" strokeWidth={3} />{" "}{X}</span>)}{D.missedAttrs.map(X => <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground text-xs" key={X}><X className="w-2.5 h-2.5" />{" "}{X}</span>)}</div></div></div><div className="flex items-center justify-between mt-4 pt-3 border-t border-border"><Link to="/browse" className="text-xs text-primary hover:underline underline-offset-2">View details →</Link><button onClick={() => dr(D.id)} className="text-xs text-muted-foreground hover:text-primary transition-colors">This is close, but…</button></div></div>)}</div><div className="flex items-center gap-3"><button onClick={() => dr(N[0].id)} className="text-sm text-muted-foreground hover:text-primary transition-colors">Refine results →</button></div></div><div className="bg-card border border-border rounded-2xl p-6 h-fit"><h3 className="font-semibold text-foreground text-sm mb-3">Why we suggested these</h3><p className="text-sm text-muted-foreground leading-relaxed mb-4">{"You described a "}{h[0] ? `'${h[0].text}'` : "ceramic vessel"}{h[1] ? ` and '${h[1].text}'` : ""}. We searched for records with matching surface treatment, vessel form, and regional affinity. Panama Plain matches most strongly on form and surface. Cubita Polychrome matches on region but differs in decoration.</p><button onClick={() => E(D => !D)} className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-2">{"How matching works "}{S ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>{S && <div className="mt-3 text-xs text-muted-foreground leading-relaxed bg-secondary/30 rounded-lg p-3">PACP searches both structured attribute fields (ware family, vessel form, region, fabric composition) and your free-form descriptive terms. Results are ranked by how many of your stated observations align with documented records. No single attribute is determinative — you decide which matches are worth pursuing.</div>}</div></div></div>}{i === "refine" && <div className="max-w-6xl mx-auto px-6"><div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6"><div className="bg-card border border-border rounded-2xl p-6"><h2 className="font-serif text-foreground text-lg mb-1">{"Refining: "}{Te.name}</h2><p className="text-xs text-muted-foreground mb-5">What about this match doesn't fit?</p><div className="flex gap-4 p-4 bg-secondary/20 rounded-xl border border-border mb-6"><PlaceholderIcon /><div><p className="font-semibold text-foreground text-sm">{Te.name}</p><p className="text-xs text-muted-foreground mb-1">{Te.ware}</p><p className={`text-xs ${Te.matchStrength === "strong" ? "text-primary" : "text-amber-600"}`}>{Te.matchLabel}</p><StrengthBar strength={Te.matchStrength} /></div></div><p className="text-xs font-medium text-foreground mb-3">What about this doesn't fit?</p><div className="flex flex-wrap gap-2 mb-5">{REFINE_REASONS.map(D => <button onClick={() => j(X => X.includes(D) ? X.filter(Ue => Ue !== D) : [...X, D])} className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${U.includes(D) ? "bg-primary/10 border-primary text-primary" : "border-border text-muted-foreground hover:border-primary hover:text-primary"}`} key={D}>{D}</button>)}</div><label className="block text-xs font-medium text-foreground mb-1.5">Why this isn't quite right:</label><textarea value={V} onChange={D => q(D.target.value)} placeholder="Add a note explaining the mismatch in your own words…" rows={3} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary mb-4" /><label className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer select-none mb-6"><input type="checkbox" checked={C} onChange={D => $(D.target.checked)} className="accent-primary w-4 h-4 rounded" />Boost matches with similar form but different surface treatment</label><button onClick={nt} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">Apply and re-rank →</button></div><div className="bg-card border border-border rounded-2xl p-6 h-fit"><h3 className="font-semibold text-foreground text-sm mb-1">How this will change your matches</h3><p className="text-xs text-muted-foreground mb-4">Select refinement tags to preview re-ranking.</p><div className="space-y-3 mb-4">{mr().map(({
              result: D,
              direction: X
            }) => <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg" key={D.id}><div className="w-2 h-2 rounded-full shrink-0 bg-primary/30" /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-foreground truncate">{D.name}</p><p className="text-xs text-muted-foreground">{D.ware}</p></div><div className={`shrink-0 ${X === "up" ? "text-primary" : X === "down" ? "text-amber-500" : "text-muted-foreground/40"}`}>{X === "up" ? <ArrowUp className="w-4 h-4" /> : X === "down" ? <ArrowDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}</div></div>)}</div><p className="text-xs text-muted-foreground/70 italic">Apply refinements to lock in this re-ranking.</p></div></div></div>}{i === "reason" && <div className="max-w-6xl mx-auto px-6"><div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6"><div className="bg-card border border-border rounded-2xl p-6"><h2 className="font-serif text-foreground text-lg mb-1">Your reasoning workspace</h2><p className="text-sm text-muted-foreground mb-6">Every action you take is preserved here — this is your transparent interpretive history.</p><div className="relative pl-6 mb-6"><div className="absolute left-2 top-1 bottom-1 w-px bg-primary/20" /><div className="space-y-5">{ce.map(D => <div className="relative" key={D.id}><div className="absolute -left-6 mt-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-white" /><div className="bg-secondary/20 rounded-xl p-4 border border-border/50"><div className="flex items-start justify-between gap-2 mb-1">{we === D.id ? <div className="flex-1 flex gap-2"><input value={W} onChange={X => R(X.target.value)} onKeyDown={X => X.key === "Enter" && At(D.id)} className="flex-1 bg-white border border-primary/30 rounded-md px-2 py-1 text-sm focus:outline-none focus:border-primary" autoFocus={!0} /><button onClick={() => At(D.id)} className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md">Save</button><button onClick={() => ne(null)} className="px-2 py-1 text-xs border border-border rounded-md text-muted-foreground">Cancel</button></div> : <><p className="text-sm font-medium text-foreground leading-snug">{D.text}</p><div className="flex items-center gap-2 shrink-0"><button onClick={() => {
                          ne(D.id), R(D.text);
                        }} className="text-xs text-primary/60 hover:text-primary transition-colors"><Pencil className="w-3 h-3" /></button><button onClick={() => K(D.id)} className="text-xs text-muted-foreground/40 hover:text-destructive transition-colors"><X className="w-3 h-3" /></button></div></>}</div>{D.subtext && <p className="text-xs text-muted-foreground leading-relaxed mb-2">{D.subtext}</p>}<div className="flex items-center gap-1 text-xs text-muted-foreground/50"><Clock className="w-3 h-3" />{" "}{D.time}</div>{ae === D.id && <div className="mt-3 p-3 bg-destructive/5 border border-destructive/20 rounded-lg"><p className="text-xs text-muted-foreground mb-2">This removes the entry but won't undo the action. Continue?</p><div className="flex gap-2"><button onClick={() => Ar(D.id)} className="px-3 py-1 text-xs bg-destructive text-white rounded-md">Remove</button><button onClick={() => K(null)} className="px-3 py-1 text-xs border border-border rounded-md text-muted-foreground">Keep it</button></div></div>}</div></div>)}</div></div><div className="border-t border-border pt-5"><label className="block text-xs font-medium text-foreground mb-2">Add to your reasoning</label><textarea value={We} onChange={D => _e(D.target.value)} placeholder="Note observations, doubts, or questions for future review…" rows={3} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary mb-2" /><button onClick={Qt} disabled={!We.trim()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:pointer-events-none"><Plus className="w-3 h-3" />{" Add note"}</button></div></div><div className="bg-card border border-border rounded-2xl p-5 h-fit sticky top-6"><h3 className="font-semibold text-foreground text-sm mb-4">Reasoning summary</h3><div className="space-y-3 text-sm"><div className="flex flex-col gap-0.5"><span className="text-xs text-muted-foreground uppercase tracking-wide">Current best match</span><span className="font-semibold text-foreground">{N.find(D => D.matchStrength === "strong")?.name ?? N[0]?.name ?? "—"}</span></div><div className="flex flex-col gap-0.5"><span className="text-xs text-muted-foreground uppercase tracking-wide">Strength</span><span className="text-primary text-sm">Strong (4 of 5 attributes)</span></div><div className="flex flex-col gap-0.5"><span className="text-xs text-muted-foreground uppercase tracking-wide">Open questions</span><span className="text-muted-foreground text-xs italic">"Decoration: unclear"</span></div><div className="flex flex-col gap-0.5"><span className="text-xs text-muted-foreground uppercase tracking-wide">Refinements applied</span><span className="text-foreground">{Ct}</span></div><div className="flex flex-col gap-0.5"><span className="text-xs text-muted-foreground uppercase tracking-wide">Timeline events</span><span className="text-foreground">{ce.length}</span></div></div><div className="mt-5 pt-4 border-t border-border space-y-2"><p className="text-xs text-muted-foreground/70 leading-relaxed">This summary is what you'd attach to a paper or share with a colleague.</p><button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"><Download className="w-3 h-3" />{" Export reasoning"}</button></div></div></div></div>}{i === "save" && <div className="max-w-4xl mx-auto px-6"><h2 className="font-serif text-foreground text-xl mb-1">How would you like to save this?</h2><p className="text-sm text-muted-foreground mb-6">Your reasoning history travels with whatever you choose.</p><div className="bg-secondary/30 border border-border rounded-xl p-4 mb-6 text-sm"><p className="font-medium text-foreground mb-0.5">{"You're saving an identification of: "}{N.find(D => D.matchStrength === "strong")?.name ?? N[0]?.name}{" (Strong match)"}</p><p className="text-muted-foreground text-xs">{"With "}{Ct}{" refinement"}{Ct !== 1 ? "s" : ""}{", "}{ce.filter(D => D.type === "note").length}{" note"}{ce.filter(D => D.type === "note").length !== 1 ? "s" : ""}{", and "}{ce.length}{" timeline event"}{ce.length !== 1 ? "s" : ""}{" in your reasoning history."}</p><p className="text-muted-foreground text-xs mt-0.5">Saved to: Your workspace</p></div><div className="space-y-4 mb-8"><button onClick={() => Ce("tentative")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${re === "tentative" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}><div className="flex items-start gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${re === "tentative" ? "bg-primary/15" : "bg-secondary/40"}`}><Tag className={`w-5 h-5 ${re === "tentative" ? "text-primary" : "text-muted-foreground"}`} /></div><div className="flex-1"><p className="font-semibold text-foreground text-sm mb-1">Save as a tentative match</p><p className="text-xs text-muted-foreground leading-relaxed mb-3">{"Attach your reasoning to "}{N.find(D => D.matchStrength === "strong")?.name ?? "the closest match"}{" as a working interpretation. You can return to refine or change later. Other researchers can see your reasoning if you choose to share."}</p>{re === "tentative" && <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-border"><div><p className="text-xs font-medium text-foreground mb-1.5">Visibility</p><div className="flex gap-2">{["private", "contributors", "public"].map(D => <label onClick={X => X.stopPropagation()} className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer" key={D}><input type="radio" name="visibility" value={D} checked={xe === D} onChange={() => ue(D)} className="accent-primary" />{D === "private" ? "Private" : D === "contributors" ? "PACP contributors" : "Public"}</label>)}</div></div><div><p className="text-xs font-medium text-foreground mb-1.5">Confidence tag</p><select value={fe} onChange={D => pe(D.target.value)} onClick={D => D.stopPropagation()} className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-foreground focus:outline-none focus:border-primary"><option value="strongly-suggested">Strongly suggested</option><option value="tentative">Tentative</option><option value="exploratory">Exploratory</option></select></div></div>}</div>{re === "tentative" && <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}</div></button><button onClick={() => Ce("unresolved")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${re === "unresolved" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}><div className="flex items-start gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${re === "unresolved" ? "bg-primary/15" : "bg-secondary/40"}`}><CircleHelp className={`w-5 h-5 ${re === "unresolved" ? "text-primary" : "text-muted-foreground"}`} /></div><div><p className="font-semibold text-foreground text-sm mb-1">Save as unresolved</p><p className="text-xs text-muted-foreground leading-relaxed">Keep this in your workspace without committing to any match. Useful when you want to come back with more data or expert input.</p></div>{re === "unresolved" && <div className="ml-auto shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}</div></button><button onClick={() => Ce("expert")} className={`w-full text-left p-5 rounded-xl border-2 transition-all ${re === "expert" ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}><div className="flex items-start gap-4"><div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${re === "expert" ? "bg-primary/15" : "bg-secondary/40"}`}><Users className={`w-5 h-5 ${re === "expert" ? "text-primary" : "text-muted-foreground"}`} /></div><div className="flex-1"><p className="font-semibold text-foreground text-sm mb-1">Request expert review</p><p className="text-xs text-muted-foreground leading-relaxed mb-3">Flag this for community review. Your reasoning is visible to PACP admins and reviewers, who can suggest matches, request more info, or weigh in on the interpretation.</p>{re === "expert" && <div className="mt-1 pt-3 border-t border-border"><p className="text-xs font-medium text-foreground mb-1.5">Select review group:</p><select value={Ae} onChange={D => Ve(D.target.value)} onClick={D => D.stopPropagation()} className="text-xs border border-border rounded-lg px-2 py-1.5 bg-white text-foreground focus:outline-none focus:border-primary"><option value="pacp-general">PACP General Review</option><option value="mesoamerican">Mesoamerican Specialists</option><option value="petrographic">Petrographic Working Group</option><option value="custom">Custom group</option></select></div>}</div>{re === "expert" && <div className="shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}</div></button></div></div>}<div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border"><div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between"><button type="button" onClick={ct[i].action} className="px-5 py-2.5 rounded-lg border border-border text-sm text-muted-foreground bg-card hover:bg-secondary/40 transition-colors">{ct[i].label}</button><button type="button" onClick={Zt[i].action} className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">{Zt[i].label}{" "}<ArrowRight className="w-4 h-4" /></button></div></div>{vt && <IdentifyToast message={vt} onDismiss={() => st(null)} />}</div>;
}

export default IdentifyPage;
