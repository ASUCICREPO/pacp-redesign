import { Bookmark, Check, ChevronDown, ChevronRight, ChevronUp, Clock, Download, ExternalLink, FileText, Image, Info, Pencil, Plus, Search, Share2, Trash2, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from '../router.jsx';

export const COMPARE_VESSELS = [{
  id: "v1",
  name: "La Quemada V-112",
  ware: "Buff Ware",
  period: "700–900 CE",
  region: "Zacatecas, Mexico",
  recordType: "vessel",
  thumbBg: "from-amber-100 to-amber-200",
  images: ["front", "profile", "detail"],
  attrs: {
    Shape: "Bowl",
    "Shape type": "Restricted",
    "Shape family": "Closed vessels",
    "Functional category": "Storage",
    Height: "18 cm",
    "Maximum diameter": "24 cm",
    "Vessel parts present": "Rim, body, base",
    "Site name": "La Quemada",
    Country: "Mexico",
    Period: "700–900 CE (Epiclassic)",
    "Archaeological context": "Ceremonial precinct deposit",
    Ware: "Buff Ware",
    Type: "Coyotes Buff",
    "Petro-fabric": "Calc-silicate fabric",
    "Production site": "Unknown",
    Fabric: "Fine-grained buff matrix",
    Temper: "Calcite and quartz sand",
    "Forming techniques": "Coil-built",
    "Primary finish": "Smoothed",
    "Secondary finish": "Burnished",
    "Decorative technique": "Red painted lines",
    "Firing atmosphere": "Oxidizing"
  }
}, {
  id: "v2",
  name: "La Quemada V-113",
  ware: "Buff Ware",
  period: "700–900 CE",
  region: "Zacatecas, Mexico",
  recordType: "vessel",
  thumbBg: "from-orange-100 to-amber-100",
  images: ["front", "profile"],
  attrs: {
    Shape: "Jar",
    "Shape type": "Restricted",
    "Shape family": "Closed vessels",
    "Functional category": "Storage",
    Height: "22 cm",
    "Maximum diameter": "20 cm",
    "Vessel parts present": "Rim, body",
    "Site name": "La Quemada",
    Country: "Mexico",
    Period: "750–900 CE (Epiclassic)",
    "Archaeological context": "Midden deposit",
    Ware: "Buff Ware",
    Type: "Coyotes Buff",
    "Petro-fabric": "Calc-silicate fabric",
    "Production site": "Unknown",
    Fabric: "Fine-grained buff matrix",
    Temper: "Calcite, volcanic ash",
    "Forming techniques": "Coil-built",
    "Primary finish": "Smoothed",
    "Secondary finish": "Not provided",
    "Decorative technique": "Incised geometric",
    "Firing atmosphere": "Oxidizing"
  }
}, {
  id: "v3",
  name: "Panama V-048",
  ware: "Orange Ware",
  period: "300–700 CE",
  region: "Coclé, Panama",
  recordType: "vessel",
  thumbBg: "from-red-100 to-orange-100",
  images: ["front", "profile", "base"],
  attrs: {
    Shape: "Bowl",
    "Shape type": "Unrestricted",
    "Shape family": "Open vessels",
    "Functional category": "Serving",
    Height: "12 cm",
    "Maximum diameter": "28 cm",
    "Vessel parts present": "Complete",
    "Site name": "Sitio Conte",
    Country: "Panama",
    Period: "300–700 CE",
    "Archaeological context": "Burial context",
    Ware: "Orange Ware",
    Type: "Panama Plain",
    "Petro-fabric": "Granitic fabric",
    "Production site": "Not provided",
    Fabric: "Orange fine paste",
    Temper: "Quartz sand",
    "Forming techniques": "Wheel-coiled hybrid",
    "Primary finish": "Red slip",
    "Secondary finish": "Polished",
    "Decorative technique": "Plain",
    "Firing atmosphere": "Oxidizing"
  }
}, {
  id: "t1",
  name: "Cubita Polychrome (Type)",
  ware: "Polychrome Ware",
  period: "500–900 CE",
  region: "Coclé, Panama",
  recordType: "type",
  thumbBg: "from-rose-100 to-pink-100",
  images: ["front"],
  attrs: {
    Shape: "Bowl / Plate",
    "Shape type": "Unrestricted",
    "Shape family": "Open vessels",
    "Functional category": "Serving / Ceremonial",
    Height: "Variable",
    "Maximum diameter": "Variable",
    "Vessel parts present": "Varies",
    "Site name": "Multiple (Coclé region)",
    Country: "Panama",
    Period: "500–900 CE",
    "Archaeological context": "Burial and settlement",
    Ware: "Polychrome Ware",
    Type: "Cubita Polychrome",
    "Petro-fabric": "Mixed",
    "Production site": "Not identified",
    Fabric: "Fine orange paste",
    Temper: "Fine sand",
    "Forming techniques": "Not provided",
    "Primary finish": "Cream slip",
    "Secondary finish": "Polished",
    "Decorative technique": "Polychrome painted",
    "Firing atmosphere": "Oxidizing"
  }
}, {
  id: "p1",
  name: "PF-22 Granitic Fabric",
  ware: "Orange Ware (petrofabric)",
  period: "Pre-Columbian",
  region: "Pacific Panama",
  recordType: "petrofabric",
  thumbBg: "from-stone-100 to-stone-200",
  images: ["thin-section"],
  attrs: {
    Shape: "N/A",
    "Shape type": "N/A",
    "Shape family": "N/A",
    "Functional category": "N/A",
    Height: "N/A",
    "Maximum diameter": "N/A",
    "Vessel parts present": "Sherd fragment",
    "Site name": "Not provided",
    Country: "Panama",
    Period: "Pre-Columbian",
    "Archaeological context": "Not provided",
    Ware: "Orange Ware",
    Type: "Multiple",
    "Petro-fabric": "PF-22",
    "Production site": "Pacific Panama coast",
    Fabric: "Granitic matrix, coarse",
    Temper: "Quartz, feldspar, mica",
    "Forming techniques": "N/A",
    "Primary finish": "N/A",
    "Secondary finish": "N/A",
    "Decorative technique": "N/A",
    "Firing atmosphere": "N/A"
  }
}, {
  id: "v4",
  name: "Oaxaca Bowl SU-07",
  ware: "Grey Ware",
  period: "200 BCE–200 CE",
  region: "Oaxaca Valley, Mexico",
  recordType: "vessel",
  thumbBg: "from-slate-100 to-slate-200",
  images: ["front", "profile"],
  attrs: {
    Shape: "Bowl",
    "Shape type": "Restricted",
    "Shape family": "Semi-closed vessels",
    "Functional category": "Serving",
    Height: "9 cm",
    "Maximum diameter": "19 cm",
    "Vessel parts present": "Rim, body",
    "Site name": "San José Mogote",
    Country: "Mexico",
    Period: "200 BCE–200 CE (Monte Albán I-II)",
    "Archaeological context": "Elite residential deposit",
    Ware: "Grey Ware",
    Type: "Fidanque Grey",
    "Petro-fabric": "Volcanic fabric",
    "Production site": "Oaxaca Valley",
    Fabric: "Grey volcanic paste",
    Temper: "Volcanic rock, obsidian",
    "Forming techniques": "Coil-built",
    "Primary finish": "Grey slip",
    "Secondary finish": "Polished",
    "Decorative technique": "Incised post-fire",
    "Firing atmosphere": "Reducing"
  }
}];

export const COMPARE_TYPES = [{
  id: "s1",
  name: "Tonosi Trichrome",
  ware: "Polychrome Ware",
  period: "500–800 CE",
  region: "Los Santos, Panama",
  recordType: "type",
  thumbBg: "from-yellow-100 to-orange-100",
  images: ["front"],
  attrs: {}
}, {
  id: "s2",
  name: "Conte Style V-09",
  ware: "Orange Ware",
  period: "400–700 CE",
  region: "Coclé, Panama",
  recordType: "vessel",
  thumbBg: "from-orange-50 to-amber-100",
  images: ["front"],
  attrs: {}
}, {
  id: "s3",
  name: "Mesoamerican Storage Jar",
  ware: "Buff Ware",
  period: "600–900 CE",
  region: "Jalisco, Mexico",
  recordType: "vessel",
  thumbBg: "from-amber-50 to-yellow-100",
  images: ["front"],
  attrs: {}
}, {
  id: "s4",
  name: "PF-31 Calc-silicate",
  ware: "N/A",
  period: "Epiclassic",
  region: "Zacatecas",
  recordType: "petrofabric",
  thumbBg: "from-stone-50 to-slate-100",
  images: ["thin-section"],
  attrs: {}
}];

export const SAVED_COMPARISONS = [{
  label: "Panama Plain vs. Cubita Polychrome",
  ids: ["v3", "t1"]
}, {
  label: "Mesoamerican storage vessels by region",
  ids: ["v1", "v2", "v4"]
}, {
  label: "La Quemada assemblage",
  ids: ["v1", "v2"]
}];

export const COMPARE_ATTRIBUTE_GROUPS = [{
  label: "Morphological",
  keys: ["Shape", "Shape type", "Shape family", "Functional category", "Height", "Maximum diameter", "Vessel parts present"]
}, {
  label: "Site & Date",
  keys: ["Site name", "Country", "Period", "Archaeological context"]
}, {
  label: "Associations",
  keys: ["Ware", "Type", "Petro-fabric", "Production site"]
}, {
  label: "Technological",
  keys: ["Fabric", "Temper", "Forming techniques", "Primary finish", "Secondary finish", "Decorative technique", "Firing atmosphere"]
}];

export const COMPARE_VIEWS = ["Front", "Profile", "Base"];

export const COMPARE_NOTE_PRESETS = ["Similar form", "Different surface treatment", "Same region", "Date range overlaps", "Worth comparing further"];

export const RECORD_KIND_LABELS = {
  all: "All",
  vessel: "Vessels",
  type: "Types",
  petrofabric: "Petro-fabrics",
  sherd: "Sherds"
};

export function currentTimeLabel() {
  const i = new Date(),
    n = i.getHours(),
    o = String(i.getMinutes()).padStart(2, "0");
  return `${n % 12 || 12}:${o} ${n >= 12 ? "PM" : "AM"}`;
}

export function CompareToast({
  message: i,
  onDismiss: n
}) {
  return createPortal(<div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-foreground text-background rounded-xl shadow-xl text-sm max-w-xs"><Check className="w-4 h-4 text-primary shrink-0" /><span>{i}</span><button onClick={n} className="ml-auto opacity-60 hover:opacity-100"><X className="w-3.5 h-3.5" /></button></div>, document.body);
}

export function AddRecordModal({
  selected: i,
  onAdd: n,
  onClose: o
}) {
  const [s, c] = useState(""),
    [u, h] = useState("all"),
    [f, p] = useState([...i]),
    b = COMPARE_VESSELS.filter(y => {
      const _ = u === "all" || y.recordType === u,
        N = !s || y.name.toLowerCase().includes(s.toLowerCase()) || y.ware.toLowerCase().includes(s.toLowerCase());
      return _ && N;
    });
  function x(y) {
    p(_ => _.includes(y) ? _.filter(N => N !== y) : [..._, y]);
  }
  return createPortal(<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"><div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"><div className="px-6 pt-6 pb-4 border-b border-border"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground text-lg">Pick records to compare</h2><button onClick={o} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button></div><div className="relative mb-3"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input value={s} onChange={y => c(y.target.value)} placeholder="Search vessels, types, petro-fabrics, sherds…" className="w-full pl-9 pr-4 py-2 bg-secondary/30 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary" /></div><div className="flex gap-2 flex-wrap">{["all", "vessel", "type", "petrofabric", "sherd"].map(y => <button onClick={() => h(y)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${u === y ? "bg-primary text-primary-foreground" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/70"}`} key={y}>{RECORD_KIND_LABELS[y]}</button>)}</div></div><div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 gap-3">{b.map(y => {
          const _ = f.includes(y.id);
          return <button onClick={() => x(y.id)} className={`relative text-left rounded-xl border-2 overflow-hidden transition-all hover:shadow-md ${_ ? "border-primary" : "border-border"}`} key={y.id}>{_ && <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div>}<div className={`h-24 bg-gradient-to-br ${y.thumbBg} flex items-center justify-center`}><Image className="w-6 h-6 text-foreground/20" /></div><div className="p-2.5"><p className="text-xs font-semibold text-foreground truncate">{y.name}</p><p className="text-xs text-muted-foreground truncate">{y.ware}</p><span className="inline-block mt-1 px-1.5 py-0.5 bg-secondary/50 rounded text-xs text-muted-foreground capitalize">{y.recordType}</span></div></button>;
        })}</div><div className="px-6 py-4 border-t border-border flex items-center justify-between"><p className="text-xs text-muted-foreground">{f.length}{" selected"}</p><div className="flex gap-3"><button onClick={o} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">Cancel</button><button onClick={() => {
            n(f), o();
          }} disabled={f.length < 2} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none">{"Add "}{f.length >= 2 ? f.length : "2+"}{" selected → Compare"}</button></div></div></div></div>, document.body);
}

export function RecordDetailModal({
  record: i,
  onClose: n
}) {
  return createPortal(<div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={n}><div className="bg-white rounded-2xl overflow-hidden max-w-lg w-full" onClick={o => o.stopPropagation()}><div className="flex items-center justify-between px-5 py-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm">{i.name}{" — Images"}</h3><button onClick={n} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button></div><div className="p-5 grid grid-cols-2 gap-3">{i.images.map(o => <div className={`aspect-square rounded-xl bg-gradient-to-br ${i.thumbBg} flex flex-col items-center justify-center gap-1`} key={o}><Image className="w-8 h-8 text-foreground/20" /><span className="text-xs text-muted-foreground capitalize">{o}</span></div>)}</div></div></div>, document.body);
}

export function ComparePage() {
  const [i, n] = useState([]),
    [o, s] = useState(!1),
    [c, u] = useState(null),
    [h, f] = useState(!1),
    [p, b] = useState(new Set(["Site & Date", "Associations", "Technological"])),
    [x, y] = useState([]),
    [_, N] = useState(""),
    [P, S] = useState(null),
    [E, B] = useState(""),
    [F, U] = useState(null),
    [j, V] = useState(!1),
    q = useRef(null),
    C = i.map(W => COMPARE_VESSELS.find(R => R.id === W)).filter(Boolean);
  function $(W) {
    W.length > 4 && V(!0), n(W.slice(0, 6));
  }
  function me(W) {
    n(R => R.filter(ae => ae !== W)), V(!1);
  }
  function Le(W) {
    n(W);
  }
  function ce(W) {
    b(R => {
      const ae = new Set(R);
      return ae.has(W) ? ae.delete(W) : ae.add(W), ae;
    });
  }
  function ye() {
    _.trim() && (y(W => [...W, {
      id: crypto.randomUUID(),
      text: _.trim(),
      time: currentTimeLabel()
    }]), N(""));
  }
  function We(W) {
    y(R => R.map(ae => ae.id === W ? {
      ...ae,
      text: E
    } : ae)), S(null);
  }
  function _e() {
    U("Comparison saved to your workspace."), setTimeout(() => U(null), 4e3);
  }
  function we(W) {
    if (C.length < 2) return !1;
    const R = C.map(ae => ae.attrs[W] ?? "");
    return R.every(ae => ae === R[0] && ae !== "" && ae !== "Not provided" && ae !== "N/A");
  }
  if (C.length === 0) return <div className="min-h-screen bg-background"><div className="bg-card border-b border-border py-5"><div className="max-w-6xl mx-auto px-6"><nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"><Link to="/" className="hover:text-primary transition-colors">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-foreground font-medium">Compare Assemblages</span></nav><h1 className="font-serif text-foreground text-3xl mb-1">Compare Assemblages</h1><p className="text-muted-foreground text-sm max-w-2xl">Place vessels, types, and petro-fabrics side by side to surface similarities, differences, and open questions.</p><div className="mt-4 flex items-start gap-2 bg-primary/10 border border-primary/20 rounded-lg px-4 py-2.5 text-sm text-primary max-w-2xl"><Info className="w-4 h-4 mt-0.5 shrink-0" /><span>Comparison preserves your reasoning — every observation you make is saved to your workspace.</span></div></div></div><div className="max-w-6xl mx-auto px-6 py-8"><div className="bg-card border border-border rounded-2xl py-12 px-16 text-center mb-12"><h2 className="font-serif text-foreground text-xl mb-2">Start a comparison</h2><p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">Pick 2 or more records to compare. You can mix and match — vessels, types, petro-fabrics, or sherds.</p><div className="flex flex-col sm:flex-row gap-3 justify-center mb-6"><button onClick={() => s(!0)} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Plus className="w-4 h-4" />{" Pick from PACP"}</button><button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-border text-sm font-medium text-foreground hover:bg-secondary/30 transition-colors"><Plus className="w-4 h-4" />{" Drag and drop"}</button></div><p className="text-xs text-muted-foreground">You can also start from an existing identification —{" "}<Link to="/identify" className="text-primary hover:underline">Open a saved workspace →</Link></p></div><div className="mb-12"><h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Common comparison sets</h3><div className="grid grid-cols-3 gap-6">{SAVED_COMPARISONS.map(W => <button onClick={() => Le(W.ids)} className="text-left p-5 bg-card border border-border rounded-xl hover:border-primary/40 hover:shadow-sm transition-all group" key={W.label}><p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors mb-1">{W.label}</p><p className="text-xs text-muted-foreground">{W.ids.length}{" records"}</p></button>)}</div></div><div><h3 className="text-xs uppercase tracking-wider text-primary font-semibold mb-4">Recently viewed</h3><div className="grid grid-cols-5 gap-4">{COMPARE_VESSELS.slice(0, 5).map(W => <button onClick={() => {
            n([W.id]), s(!0);
          }} className="text-left bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all" key={W.id}><div className={`h-24 bg-gradient-to-br ${W.thumbBg} flex items-center justify-center`}><Image className="w-5 h-5 text-foreground/20" /></div><div className="p-3"><p className="text-xs font-medium text-foreground truncate">{W.name}</p><p className="text-xs text-muted-foreground truncate">{W.ware}</p></div></button>)}</div></div></div>{o && <AddRecordModal selected={i} onAdd={$} onClose={() => s(!1)} />}</div>;
  const ne = C.length < 4;
  return <div className="min-h-screen bg-background pb-24"><div className="bg-card border-b border-border px-6 py-5"><div className="max-w-full px-2"><nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3"><Link to="/" className="hover:text-primary transition-colors">Home</Link><ChevronRight className="w-3 h-3" /><span className="text-foreground font-medium">Compare Assemblages</span></nav><div className="flex items-center justify-between"><div><h1 className="font-serif text-foreground text-2xl mb-0.5">Compare Assemblages</h1><p className="text-xs text-muted-foreground">{C.length}{" record"}{C.length !== 1 ? "s" : ""}{" · You decide what the differences mean."}</p></div><div className="flex gap-2"><button onClick={() => s(!0)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"><Plus className="w-3.5 h-3.5" />{" Add record"}</button><button onClick={() => n([])} className="text-xs text-muted-foreground hover:text-destructive transition-colors px-2">Clear all</button></div></div></div></div>{j && <div className="max-w-full px-6 pt-4"><div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700"><Info className="w-4 h-4 shrink-0" />Comparing more than 4 makes scanning harder — consider grouping by attribute instead.{" "}<Link to="/browse" className="font-medium hover:underline ml-1">Browse filtered view →</Link></div></div>}<div className="flex gap-0 min-w-0"><div className="flex-1 overflow-x-auto min-w-0 px-6 pt-6"><div className="flex gap-0 min-w-max mb-0"><div className="w-44 shrink-0" />{C.map(W => <div className="w-56 shrink-0 border-x border-[#EFE7DC] first:border-l-0" key={W.id}><div className="relative bg-white border border-[#EFE7DC] rounded-t-xl overflow-hidden mx-1"><button onClick={() => me(W.id)} className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-white/80 border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"><X className="w-3 h-3" /></button><div className="h-44 bg-[#F4ECDF] flex items-center justify-center"><div className="w-10 h-10 rounded-full bg-white/60 flex items-center justify-center"><Image className="w-5 h-5 text-foreground/25" /></div></div><div className="p-3 border-t border-[#EFE7DC]"><p className="font-serif text-foreground text-sm font-semibold truncate">{W.name}</p><p className="text-xs text-muted-foreground truncate">{W.ware}</p><p className="text-xs text-muted-foreground/70">{W.period}{" · "}{W.region.split(",")[0]}</p><Link to="/browse" className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5">{"View full record "}<ExternalLink className="w-2.5 h-2.5" /></Link></div></div></div>)}{ne && <div className="w-56 shrink-0 px-1"><button onClick={() => s(!0)} className="w-full h-full min-h-[230px] rounded-xl border-2 border-dashed border-primary/25 flex flex-col items-center justify-center gap-2 text-primary/50 hover:border-primary/50 hover:text-primary transition-colors"><Plus className="w-5 h-5" /><span className="text-xs font-medium">Add another record</span></button></div>}</div><div className="flex gap-0 min-w-max border-b border-[#EFE7DC]"><div className="w-44 shrink-0 flex items-center px-3 py-2"><div><p className="text-[13px] font-medium text-[#3D3530]">Images</p><button onClick={() => f(W => !W)} className="text-xs text-primary hover:underline mt-0.5">{h ? "Photos" : "Illustrations"}</button></div></div>{C.map(W => <div className="w-56 shrink-0 border-x border-[#EFE7DC] px-3 py-2" key={W.id}><div className="flex gap-1.5">{COMPARE_VIEWS.map(R => W.images.some(K => K.toLowerCase() === R.toLowerCase() || R === "Front" && K === "front" || R === "Profile" && K === "profile" || R === "Base" && K === "base") ? <button onClick={() => u(W)} className="shrink-0 w-16 h-16 rounded-lg bg-white border border-[#E2D8CC] flex flex-col items-center justify-center gap-0.5 hover:border-primary/40 hover:opacity-80 transition-all" key={R}><Image className="w-4 h-4 text-foreground/30" /><span className="text-[10px] text-muted-foreground">{R}</span></button> : <div className="shrink-0 w-16 h-16 rounded-lg border border-dashed border-[#D4C9BC] flex flex-col items-center justify-center gap-0.5" key={R}><Image className="w-4 h-4 text-muted-foreground/20" /><span className="text-[10px] text-muted-foreground/30">{R}</span></div>)}</div></div>)}{ne && <div className="w-56 shrink-0" />}</div>{COMPARE_ATTRIBUTE_GROUPS.map(W => {
          const R = p.has(W.label);
          return <div className="min-w-max" key={W.label}><div className="flex gap-0 min-w-max mt-5"><div className="w-44 shrink-0 border-t border-[#E8DDD0] pt-3 pb-2 px-3"><button onClick={() => ce(W.label)} className="flex items-center gap-1.5 text-left group"><span className="text-[11px] uppercase tracking-widest text-primary font-semibold leading-none">{W.label}</span>{R ? <ChevronDown className="w-3 h-3 text-primary/60 shrink-0" /> : <ChevronUp className="w-3 h-3 text-primary/60 shrink-0" />}{R && <span className="text-[11px] text-muted-foreground/50 ml-0.5">({W.keys.length})</span>}</button></div>{C.map(ae => <div className="w-56 shrink-0 border-t border-[#E8DDD0] pt-3 pb-2 border-x border-x-[#EFE7DC]" key={ae.id} />)}{ne && <div className="w-56 shrink-0 border-t border-[#E8DDD0]" />}</div>{!R && W.keys.map(ae => {
              const K = we(ae);
              return <div className={`flex gap-0 min-w-max border-b border-[#EFE7DC] ${K ? "bg-[#FAF6F0]" : "bg-white"}`} key={ae}><div className="w-44 shrink-0 flex items-center px-3 py-2"><span className="text-[13px] font-medium text-[#3D3530] flex items-center gap-1">{K && <Check className="w-3 h-3 text-primary shrink-0" strokeWidth={2.5} />}{ae}</span></div>{C.map(re => <div className="w-56 shrink-0 px-3 py-2 border-x border-[#EFE7DC] flex items-center" key={re.id}><span className={`text-[13px] leading-snug ${!re.attrs[ae] || re.attrs[ae] === "Not provided" || re.attrs[ae] === "N/A" ? "text-[#999] italic" : "text-[#3D3530]"}`}>{re.attrs[ae] || "Not provided"}</span></div>)}{ne && <div className="w-56 shrink-0 border-x border-[#EFE7DC]" />}</div>;
            })}</div>;
        })}<div className="flex gap-0 min-w-max pt-8 pb-6"><div className="w-44 shrink-0" /><div className="flex-1"><p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Want to compare more?</p><p className="text-xs text-muted-foreground mb-3">Based on what you've selected, these records might also be relevant.</p><div className="flex gap-3">{COMPARE_TYPES.filter(W => !i.includes(W.id)).slice(0, 4).map(W => <div className="w-44 shrink-0 bg-card border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow" key={W.id}><div className={`h-20 bg-gradient-to-br ${W.thumbBg} flex items-center justify-center`}><Image className="w-5 h-5 text-foreground/20" /></div><div className="p-3"><p className="text-xs font-semibold text-foreground truncate mb-0.5">{W.name}</p><p className="text-xs text-muted-foreground mb-2">{W.ware}</p><button onClick={() => {
                    C.length < 4 && n(R => [...R, W.id]);
                  }} disabled={C.length >= 4} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline disabled:opacity-40 disabled:pointer-events-none"><Plus className="w-3 h-3" />{" Add to comparison"}</button></div></div>)}</div></div></div></div><div className="w-[280px] shrink-0 sticky top-0 h-screen overflow-y-auto border-l border-border bg-card flex flex-col"><div className="p-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm mb-1">Your observations</h3><p className="text-xs text-muted-foreground leading-relaxed">Note what you see. Differences, similarities, uncertainties — your reasoning is saved as you work.</p></div><div className="flex-1 overflow-y-auto p-3 space-y-2.5">{x.length === 0 && <p className="text-xs text-muted-foreground/60 italic text-center py-4">No observations yet — add one below.</p>}{x.map(W => <div className="bg-secondary/20 rounded-lg p-3 border border-border/50" key={W.id}>{P === W.id ? <div className="flex flex-col gap-2"><input value={E} onChange={R => B(R.target.value)} onKeyDown={R => R.key === "Enter" && We(W.id)} className="bg-white border border-primary/30 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-primary" autoFocus={!0} /><div className="flex gap-1.5"><button onClick={() => We(W.id)} className="px-2 py-0.5 text-xs bg-primary text-white rounded">Save</button><button onClick={() => S(null)} className="px-2 py-0.5 text-xs border border-border rounded text-muted-foreground">Cancel</button></div></div> : <><p className="text-xs text-foreground leading-relaxed mb-1.5">{W.text}</p><div className="flex items-center justify-between"><div className="flex items-center gap-1 text-xs text-muted-foreground/50"><Clock className="w-2.5 h-2.5" />{" "}{W.time}</div><div className="flex gap-2"><button onClick={() => {
                    S(W.id), B(W.text);
                  }} className="text-muted-foreground/50 hover:text-primary transition-colors"><Pencil className="w-3 h-3" /></button><button onClick={() => y(R => R.filter(ae => ae.id !== W.id))} className="text-muted-foreground/50 hover:text-destructive transition-colors"><Trash2 className="w-3 h-3" /></button></div></div></>}</div>)}</div><div className="px-3 pt-3 border-t border-border"><div className="flex flex-wrap gap-1.5 mb-2.5">{COMPARE_NOTE_PRESETS.map(W => <button onClick={() => {
              N(W + " — "), q.current?.focus();
            }} className="px-2 py-0.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors" key={W}>{W}</button>)}</div><textarea ref={q} value={_} onChange={W => N(W.target.value)} onKeyDown={W => {
            W.key === "Enter" && !W.shiftKey && (W.preventDefault(), ye());
          }} placeholder="Add an observation…" rows={3} className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-xs placeholder:text-muted-foreground resize-none focus:outline-none focus:border-primary mb-2" /><button onClick={ye} disabled={!_.trim()} className="w-full px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:pointer-events-none mb-3">+ Add</button></div></div></div><div className="fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border px-6 py-2.5"><div className="max-w-6xl mx-auto flex items-center gap-2"><button onClick={_e} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"><Bookmark className="w-4 h-4" />{" Save comparison"}</button><button title="Export comparison" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"><Download className="w-4 h-4" /></button><button title="Share comparison" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"><Share2 className="w-4 h-4" /></button><button onClick={() => n([])} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"><FileText className="w-3.5 h-3.5" />{" Start a new comparison"}</button></div></div>{o && <AddRecordModal selected={i} onAdd={$} onClose={() => s(!1)} />}{c && <RecordDetailModal record={c} onClose={() => u(null)} />}{F && <CompareToast message={F} onDismiss={() => U(null)} />}</div>;
}

export default ComparePage;
