import { ChevronDown, ChevronRight, Clock, FileText, FlaskConical, GitCompare, MapPin, MessageCircle, Microscope, Package, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from '../router.jsx';
import { SAMPLE_ARTIFACTS } from '../data/SAMPLE_ARTIFACTS.js';
import { SAMPLE_PETRO_FABRICS, thinSectionImage } from '../data/SAMPLE_PETRO_FABRICS.js';
import {
  applyFacets,
  facetsFor,
  findRecord,
  parallelQueryFor,
  parallelsFor,
  quickStarts,
  searchParallels,
} from './searchModel.js';

export { SAMPLE_PETRO_FABRICS, thinSectionImage };

export const CONFIDENCE_STYLES = {
  High: {
    bg: "bg-[#8B3A2F]",
    text: "text-white",
    shadow: "shadow-md"
  },
  Moderate: {
    bg: "bg-[#D97706]",
    text: "text-white",
    shadow: "shadow-md"
  },
  Possible: {
    bg: "bg-[#78716C]",
    text: "text-white",
    shadow: "shadow-md"
  }
};

export function ArtifactResultCard({
  id: i,
  name: n,
  image: o,
  ware: s,
  region: c,
  period: u,
  contributor: h,
  confidence: f,
  matchReasons: p
}) {
  const b = CONFIDENCE_STYLES[f];
  return <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"><Link to={`/vessel/${i}`} className="block"><div className="aspect-square bg-muted relative overflow-hidden"><img src={o} alt={n} className="w-full h-full object-cover" /><div className={`absolute top-3 right-3 px-3.5 py-2 ${b.bg} ${b.text} ${b.shadow} rounded-full text-xs font-medium`}>{f}{" match"}</div></div></Link><div className="p-4 space-y-3"><div><Link to={`/vessel/${i}`} className="font-semibold text-foreground hover:text-primary transition-colors">{n}</Link><p className="text-sm text-muted-foreground">{s}</p></div><div className="text-xs text-muted-foreground space-y-1"><div>{c}</div><div>{u}</div><div>{"Contributed by "}{h}</div></div><div className="pt-2 border-t border-border"><div className="flex flex-wrap gap-1 items-center"><span className="text-xs text-muted-foreground">Matched:</span>{p.map((x, y) => <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-md border border-primary/10" key={y}>{x.term}<span className="text-muted-foreground">({x.field})</span></span>)}</div></div><div className="flex gap-2 pt-2"><Link to={`/browse?compare=${i}`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><GitCompare className="w-3 h-3" />Compare</Link><Link to={`/search?similar=${i}`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><Search className="w-3 h-3" />Parallels</Link><button className="inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><FileText className="w-3 h-3" />Cite</button></div></div></div>;
}

export const MATCH_STRENGTH_STYLES = {
  High: {
    bg: "bg-[#8B3A2F]",
    text: "text-white",
    shadow: "shadow-md"
  },
  Moderate: {
    bg: "bg-[#D97706]",
    text: "text-white",
    shadow: "shadow-md"
  },
  Possible: {
    bg: "bg-[#78716C]",
    text: "text-white",
    shadow: "shadow-md"
  }
};

export function SearchResultCard({
  id: i,
  sampleCode: n,
  image: o,
  region: s,
  period: c,
  fabricTexture: u,
  matrixColor: h,
  temperType: f,
  contributor: p,
  confidence: b,
  matchReasons: x,
  associatedVessel: y,
  associatedFabric: _
}) {
  const N = MATCH_STRENGTH_STYLES[b];
  return <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"><Link to={`/petrographic/${i}`} className="block"><div className="aspect-square bg-muted relative overflow-hidden"><img src={o} alt={n} className="w-full h-full object-cover" /><div className={`absolute top-3 right-3 px-3.5 py-2 ${N.bg} ${N.text} ${N.shadow} rounded-full text-xs font-medium`}>{b}{" match"}</div><div className="absolute top-3 left-3 px-2.5 py-1.5 bg-black/70 text-white rounded-md text-xs font-medium inline-flex items-center gap-1"><Microscope className="w-3 h-3" />Petrographic Sample</div></div></Link><div className="p-4 space-y-3"><div><Link to={`/petrographic/${i}`} className="font-semibold text-foreground hover:text-primary transition-colors">{n}</Link><p className="text-sm text-muted-foreground">{u}{" fabric"}</p></div><div className="text-xs text-muted-foreground space-y-1"><div>{s}</div><div>{c}</div><div>{"Matrix: "}{h}</div><div>{"Temper: "}{f.join(", ")}</div></div><div className="pt-2 border-t border-border"><div className="flex flex-wrap gap-1 items-center"><span className="text-xs text-muted-foreground">Matched:</span>{x.map((P, S) => <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-md border border-primary/10" key={S}>{P.value}<span className="text-muted-foreground">({P.attribute})</span></span>)}</div></div>{(y || _) && <div className="pt-2 border-t border-border space-y-1"><div className="text-xs font-semibold text-muted-foreground">Linked to:</div>{y && <Link to={`/vessel/${y}`} className="text-xs text-primary hover:underline block">{"→ Vessel: "}{y}</Link>}{_ && <Link to={`/fabric/${_}`} className="text-xs text-primary hover:underline block">{"→ Fabric: "}{_}</Link>}</div>}<div className="flex gap-2 pt-2"><Link to={`/browse?compare=${i}`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><GitCompare className="w-3 h-3" />Compare</Link><Link to={`/search?similar=${i}&type=fabric`} className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><FlaskConical className="w-3 h-3" />Similar</Link><button className="inline-flex items-center justify-center gap-1 px-3 py-1.5 border border-border rounded-lg hover:bg-muted transition-colors text-xs"><FileText className="w-3 h-3" />Cite</button></div></div></div>;
}

