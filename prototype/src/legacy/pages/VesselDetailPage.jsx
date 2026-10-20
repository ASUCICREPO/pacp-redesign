import { ChevronDown, ChevronRight, ChevronUp, Download, Eye, FileText, Lock, ShieldAlert, SquarePen, Users, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useParams } from '../router.jsx';
import { StatusBadge } from '../components/StatusBadge.jsx';
import { findDraft, useDrafts } from '@/lib/extraction/drafts';

import { Editable, RecordEditProvider, SectionEditButton, SectionEditNote } from '../components/RecordEditing.jsx';

import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';
import { DraftRecordDetail } from './DraftRecordDetail.jsx';
import { markerIcon } from '../lib/leaflet.js';
import { RecordCitation } from '../components/RecordCitation.jsx';

export function OnThisPageNav({
  sections: i
}) {
  const [n, o] = useState(i[0]?.id || "");
  useEffect(() => {
    const c = new IntersectionObserver(u => {
      u.forEach(h => {
        h.isIntersecting && o(h.target.id);
      });
    }, {
      rootMargin: "-100px 0px -66% 0px"
    });
    return i.forEach(({
      id: u
    }) => {
      const h = document.getElementById(u);
      h && c.observe(h);
    }), () => c.disconnect();
  }, [i]);
  const s = c => {
    const u = document.getElementById(c);
    if (u) {
      const f = u.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: f - 80,
        behavior: "smooth"
      });
    }
  };
  return <nav className="sticky top-20 bg-card border border-border rounded-lg p-4"><h3 className="font-serif text-foreground mb-3 text-sm">On This Page</h3><ul className="space-y-2">{i.map(c => <li key={c.id}><button onClick={() => s(c.id)} className={`text-sm text-left w-full py-1 px-2 rounded transition-colors ${n === c.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>{c.label}</button></li>)}</ul></nav>;
}

export function PrivacyBadge({
  privacy: i,
  className: n = ""
}) {
  const o = {
      Public: {
        icon: Eye,
        className: "bg-green-100 text-green-800 border-green-200"
      },
      Restricted: {
        icon: ShieldAlert,
        className: "bg-yellow-100 text-yellow-800 border-yellow-200"
      },
      Private: {
        icon: Lock,
        className: "bg-red-100 text-red-800 border-red-200"
      }
    },
    {
      icon: S,
      className: c
    } = o[i];
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${c} ${n}`}><S className="w-3.5 h-3.5" />{i}</span>;
}

export function ExpandableText({
  children: i,
  maxLength: n = 300,
  className: o = ""
}) {
  const [s, c] = useState(!1);
  if (!(i.length > n)) return <div className={o}>{i}</div>;
  const h = s ? i : i.slice(0, n) + "...";
  return <div className={o}><p className="mb-2">{h}</p><button onClick={() => c(!s)} className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors">{s ? <>{"Show less "}<ChevronUp className="w-4 h-4" /></> : <>{"Show more "}<ChevronDown className="w-4 h-4" /></>}</button></div>;
}

export function InterpretationsBlock({
  title: i,
  interpretations: n,
  helperText: o
}) {
  return n.length === 0 ? null : <div className="space-y-4"><div><h3 className="text-sm font-semibold text-foreground mb-1">{i}</h3>{o && <p className="text-xs text-muted-foreground">{o}</p>}</div>{n.length > 1 && <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4"><div className="flex items-start gap-2"><Users className="w-4 h-4 text-primary mt-0.5 shrink-0" /><p className="text-sm text-foreground"><strong>Multiple interpretations:</strong>{" These are competing interpretations from different contributors, not errors. Each reflects a valid scholarly perspective."}</p></div></div>}<div className="space-y-3">{n.map(s => <div className="bg-card border border-border rounded-lg p-4" key={s.id}><div className="flex items-start justify-between mb-2"><div className="flex-1"><div className="font-semibold text-foreground mb-1">{s.classification}</div><div className="text-xs text-muted-foreground">{"Typology: "}{s.typology}</div></div>{s.confidence && <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${s.confidence === "High" ? "bg-primary/10 text-primary" : s.confidence === "Moderate" ? "bg-secondary/20 text-secondary-foreground" : "bg-muted text-muted-foreground"}`}>{s.confidence}{" confidence"}</span>}</div><div className="flex items-center gap-4 text-xs text-muted-foreground"><span>{"Attributed to: "}{s.contributor}</span><span>•</span><span>{s.date}</span></div></div>)}</div></div>;
}

export const VESSEL_SECTIONS = [{
  id: "context",
  label: "Context Information"
}, {
  id: "details",
  label: "Vessel Details"
}, {
  id: "images",
  label: "Vessel Images"
}, {
  id: "break-photos",
  label: "Break Photos"
}, {
  id: "thin-section",
  label: "Thin Section Photos"
}, {
  id: "types",
  label: "Associated Types"
}, {
  id: "ware",
  label: "Associated Ware/Ware Family"
}, {
  id: "petro-fabric",
  label: "Associated Petro-fabric"
}, {
  id: "kiln",
  label: "Associated Kiln"
}, {
  id: "workshop",
  label: "Associated Workshop"
}, {
  id: "housing",
  label: "Vessel Housing Location"
}, {
  id: "external-data",
  label: "External Data Sources"
}, {
  id: "bibliography",
  label: "Bibliography"
}, {
  id: "discussion",
  label: "Discussion & Acknowledgements"
}];

export function VesselDetailPage() {
  const {
      id: i
    } = useParams(),
    n = SAMPLE_ARTIFACTS.find(f => f.id === i),
    drafts = useDrafts(),
    draft = findDraft(drafts, i),
    [o, s] = useState(null);
  // A record accepted from a PDF is reviewed here, on the detail page the
  // reviewer already knows, rather than on a page of its own.
  if (!n && draft) return <DraftRecordDetail draft={draft} />;
  if (!n) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Vessel not found</p></div>;
  const c = [{
      url: n.images.exterior,
      caption: "Exterior view - complete vessel"
    }, {
      url: n.images.interior,
      caption: "Interior view - rim and neck detail"
    }].filter(f => f.url),
    u = [{
      url: n.images.breakShot,
      caption: "Cross-section showing fabric structure"
    }].filter(f => f.url),
    h = [{
      url: n.images.thinSection,
      caption: "Thin section - showing volcanic temper inclusions"
    }].filter(f => f.url);
  return <RecordEditProvider recordId={n.id}><div className="min-h-screen bg-background"><div className="bg-card border-b border-border"><div className="max-w-7xl mx-auto px-4 py-4"><nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4"><Link to="/" className="hover:text-foreground transition-colors">Home</Link><ChevronRight className="w-4 h-4" /><Link to="/browse" className="hover:text-foreground transition-colors">Vessels</Link><ChevronRight className="w-4 h-4" /><span className="text-foreground">{n.name}</span></nav><div className="flex items-start justify-between gap-4 mb-4"><div className="flex-1"><h1 className="font-serif text-foreground mb-2">{n.name}</h1><div className="flex items-center gap-3 text-sm text-muted-foreground"><span>Submitted by Dr. Sarah Chen</span><span>·</span><span>March 15, 2026</span></div></div><div className="flex gap-2"><StatusBadge status="community-reviewed" /><PrivacyBadge privacy={n.privacy} /></div></div><div className="flex gap-3"><button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-2"><FileText className="w-4 h-4" />Get Citation</button><button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center gap-2"><Download className="w-4 h-4" />Download Data</button></div></div></div><div className="max-w-7xl mx-auto px-4 py-6"><div className="grid grid-cols-4 gap-8"><div className="col-span-1"><OnThisPageNav sections={VESSEL_SECTIONS} /></div><div className="col-span-3 space-y-12"><section id="context"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Context Information</h2><SectionEditButton section="context" /></div><SectionEditNote section="context" /><div className="bg-card border border-border rounded-lg p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><dt className="text-sm text-muted-foreground mb-1">Excavation Site</dt><dd className="text-foreground"><Editable section="context" fieldKey="context.site" value={n.location}>{n.location}</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Site Code</dt><dd className="text-foreground"><Editable section="context" fieldKey="context.siteCode" value={"LQ-2024-V-112"}>LQ-2024-V-112</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Excavation Unit</dt><dd className="text-foreground"><Editable section="context" fieldKey="context.unit" value={"Unit 5, Level 3"}>Unit 5, Level 3</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Context Type</dt><dd className="text-foreground"><Editable section="context" fieldKey="context.contextType" value={"Midden deposit"}>Midden deposit</Editable></dd></div></div></div></section><section id="details"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Vessel Details</h2><SectionEditButton section="details" /></div><SectionEditNote section="details" /><div className="bg-card border border-border rounded-lg p-6 space-y-4"><div className="grid grid-cols-2 gap-4"><div><dt className="text-sm text-muted-foreground mb-1">Shape</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.shape" value={"Jar"}>Jar</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Functional Category</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.functional" value={n.type}>{n.type}</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Period</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.period" value={n.period}>{n.period}</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Ceramic Tradition</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.tradition" value={n.tradition}>{n.tradition}</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Height (cm)</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.height" value={"24.5"}>24.5</Editable></dd></div><div><dt className="text-sm text-muted-foreground mb-1">Rim Diameter (cm)</dt><dd className="text-foreground"><Editable section="details" fieldKey="details.rim" value={"12.0"}>12.0</Editable></dd></div></div><div><dt className="text-sm text-muted-foreground mb-2">Description</dt><Editable section="details" fieldKey="details.description" multiline value={`This vessel is a large storage jar from the Epiclassic period at La Quemada, representing the local ceramic tradition of north-central Mexico. The vessel features a restricted neck and globular body typical of storage forms from this region. Surface treatment includes burnishing on the exterior, creating a smooth, lustrous finish. The paste is relatively coarse with visible volcanic temper inclusions. Evidence of sooting on the exterior suggests secondary use for cooking or heating. The vessel was recovered from architectural fill in the Hall of Columns area, suggesting it was in use during the site's primary occupation phase (700-900 CE).`}><ExpandableText maxLength={200}>This vessel is a large storage jar from the Epiclassic period at La Quemada, representing the local ceramic tradition of north-central Mexico. The vessel features a restricted neck and globular body typical of storage forms from this region. Surface treatment includes burnishing on the exterior, creating a smooth, lustrous finish. The paste is relatively coarse with visible volcanic temper inclusions. Evidence of sooting on the exterior suggests secondary use for cooking or heating. The vessel was recovered from architectural fill in the Hall of Columns area, suggesting it was in use during the site's primary occupation phase (700-900 CE).</ExpandableText></Editable></div></div></section><section id="images"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Vessel Images ({c.length})</h2><SectionEditButton section="images" /></div><SectionEditNote section="images" /><div className="grid grid-cols-2 gap-4">{c.map((f, p) => <div className="bg-card border border-border rounded-lg overflow-hidden group relative" key={p}><div className="aspect-[4/3]"><img src={f.url} alt={f.caption} className="w-full h-full object-cover" /></div><button onClick={() => s(f.url)} className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"><ZoomIn className="w-8 h-8 text-white" /></button><div className="p-3"><p className="text-sm text-muted-foreground"><Editable section="images" fieldKey={`caption.${f.url}`} value={f.caption} /></p></div></div>)}</div></section><section id="break-photos"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Break Photos ({u.length})</h2><SectionEditButton section="break-photos" /></div><SectionEditNote section="break-photos" /><div className="grid grid-cols-2 gap-4">{u.map((f, p) => <div className="bg-card border border-border rounded-lg overflow-hidden" key={p}><div className="aspect-[4/3]"><img src={f.url} alt={f.caption} className="w-full h-full object-cover" /></div><div className="p-3"><p className="text-sm text-muted-foreground"><Editable section="break-photos" fieldKey={`caption.${f.url}`} value={f.caption} /></p></div></div>)}</div></section><section id="thin-section"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Thin Section Photos ({h.length})</h2><SectionEditButton section="thin-section" /></div><SectionEditNote section="thin-section" /><div className="grid grid-cols-2 gap-4">{h.map((f, p) => <div className="bg-card border border-border rounded-lg overflow-hidden" key={p}><div className="aspect-[4/3]"><img src={f.url} alt={f.caption} className="w-full h-full object-cover" /></div><div className="p-3"><p className="text-sm text-muted-foreground"><Editable section="thin-section" fieldKey={`caption.${f.url}`} value={f.caption} /></p></div></div>)}</div></section><section id="types"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Typological Classifications</h2><SectionEditButton section="types" /></div><SectionEditNote section="types" /><div className="bg-card border border-border rounded-lg p-6"><InterpretationsBlock title="Type Interpretations" helperText="Different researchers have classified this vessel according to their respective typological frameworks" interpretations={[{
                id: "1",
                classification: "La Quemada Burnished Jar - Type B Storage Form",
                typology: "Wheelbright 1975",
                contributor: "Dr. Sarah Chen",
                date: "March 15, 2026",
                confidence: "High"
              }, {
                id: "2",
                classification: "Epiclassic Storage Vessel - Form 3B",
                typology: "Nelson & Jiménez 1992",
                contributor: "Dr. Miguel Contreras",
                date: "January 8, 2026",
                confidence: "Moderate"
              }]} /></div></section><section id="ware"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Associated Ware/Ware Family</h2><SectionEditButton section="ware" /></div><SectionEditNote section="ware" /><div className="bg-card border border-border rounded-lg p-6"><Editable section="ware" fieldKey="ware.name" value="La Quemada Burnished Ware"><Link to="#" className="text-primary hover:underline">La Quemada Burnished Ware</Link></Editable></div></section><section id="petro-fabric"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Associated Petro-fabric</h2><SectionEditButton section="petro-fabric" /></div><SectionEditNote section="petro-fabric" /><div className="bg-card border border-border rounded-lg p-6"><p className="text-muted-foreground text-sm"><Editable section="petro-fabric" fieldKey="petro.text" multiline value="Medium-coarse fabric with abundant volcanic temper (basalt and rhyolite fragments), consistent with local geological sources in Zacatecas region" /></p></div></section><section id="kiln"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Associated Kiln</h2><SectionEditButton section="kiln" /></div><SectionEditNote section="kiln" /><div className="bg-card border border-border rounded-lg p-6"><Editable section="kiln" fieldKey="kiln.name" value="La Quemada Terrace Workshop Area - Kiln 3"><Link to="#" className="text-primary hover:underline">La Quemada Terrace Workshop Area - Kiln 3</Link></Editable></div></section><section id="workshop"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Associated Workshop</h2><SectionEditButton section="workshop" /></div><SectionEditNote section="workshop" /><div className="bg-card border border-border rounded-lg p-6"><Editable section="workshop" fieldKey="workshop.name" value="La Quemada Southwest Terrace Ceramic Workshop"><Link to="#" className="text-primary hover:underline">La Quemada Southwest Terrace Ceramic Workshop</Link></Editable></div></section><section id="housing"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Vessel Housing Location</h2><SectionEditButton section="housing" /></div><SectionEditNote section="housing" /><div className="bg-card border border-border rounded-lg p-6"><p className="text-foreground mb-4"><Editable section="housing" fieldKey="housing.location" value="Arizona State University - La Quemada Project Collections" /></p>{n.lat && n.lng && <div className="h-64 rounded-lg overflow-hidden border border-border"><MapContainer center={[n.lat, n.lng]} zoom={8} style={{
                  height: "100%",
                  width: "100%"
                }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'} /><Marker position={[n.lat, n.lng]} icon={markerIcon}><Popup>{n.location}</Popup></Marker></MapContainer></div>}</div></section><section id="external-data"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">External Data Sources</h2><SectionEditButton section="external-data" /></div><SectionEditNote section="external-data" /><div className="bg-card border border-border rounded-lg p-6 space-y-2"><Editable section="external-data" fieldKey="external.0" value="TDAR Repository - La Quemada Ceramic Database"><a href="#" className="block text-primary hover:underline">TDAR Repository - La Quemada Ceramic Database</a></Editable><Editable section="external-data" fieldKey="external.1" value="Open Context - Mesoamerican Ceramics Collection"><a href="#" className="block text-primary hover:underline">Open Context - Mesoamerican Ceramics Collection</a></Editable><Editable section="external-data" fieldKey="external.2" value="Digital Archaeological Record - La Quemada Project"><a href="#" className="block text-primary hover:underline">Digital Archaeological Record - La Quemada Project</a></Editable></div></section><RecordCitation record={n} recordType="Vessel" /><section id="bibliography"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Bibliography</h2><SectionEditButton section="bibliography" /></div><SectionEditNote section="bibliography" /><div className="bg-card border border-border rounded-lg p-6 space-y-3"><p className="text-sm"><Editable section="bibliography" fieldKey="bib.0" multiline value={`Nelson, B.A., Darling, J.A., & Kice, D.A. (1992). Mortuary Practices and the Social Order at La Quemada, Zacatecas, Mexico. Latin American Antiquity, 3(4), 298-315.`}>{"Nelson, B.A., Darling, J.A., & Kice, D.A. (1992). Mortuary Practices and the Social Order at La Quemada, Zacatecas, Mexico. "}<em>Latin American Antiquity</em>, 3(4), 298-315.</Editable></p><p className="text-sm"><Editable section="bibliography" fieldKey="bib.1" multiline value={`Trombold, C.D. (Ed.). (1991). Ancient Road Networks and Settlement Hierarchies in the New World. Cambridge: Cambridge University Press.`}>{"Trombold, C.D. (Ed.). (1991). "}<em>Ancient Road Networks and Settlement Hierarchies in the New World</em>. Cambridge: Cambridge University Press.</Editable></p><p className="text-sm"><Editable section="bibliography" fieldKey="bib.2" multiline value={`Weigand, P.C., & Beekman, C.S. (Eds.). (1998). Archaeology of West and Northwest Mesoamerica. Boulder: Westview Press.`}>{"Weigand, P.C., & Beekman, C.S. (Eds.). (1998). "}<em>Archaeology of West and Northwest Mesoamerica</em>. Boulder: Westview Press.</Editable></p></div></section><section id="discussion"><div className="flex items-center justify-between mb-4"><h2 className="font-serif text-foreground">Discussion & Acknowledgements</h2><SectionEditButton section="discussion" /></div><SectionEditNote section="discussion" /><div className="bg-card border border-border rounded-lg p-6"><Editable section="discussion" fieldKey="discussion.text" multiline value={`This vessel represents an important example of Epiclassic period ceramic production at La Quemada, one of the largest archaeological sites in north-central Mexico during the 7th-9th centuries CE. The burnished surface treatment and volcanic temper composition are characteristic of the local ceramic tradition. Petrographic analysis confirms the use of locally available volcanic materials, suggesting production at or near the site. The recovery context in monumental architecture indicates this vessel was in use during the site's florescence. We gratefully acknowledge the Arizona State University La Quemada Archaeological Project for access to materials, Dr. Ben Nelson for consultation on site context, and Dr. Maria Rodriguez for petrographic analysis. Fieldwork was supported by the National Science Foundation and the Wenner-Gren Foundation. We acknowledge that this research was conducted on the traditional lands of Indigenous peoples of Zacatecas.`}><ExpandableText maxLength={300}>This vessel represents an important example of Epiclassic period ceramic production at La Quemada, one of the largest archaeological sites in north-central Mexico during the 7th-9th centuries CE. The burnished surface treatment and volcanic temper composition are characteristic of the local ceramic tradition. Petrographic analysis confirms the use of locally available volcanic materials, suggesting production at or near the site. The recovery context in monumental architecture indicates this vessel was in use during the site's florescence. We gratefully acknowledge the Arizona State University La Quemada Archaeological Project for access to materials, Dr. Ben Nelson for consultation on site context, and Dr. Maria Rodriguez for petrographic analysis. Fieldwork was supported by the National Science Foundation and the Wenner-Gren Foundation. We acknowledge that this research was conducted on the traditional lands of Indigenous peoples of Zacatecas.</ExpandableText></Editable></div></section></div></div></div>{o && <div onClick={() => s(null)} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 cursor-pointer"><img src={o} alt="Enlarged view" className="max-w-full max-h-full object-contain" /></div>}</div></RecordEditProvider>;
}

export default VesselDetailPage;
