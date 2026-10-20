import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { BookOpen, Building2, Download, FileText, Flame, FlaskConical, Layers, MapPin, Microscope, Package, Plus, Upload, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from '../router.jsx';
import { jsx } from 'react/jsx-runtime';
import { cn } from '../lib/utils.js';

export function GlyphIcon({
  className: i,
  ...n
}) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={i} {...n}><line x1="10" y1="4" x2="14" y2="4" /><path d="M10 4 L10 6" /><path d="M14 4 L14 6" /><path d="M10 6 Q6 8 6 12 Q6 16 8 18" /><path d="M14 6 Q18 8 18 12 Q18 16 16 18" /><line x1="8" y1="18" x2="10" y2="19" /><line x1="16" y1="18" x2="14" y2="19" /><line x1="10" y1="19" x2="14" y2="19" /></svg>;
}

export const badgeVariants = cva("inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden", {
  variants: {
    variant: {
      default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
      secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
      destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export function Badge({
  className: i,
  variant: n,
  asChild: o = !1,
  ...s
}) {
  return jsx(o ? Slot : "span", {
    "data-slot": "badge",
    className: cn(badgeVariants({
      variant: n
    }), i),
    ...s
  });
}

export function SubmitOptionCard({
  title: i,
  description: n,
  count: o,
  icon: S,
  href: c,
  isBulkUpload: u = !1
}) {
  return <Link to={c} className={`group relative block bg-card rounded-lg p-6 border transition-all hover:shadow-lg hover:-translate-y-1 ${u ? "border-primary/40 ring-2 ring-primary/20" : "border-border hover:border-primary"}`}><div className="flex items-start justify-between mb-4"><div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary"><S className="w-8 h-8" /></div><Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" /></div><h3 className="font-sans text-foreground mb-2 font-semibold">{i}</h3><p className="text-sm text-muted-foreground mb-4 leading-relaxed">{n}</p><Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">{o}{" "}{o === 1 ? "entry" : "entries"}</Badge></Link>;
}

export function SectionNav({
  sections: i
}) {
  const [n, o] = useState("");
  useEffect(() => {
    const c = () => {
      const u = window.scrollY + 120;
      for (const h of i) {
        const f = document.getElementById(h.id);
        if (f) {
          const {
            offsetTop: p,
            offsetHeight: b
          } = f;
          if (u >= p && u < p + b) {
            o(h.id);
            break;
          }
        }
      }
    };
    return window.addEventListener("scroll", c), c(), () => window.removeEventListener("scroll", c);
  }, [i]);
  const s = c => {
    const u = document.getElementById(c);
    if (u) {
      const f = u.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: f - 100,
        behavior: "smooth"
      });
    }
  };
  return <div className="sticky top-24 space-y-1"><h4 className="text-xs uppercase tracking-wider text-primary mb-4 font-semibold">Jump to Section</h4>{i.map(c => <button onClick={() => s(c.id)} className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${n === c.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`} key={c.id}>{c.label}</button>)}</div>;
}

export const SUBMIT_SECTIONS = [{
  id: "core-entries",
  label: "Core Entries"
}, {
  id: "context-entries",
  label: "Context Entries"
}, {
  id: "supporting-entries",
  label: "Supporting Entries"
}, {
  id: "bulk-upload",
  label: "Bulk Upload"
}];

export const CORE_ENTRY_OPTIONS = [{
  title: "Submit a Ware or Ware Family",
  description: "Add a ceramic ware classification or ware family grouping",
  count: 108,
  icon: Package,
  href: "/submit/ware"
}, {
  title: "Submit a Ceramic Type",
  description: "Document a specific ceramic type with diagnostic characteristics",
  count: 451,
  icon: Layers,
  href: "/submit/type"
}, {
  title: "Submit a Vessel",
  description: "Record an individual ceramic vessel with measurements and context",
  count: 858,
  icon: GlyphIcon,
  href: "/submit/vessel"
}, {
  title: "Submit Petro-fabric Data",
  description: "Contribute petrographic fabric analysis and composition data",
  count: 4,
  icon: Microscope,
  href: "/submit/petro-fabric"
}];

export const CONTEXT_ENTRY_OPTIONS = [{
  title: "Submit a Site",
  description: "Add an archaeological site location with temporal and cultural context",
  count: 6,
  icon: MapPin,
  href: "/submit/site"
}, {
  title: "Submit a Kiln",
  description: "Document a ceramic production kiln with structure and firing data",
  count: 0,
  icon: Flame,
  href: "/submit/kiln"
}, {
  title: "Submit a Workshop",
  description: "Record a ceramic production workshop or manufacturing center",
  count: 0,
  icon: Building2,
  href: "/submit/workshop"
}];

export const SUPPORTING_ENTRY_OPTIONS = [{
  title: "Submit Bibliography",
  description: "Add a published source or reference to the research library",
  count: 447,
  icon: BookOpen,
  href: "/submit/bibliography"
}, {
  title: "Submit Contributor Profile",
  description: "Register as a contributor or add researcher information",
  count: 31,
  icon: Users,
  href: "/submit/contributor"
}, {
  title: "Submit Petrographic Sample",
  description: "Document thin section samples and laboratory analysis results",
  count: 9,
  icon: FlaskConical,
  href: "/submit/sample"
}];

export function SubmitPage() {
  return <div className="min-h-screen bg-background"><div className="border-b border-border bg-card"><div className="max-w-7xl mx-auto px-6 py-12"><h1 className="font-serif text-foreground mb-4">Add Information to the PACP</h1><p className="text-muted-foreground max-w-3xl">Contribute to the Pan-American Ceramics Project by submitting archaeological data, petrographic analysis, site documentation, and bibliographic resources. All submissions are reviewed by our editorial team before publication.</p></div></div><div className="max-w-7xl mx-auto px-6 py-12"><div className="flex gap-12"><aside className="hidden lg:block w-56 shrink-0"><SectionNav sections={SUBMIT_SECTIONS} /></aside><div className="flex-1 space-y-12"><section id="core-entries"><h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Core Entries</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{CORE_ENTRY_OPTIONS.map(i => <SubmitOptionCard {...i} key={i.href} />)}</div></section><section id="context-entries"><h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Context Entries</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{CONTEXT_ENTRY_OPTIONS.map(i => <SubmitOptionCard {...i} key={i.href} />)}</div></section><section id="supporting-entries"><h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Supporting Entries</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">{SUPPORTING_ENTRY_OPTIONS.map(i => <SubmitOptionCard {...i} key={i.href} />)}</div></section><section id="bulk-upload" className="pt-6"><h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Bulk Upload</h2><div className="bg-card rounded-lg p-8 border-2 border-primary/40 ring-2 ring-primary/10"><div className="flex items-start gap-6"><div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Upload className="w-8 h-8 text-primary" /></div><div className="flex-1"><h3 className="font-sans text-foreground font-semibold mb-2">Bulk Vessel Upload</h3><p className="text-muted-foreground mb-6">Submitting many vessels at once? Use the bulk upload template to efficiently import multiple entries with standardized fields and validation.</p><div className="flex flex-wrap gap-3"><button className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Upload className="w-4 h-4" />Upload Spreadsheet</button><button className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"><Download className="w-4 h-4" />Download Template</button></div></div></div></div><div className="bg-card rounded-lg p-8 border-2 border-primary/40 ring-2 ring-primary/10 mt-6"><div className="flex items-start gap-6"><div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><FileText className="w-8 h-8 text-primary" /></div><div className="flex-1"><h3 className="font-sans text-foreground font-semibold mb-2">Upload a Report (PDF)</h3><p className="text-muted-foreground mb-6">Have a CRM report, thesis or monograph? AI reads the PDF — including its tables — and proposes wares, types, sites, petrographic samples, counts and references, each tied to its page. You review every record, and nothing is added until you accept it.</p><div className="flex flex-wrap gap-3"><Link to="/submit/report" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"><Upload className="w-4 h-4" />Upload a Report</Link><Link to="/submit/report?example=1" className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-primary/30 text-primary rounded-lg hover:bg-primary/5 transition-colors font-medium"><BookOpen className="w-4 h-4" />Try the Example Report</Link></div></div></div></div></section></div></div></div></div>;
}

export default SubmitPage;
