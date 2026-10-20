import { ArrowLeft, ChevronDown, ChevronRight, Download, MapPin } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Link, useParams } from '../router.jsx';
import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';
import { defaultMarkerIcon } from '../lib/leaflet.js';

export const PRODUCTION_STAGES = [{
  name: "Raw Materials",
  description: "Clay sourcing and preparation",
  techniques: ["Local clay deposits", "Tempering with sand"]
}, {
  name: "Forming",
  description: "Shaping the vessel",
  techniques: ["Wheel-thrown", "Coil-built"]
}, {
  name: "Surface Treatment",
  description: "Preparing the surface",
  techniques: ["Slip application", "Burnishing"]
}, {
  name: "Decoration",
  description: "Adding decorative elements",
  techniques: ["Stamped motifs", "Painted designs"]
}, {
  name: "Drying",
  description: "Air drying before firing",
  techniques: ["Shade drying", "7-14 days"]
}, {
  name: "Firing",
  description: "Final heat treatment",
  techniques: ["Oxidizing atmosphere", "850-950°C"]
}];

export function ProductionSequence({
  stages: i
}) {
  const [n, o] = useState(new Set([0])),
    s = c => {
      const u = new Set(n);
      u.has(c) ? u.delete(c) : u.add(c), o(u);
    };
  return <div className="space-y-4"><h3 className="font-serif text-foreground mb-4">Production Sequence</h3><div className="relative">{i.map((c, u) => <div className="relative pb-8 last:pb-0" key={u}>{u < i.length - 1 && <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-border" />}<div className="relative flex gap-4"><div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm z-10">{u + 1}</div><div className="flex-1"><button onClick={() => s(u)} className="w-full text-left group"><div className="flex items-center justify-between mb-1"><h4 className="font-serif text-foreground group-hover:text-primary transition-colors">{c.name}</h4>{n.has(u) ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}</div><p className="text-sm text-muted-foreground">{c.description}</p></button>{n.has(u) && <div className="mt-3 p-3 bg-muted/50 rounded-lg"><p className="text-sm mb-2">Techniques:</p><ul className="space-y-1">{c.techniques.map((h, f) => <li className="text-sm text-muted-foreground flex items-start gap-2" key={f}><span className="text-primary mt-1">•</span><span>{h}</span></li>)}</ul></div>}</div></div></div>)}</div></div>;
}

export function ArtifactDetailPage() {
  const {
      id: i
    } = useParams(),
    n = SAMPLE_ARTIFACTS.find(s => s.id === i);
  if (!n) return <div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Artifact not found</p></div>;
  const o = [{
    key: "exterior",
    label: "Exterior View"
  }, {
    key: "interior",
    label: "Interior View"
  }, {
    key: "breakShot",
    label: "Break Shot"
  }, {
    key: "thinSection",
    label: "Thin Section"
  }];
  return <div className="min-h-screen bg-background"><div className="max-w-7xl mx-auto px-4 py-6"><Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"><ArrowLeft className="w-4 h-4" />Back to Browse</Link><div className="grid grid-cols-2 gap-8"><div><div className="sticky top-20"><h1 className="font-serif text-foreground mb-4">{n.name}</h1><div className="grid grid-cols-2 gap-4 mb-6">{o.map(({
                key: s,
                label: c
              }) => n.images[s] ? <div className="space-y-2" key={s}><p className="text-sm text-muted-foreground">{c}</p><div className="aspect-square bg-muted rounded-lg overflow-hidden"><img src={n.images[s]} alt={c} className="w-full h-full object-cover" /></div></div> : null)}</div><button className="w-full px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"><Download className="w-4 h-4" />Download Data (CSV/JSON)</button></div></div><div className="space-y-8"><div><h3 className="font-serif text-foreground mb-4">Details</h3><dl className="space-y-3"><div><dt className="text-sm text-muted-foreground">Type</dt><dd className="text-foreground">{n.type}</dd></div><div><dt className="text-sm text-muted-foreground">Period</dt><dd className="text-foreground">{n.period}</dd></div><div><dt className="text-sm text-muted-foreground">Location</dt><dd className="flex items-center gap-2 text-foreground"><MapPin className="w-4 h-4" />{n.location}</dd></div>{n.tradition && <div><dt className="text-sm text-muted-foreground">Ceramic Tradition</dt><dd className="text-foreground"><Link to="#" className="text-primary hover:underline">{n.tradition}</Link></dd></div>}<div><dt className="text-sm text-muted-foreground">Privacy</dt><dd className="text-foreground">{n.privacy}</dd></div></dl></div><ProductionSequence stages={PRODUCTION_STAGES} />{n.lat && n.lng && <div><h3 className="font-serif text-foreground mb-4">Location Map</h3><div className="h-64 rounded-lg overflow-hidden border border-border"><MapContainer center={[n.lat, n.lng]} zoom={8} style={{
                height: "100%",
                width: "100%"
              }}><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution={'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'} /><Marker position={[n.lat, n.lng]} icon={defaultMarkerIcon}><Popup>{n.name}</Popup></Marker></MapContainer></div></div>}<div className="bg-muted/50 rounded-lg p-6"><h3 className="font-serif text-foreground mb-3">Sampling Transparency</h3><p className="text-sm text-muted-foreground mb-3">This entry includes petrographic analysis from thin section samples taken from the vessel's body. Samples were prepared following standard archaeological protocols.</p><p className="text-sm text-muted-foreground"><strong>Method:</strong>{" Standard 30μm thin sections · "}<strong>Lab:</strong>{" University Archaeological Sciences Lab · "}<strong>Date:</strong>{" March 2025"}</p></div></div></div></div></div>;
}

export default ArtifactDetailPage;