/**
 * Refine Results.
 *
 * Same panel as before, with two differences: the options and their counts are
 * read from the results on screen instead of being fixed numbers, and ticking
 * one now narrows the list. Groups with nothing behind them are not shown.
 */
export function FilterSidebar({ groups, selected, onToggle, onClear }) {
  const [expanded, setExpanded] = useState(["Region", "Period"]);
  const toggleGroup = title => setExpanded(current => current.includes(title) ? current.filter(t => t !== title) : [...current, title]);
  const activeCount = Object.values(selected).flat().length;
  return <div className="bg-card border border-border rounded-lg p-4 sticky top-20"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-foreground">Refine Results</h3>{activeCount > 0 && <button onClick={onClear} className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"><X className="w-3 h-3" />Clear all</button>}</div>{activeCount > 0 && <div className="mb-4 pb-4 border-b border-border"><div className="flex flex-wrap gap-2">{Object.entries(selected).map(([title, values]) => values.map(value => <button onClick={() => onToggle(title, value)} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-md border border-primary/20 hover:bg-primary/20 transition-colors" key={`${title}-${value}`}>{value}<X className="w-3 h-3" /></button>))}</div></div>}<div className="space-y-4">{groups.map(group => {
        const open = expanded.includes(group.title),
          chosen = selected[group.title]?.length || 0;
        return <div className="border-b border-border pb-4 last:border-b-0" key={group.title}><button onClick={() => toggleGroup(group.title)} className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-primary transition-colors"><span className="flex items-center gap-2">{group.title}{chosen > 0 && <span className="px-1.5 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">{chosen}</span>}</span>{open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>{open && <div className="mt-3 space-y-2">{group.options.map(option => {
              const ticked = selected[group.title]?.includes(option.label) || false;
              return <label className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors cursor-pointer" key={option.label}><input type="checkbox" checked={ticked} onChange={() => onToggle(group.title, option.label)} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" /><span className="flex-1">{option.label}</span><span className="text-xs text-muted-foreground">({option.count})</span></label>;
            })}</div>}</div>;
      })}</div></div>;
}

/** Kept as the page's public search entry point; the model does the work now. */
export const glossaryLookup = searchParallels;

/**
 * The search box the page was missing.
 *
 * "Find Regional Parallels" lands here, and until now the only way to type
 * anything was the bar in the top nav — so the first thing you saw after
 * choosing the task was a page you could not use. Same field as the nav, so
 * nothing new to learn.
 */
export function SearchField({ initialQuery }) {
  const navigate = useNavigate(),
    [query, setQuery] = useState(initialQuery ?? "");
  const submit = event => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };
  return <form onSubmit={submit} className="mt-4 max-w-2xl"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search by region, period, site, fabric or description..." className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-ring" /></div></form>;
}

/** Results plus their filters. Keyed by query, so filters reset with a new search. */
export function SearchResults({ results }) {
  const [selected, setSelected] = useState({});
  const toggle = (title, value) => setSelected(current => {
    const values = current[title] || [],
      next = values.includes(value) ? values.filter(v => v !== value) : [...values, value],
      updated = { ...current, [title]: next };
    if (next.length === 0) delete updated[title];
    return updated;
  });
  const groups = facetsFor(results),
    visible = applyFacets(results, selected),
    filtered = visible.length !== results.length,
    petrographic = visible.filter(r => r.type === "petrographic"),
    vessels = visible.filter(r => r.type === "vessel");
  return <div className="flex gap-8"><aside className="w-64 shrink-0"><FilterSidebar groups={groups} selected={selected} onToggle={toggle} onClear={() => setSelected({})} /></aside><div className="flex-1"><div className="mb-6"><p className="text-sm text-muted-foreground">{filtered ? <>{"Showing "}{visible.length}{" of "}{results.length}{" results. Untick a filter to widen the search."}</> : <>Showing results ranked by relevance. Use filters to narrow your search or try different terms.</>}</p></div>{visible.length === 0 ? <div className="bg-card border border-border rounded-lg p-8 text-center"><h2 className="font-serif text-foreground text-xl mb-3">No results match these filters</h2><p className="text-muted-foreground mb-6">{results.length}{results.length === 1 ? " result matches" : " results match"}{" your search. Remove a filter to see "}{results.length === 1 ? "it" : "them"}{"."}</p><button onClick={() => setSelected({})} className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"><X className="w-5 h-5" />Clear all filters</button></div> : <div className="space-y-8">{petrographic.length > 0 && <div><div className="flex items-center gap-2 mb-4"><Microscope className="w-5 h-5 text-primary" /><h2 className="font-serif text-foreground text-lg">Petrographic Samples ({petrographic.length})</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{petrographic.map(result => <SearchResultCard {...result} key={result.id} />)}</div></div>}{vessels.length > 0 && <div><div className="flex items-center gap-2 mb-4"><Package className="w-5 h-5 text-primary" /><h2 className="font-serif text-foreground text-lg">Vessels ({vessels.length})</h2></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{vessels.map(result => <ArtifactResultCard {...result} key={result.id} />)}</div></div>}</div>}</div></div>;
}

/** Chip rows in the empty state, built from regions and periods that hold records. */
export function QuickStarts() {
  const { regions, periods } = quickStarts();
  const row = (label, values, icon) => values.length > 0 && <div><div className="text-xs text-muted-foreground mb-2 font-medium">{label}</div><div className="flex flex-wrap gap-2">{values.map(value => <Link to={`/search?q=${encodeURIComponent(value)}`} className="px-4 py-2 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors text-sm inline-flex items-center gap-1" key={value}>{icon}{value}</Link>)}</div></div>;
  return <>{row("Regions with records:", regions, <MapPin className="w-3 h-3" />)}{row("Periods with records:", periods, <Clock className="w-3 h-3" />)}</>;
}

export function SearchPage() {
  const [params] = useSearchParams(),
    query = params.get("q") || "",
    similarTo = params.get("similar") || "";
  // A "Parallels" button on a card sends ?similar=<id> and no query. That used
  // to land on the empty state; it now runs the comparison the button promises
  // and shows the query it used, so the search can be edited from there.
  const target = !query && similarTo ? findRecord(similarTo) : null,
    results = target ? parallelsFor(similarTo) : searchParallels(query),
    shown = target ? parallelQueryFor(target) : query,
    hasResults = results.length > 0,
    targetName = target ? target.name || target.sampleCode : "";
  return <div className="min-h-screen bg-background"><div className="border-b border-border bg-card"><div className="max-w-7xl mx-auto px-6 py-6"><h1 className="font-serif text-foreground mb-2">Search Results</h1><p className="text-muted-foreground">{target ? <>{results.length}{results.length === 1 ? " record comparable to " : " records comparable to "}{targetName}</> : hasResults ? <>{results.length}{" possible "}{results.length === 1 ? "match" : "matches"}{" for \""}{query}"</> : query ? <>No matches found for "{query}"</> : <>Enter a search query to find ceramics</>}</p><SearchField initialQuery={shown} key={shown} /></div></div><div className="max-w-7xl mx-auto px-6 py-8">{hasResults ? <SearchResults results={results} key={shown} /> : query || target ? <div className="max-w-2xl mx-auto text-center py-16"><div className="bg-card border border-border rounded-lg p-8"><h2 className="font-serif text-foreground text-xl mb-4">No strong matches for "{shown}"</h2><p className="text-muted-foreground mb-6">Try using fewer terms, adjusting your description, or exploring related ceramics.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link to="/chat" className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"><MessageCircle className="w-5 h-5" />Ask the AI Assistant</Link><Link to={`/submit/vessel?description=${encodeURIComponent(shown)}`} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"><Plus className="w-5 h-5" />Add This to Database</Link></div><p className="text-xs text-muted-foreground mt-4">You can add vessels, sherds, or petrographic samples — even with incomplete data</p><div className="mt-8 pt-6 border-t border-border"><h3 className="text-sm font-semibold text-foreground mb-3">Try these search tips:</h3><ul className="text-sm text-muted-foreground space-y-2 text-left max-w-2xl mx-auto"><li>• Search where you work: a region, a site, or a period — "Zacatecas", "La Quemada", "Epiclassic"</li><li>• Use descriptive terms: "serving vessel" instead of formal type names</li><li>• Combine place and period: "Bronze Age Italy", "Pueblo II Arizona"</li><li>• Every result says which field it matched, so you can see why it came back</li><li>• For fabric/petrographic: "coarse fabric with quartz temper", "vesicular fabric", "reddish brown matrix"</li><li>• Open any result and use Parallels to find comparable records</li></ul></div></div></div> : <div className="max-w-2xl mx-auto text-center py-16"><h2 className="font-serif text-foreground text-2xl mb-4">Search for Ceramics by Description</h2><p className="text-muted-foreground mb-6">Use plain language to find ceramics — no formal terminology required</p><div className="bg-card border border-border rounded-lg p-6 mb-8"><h3 className="text-sm font-semibold text-foreground mb-4">Example searches:</h3><div className="space-y-4"><QuickStarts /><div><div className="text-xs text-muted-foreground mb-2 font-medium">Vessel descriptions:</div><div className="flex flex-wrap gap-2">{["serving vessel", "storage vessel", "La Quemada bowl", "Epiclassic Mesoamerican"].map(example => <Link to={`/search?q=${encodeURIComponent(example)}`} className="px-4 py-2 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors text-sm" key={example}>{example}</Link>)}</div></div><div><div className="text-xs text-muted-foreground mb-2 font-medium">Fabric & petrographic queries:</div><div className="flex flex-wrap gap-2">{["coarse fabric with quartz temper", "reddish brown matrix", "vesicular fabric", "Bronze Age coarse ware Italy"].map(example => <Link to={`/search?q=${encodeURIComponent(example)}`} className="px-4 py-2 border border-border rounded-lg hover:bg-muted hover:border-primary transition-colors text-sm inline-flex items-center gap-1" key={example}><Microscope className="w-3 h-3" />{example}</Link>)}</div></div></div></div><p className="text-sm text-muted-foreground">Search works across surface attributes (color, decoration), vessel form, fabric characteristics (temper, texture, matrix), and AI-generated descriptions of images</p></div>}</div></div>;
}

export default SearchPage;
