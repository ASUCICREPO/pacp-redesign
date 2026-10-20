import { Archive, ArrowRight, BookOpen, CircleHelp, ClipboardList, Database, Eye, FileCheck, FileText, Flag, FlaskConical, GitCompare, Layers, LayoutGrid, ScanSearch, Sparkles, Upload, Zap } from 'lucide-react';
import { Link } from '../router.jsx';
import { useDrafts } from '@/lib/extraction/drafts';
import { useRole } from '../context/RoleContext.jsx';

export const homeScreenshot = "/assets/Screenshot_2026-05-20_at_1.29.35_AM.6ef9689b.png";

export const DATABASE_COUNTS = {
  wares: 108,
  types: 451,
  vessels: 858,
  petrofabrics: 4,
  thinSections: 9,
  kilns: 0,
  sites: 6,
  bibliography: 447,
  contributors: 29
};

export const CARD_COMPARE = {
  label: "Compare Assemblages",
  sublabel: "Place vessels and petro-fabrics side by side",
  href: "/compare",
  icon: GitCompare
};

export const CARD_REFERENCES = {
  label: "Browse References",
  sublabel: "Find comparable studies for your research",
  href: "/resources",
  icon: BookOpen
};

export const CARD_SUBMIT = {
  label: "Submit Data",
  sublabel: "Add records one at a time or upload in bulk — even incomplete ones",
  href: "/submit",
  icon: Upload
};

export const CARD_PARALLELS = {
  label: "Find Regional Parallels",
  sublabel: "Locate dated parallels for your region",
  href: "/search",
  icon: Database
};

/**
 * The work table — where accepted extractions wait.
 *
 * Accepting a record on the upload screen creates a Draft, and until now
 * nothing on the home page said where those drafts went. The count is live:
 * it is the same store the review screen writes to.
 */
export const draftsCard = (count) => ({
  label: `${count} ${count === 1 ? "draft" : "drafts"} awaiting review`,
  sublabel: "Records you accepted from a PDF — review, edit and promote them",
  href: "/browse?status=draft&owner=me",
  icon: FileCheck
});

export const CARD_TYPE_LIBRARY = {
  label: "Browse the Type Library",
  sublabel: "Explore ceramic types and wares",
  href: "/browse",
  icon: LayoutGrid
};

export const WORKFLOW_HOME_CONTENT = {
  "guided-id": {
    heroLine: "Identify with transparency.",
    heroSub: "Narrow possibilities with reasoning you can defend.",
    primaryCard: {
      heading: "Start a Guided Identification",
      subtext: "Walk through structured questions to narrow possibilities and document your reasoning.",
      icon: Sparkles,
      cta: "Begin identification",
      href: "/identify"
    },
    secondaryCards: [CARD_COMPARE, CARD_REFERENCES, CARD_SUBMIT],
    suggested: [{
      title: "Recent identifications by grad students",
      description: "See how other researchers documented their reasoning process.",
      linkLabel: "View reasoning histories",
      href: "/browse",
      icon: Eye
    }, {
      title: "Common identification challenges",
      description: "Frequently encountered ambiguities and how the community resolves them.",
      linkLabel: "Browse challenges",
      href: "/resources",
      icon: CircleHelp
    }, {
      title: "Try identifying this",
      description: "A featured unknown sherd — practice your identification workflow.",
      linkLabel: "Start practice ID",
      href: "/identify",
      icon: FlaskConical
    }],
    statsOrder: ["Vessels", "Types", "Wares", "Bibliography", "Petro-Fabrics", "Thin Sections", "Sites", "Contributors"]
  },
  literature: {
    heroLine: "Explore comparable studies.",
    heroSub: "Find references that ground your interpretation.",
    primaryCard: {
      heading: "Search the Literature",
      subtext: "Find comparable studies and references across the PACP bibliography.",
      icon: BookOpen,
      cta: "Search literature",
      href: "/resources"
    },
    secondaryCards: [CARD_REFERENCES, CARD_COMPARE, CARD_SUBMIT],
    suggested: [{
      title: "Recently added references",
      description: "447 bibliographic entries and growing — filter by region or period.",
      linkLabel: "Browse bibliography",
      href: "/resources",
      icon: BookOpen
    }, {
      title: "References linked to ceramic types",
      description: "Find which studies cite the types most relevant to your assemblage.",
      linkLabel: "Explore linked refs",
      href: "/browse",
      icon: Database
    }, {
      title: "Submit a missing reference",
      description: "Add a publication to the PACP bibliography for others to cite.",
      linkLabel: "Add reference",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Bibliography", "Types", "Wares", "Vessels", "Sites", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  dataset: {
    heroLine: "Build your dataset.",
    heroSub: "Curate records for thesis or publication.",
    primaryCard: {
      heading: "Curate Your Dataset",
      subtext: "Assemble and export records for thesis or publication.",
      icon: Database,
      cta: "Build dataset",
      href: "/browse"
    },
    secondaryCards: [CARD_COMPARE, CARD_REFERENCES, CARD_SUBMIT],
    suggested: [{
      title: "Browse vessels by region",
      description: "Filter the full vessel database by site, period, or fabric type.",
      linkLabel: "Browse vessels",
      href: "/browse",
      icon: LayoutGrid
    }, {
      title: "Save records to a collection",
      description: "Pin vessels, wares, and types into a working reference set.",
      linkLabel: "Start a collection",
      href: "/browse",
      icon: Archive
    }, {
      title: "Submit your own records",
      description: "Add vessels from your fieldwork to contribute to the dataset.",
      linkLabel: "Submit data",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Vessels", "Types", "Wares", "Petro-Fabrics", "Bibliography", "Thin Sections", "Sites", "Contributors"]
  },
  debate: {
    heroLine: "See how others reasoned.",
    heroSub: "Compare interpretations and reasoning histories.",
    primaryCard: {
      heading: "Explore Reasoning Histories",
      subtext: "Compare interpretations and see how researchers arrived at their conclusions.",
      icon: GitCompare,
      cta: "Explore reasoning",
      href: "/browse"
    },
    secondaryCards: [CARD_COMPARE, CARD_REFERENCES, CARD_SUBMIT],
    suggested: [{
      title: "Competing interpretations",
      description: "Records where multiple researchers submitted different identifications.",
      linkLabel: "View debates",
      href: "/browse",
      icon: GitCompare
    }, {
      title: "Expert reasoning chains",
      description: "How experienced analysts document their identification logic.",
      linkLabel: "Read examples",
      href: "/resources",
      icon: BookOpen
    }, {
      title: "Add your interpretation",
      description: "Submit an alternative view on any existing vessel record.",
      linkLabel: "Start contributing",
      href: "/submit",
      icon: Eye
    }],
    statsOrder: ["Vessels", "Types", "Wares", "Bibliography", "Contributors", "Petro-Fabrics", "Thin Sections", "Sites"]
  },
  "rapid-id": {
    heroLine: "Identify fast.",
    heroSub: "Fast field IDs with defensible results.",
    primaryCard: {
      heading: "Start Rapid Identification",
      subtext: "Run a quick, AI-assisted identification for field or lab use.",
      icon: Zap,
      cta: "Begin identification",
      href: "/chat"
    },
    secondaryCards: [CARD_PARALLELS, CARD_SUBMIT, CARD_REFERENCES],
    suggested: [{
      title: "Regional parallel finder",
      description: "Match your sherd to dated parallels from your project region.",
      linkLabel: "Find parallels",
      href: "/search",
      icon: Database
    }, {
      title: "Recent CRM submissions",
      description: "See how other CRM teams are documenting their ceramics.",
      linkLabel: "Browse recent",
      href: "/browse",
      icon: Eye
    }, {
      title: "Bulk upload",
      description: "Submit multiple records at once from a project phase.",
      linkLabel: "Bulk submit",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Vessels", "Types", "Sites", "Wares", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  reports: {
    heroLine: "Prepare your report.",
    heroSub: "Compile compliance-ready outputs efficiently.",
    primaryCard: {
      heading: "Compile Report Data",
      subtext: "Gather vessel records, types, and references into a compliance-ready output.",
      icon: FileText,
      cta: "Start compiling",
      href: "/browse"
    },
    secondaryCards: [CARD_PARALLELS, CARD_SUBMIT, CARD_REFERENCES],
    suggested: [{
      title: "Reference existing site records",
      description: "Pull vessel data from previously documented sites in your region.",
      linkLabel: "Search sites",
      href: "/search",
      icon: Database
    }, {
      title: "Export citations",
      description: "Format bibliography references for your compliance report.",
      linkLabel: "Browse bibliography",
      href: "/resources",
      icon: BookOpen
    }, {
      title: "Submit project ceramics",
      description: "Add your records now — incomplete submissions are fine.",
      linkLabel: "Submit",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Vessels", "Sites", "Types", "Wares", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  legacy: {
    heroLine: "Recover legacy data.",
    heroSub: "Bring older records into PACP standards.",
    primaryCard: {
      heading: "Import Legacy Records",
      subtext: "Migrate older records into current PACP format with guided data entry.",
      icon: Archive,
      cta: "Start import",
      href: "/submit"
    },
    secondaryCards: [CARD_PARALLELS, CARD_SUBMIT, CARD_REFERENCES],
    suggested: [{
      title: "Match legacy types to PACP",
      description: "Cross-reference older type names against the current controlled vocabulary.",
      linkLabel: "Browse types",
      href: "/browse",
      icon: GitCompare
    }, {
      title: "Bulk submission guide",
      description: "How to structure older records for efficient upload.",
      linkLabel: "Read guide",
      href: "/resources",
      icon: BookOpen
    }, {
      title: "Submit a partial record",
      description: "Incomplete records are accepted — collaborators can fill gaps later.",
      linkLabel: "Submit now",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Vessels", "Types", "Sites", "Wares", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  "needs-review": {
    heroLine: "Flag uncertain finds.",
    heroSub: "Submit records for expert review.",
    primaryCard: {
      heading: "Submit for Expert Review",
      subtext: "Upload uncertain finds for assessment and peer verification.",
      icon: Flag,
      cta: "Submit for review",
      href: "/submit"
    },
    secondaryCards: [CARD_PARALLELS, CARD_SUBMIT, CARD_REFERENCES],
    suggested: [{
      title: "Records needing review",
      description: "Browse open review requests from other CRM teams.",
      linkLabel: "View queue",
      href: "/browse",
      icon: Eye
    }, {
      title: "Common uncertain cases",
      description: "How the community handles ambiguous identifications.",
      linkLabel: "Read cases",
      href: "/resources",
      icon: CircleHelp
    }, {
      title: "Chat with the assistant",
      description: "Describe your sherd — get a first-pass suggestion before submitting.",
      linkLabel: "Ask PACP AI",
      href: "/chat",
      icon: Sparkles
    }],
    statsOrder: ["Vessels", "Types", "Sites", "Wares", "Bibliography", "Contributors", "Thin Sections", "Petro-Fabrics"]
  },
  "intro-id": {
    heroLine: "Learn to identify.",
    heroSub: "Visual, guided workflows for new learners.",
    primaryCard: {
      heading: "Start a Guided Identification",
      subtext: "Follow a visual step-by-step workflow built for first-time identifiers.",
      icon: ScanSearch,
      cta: "Start learning",
      href: "/identify"
    },
    secondaryCards: [CARD_TYPE_LIBRARY, CARD_COMPARE, CARD_SUBMIT],
    suggested: [{
      title: "Identification basics",
      description: "What to look for when describing a ceramic sherd for the first time.",
      linkLabel: "Read basics",
      href: "/resources",
      icon: BookOpen
    }, {
      title: "Try a practice identification",
      description: "Work through a well-documented example with the guided assistant.",
      linkLabel: "Start practice",
      href: "/chat",
      icon: FlaskConical
    }, {
      title: "Browse vessel types",
      description: "Get familiar with the controlled vocabulary before identifying.",
      linkLabel: "Explore types",
      href: "/browse",
      icon: LayoutGrid
    }],
    statsOrder: ["Vessels", "Types", "Wares", "Sites", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  comparison: {
    heroLine: "Compare to learn.",
    heroSub: "Place examples side by side to build intuition.",
    primaryCard: {
      heading: "Compare Ceramic Examples",
      subtext: "Put ceramic examples side by side and build your recognition vocabulary.",
      icon: Layers,
      cta: "Start comparing",
      href: "/browse"
    },
    secondaryCards: [CARD_TYPE_LIBRARY, CARD_COMPARE, CARD_SUBMIT],
    suggested: [{
      title: "Side-by-side vessel pairs",
      description: "Curated pairs of similar-but-distinct types to sharpen your eye.",
      linkLabel: "Browse pairs",
      href: "/browse",
      icon: GitCompare
    }, {
      title: "Regional comparison sets",
      description: "How the same vessel form varies across regions and periods.",
      linkLabel: "Explore sets",
      href: "/browse",
      icon: Database
    }, {
      title: "Identification exercises",
      description: "Practice distinguishing vessel forms with guided feedback.",
      linkLabel: "Try exercises",
      href: "/chat",
      icon: FlaskConical
    }],
    statsOrder: ["Types", "Vessels", "Wares", "Sites", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  assignments: {
    heroLine: "Complete your assignment.",
    heroSub: "Tackle coursework tied to PACP records.",
    primaryCard: {
      heading: "View Your Assignments",
      subtext: "Access coursework linked to real PACP ceramic records.",
      icon: ClipboardList,
      cta: "View assignments",
      href: "/browse"
    },
    secondaryCards: [CARD_TYPE_LIBRARY, CARD_COMPARE, CARD_SUBMIT],
    suggested: [{
      title: "Assignment: Identify a sherd",
      description: "Use the guided assistant to complete a structured identification exercise.",
      linkLabel: "Begin",
      href: "/chat",
      icon: Sparkles
    }, {
      title: "Assignment: Compare two types",
      description: "Select two vessel types and describe their similarities and differences.",
      linkLabel: "Start comparison",
      href: "/browse",
      icon: GitCompare
    }, {
      title: "Submit your work",
      description: "Add your completed records to PACP for instructor review.",
      linkLabel: "Submit",
      href: "/submit",
      icon: Upload
    }],
    statsOrder: ["Types", "Vessels", "Wares", "Sites", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  },
  browse: {
    heroLine: "Explore the collection.",
    heroSub: "Navigate approachable starter collections.",
    primaryCard: {
      heading: "Browse Curated Examples",
      subtext: "Explore a hand-selected collection of well-documented ceramics.",
      icon: LayoutGrid,
      cta: "Start browsing",
      href: "/browse"
    },
    secondaryCards: [CARD_TYPE_LIBRARY, CARD_COMPARE, CARD_SUBMIT],
    suggested: [{
      title: "Starter collections",
      description: "Approachable sets of well-documented ceramics chosen for new learners.",
      linkLabel: "Browse collections",
      href: "/browse",
      icon: LayoutGrid
    }, {
      title: "Most-viewed vessel records",
      description: "The records other students and researchers visit most often.",
      linkLabel: "View popular",
      href: "/browse",
      icon: Eye
    }, {
      title: "Learn the vocabulary",
      description: "A plain-language guide to ceramic terminology used across PACP.",
      linkLabel: "Read glossary",
      href: "/resources",
      icon: BookOpen
    }],
    statsOrder: ["Types", "Vessels", "Wares", "Sites", "Bibliography", "Petro-Fabrics", "Thin Sections", "Contributors"]
  }
};

export const ROLE_TITLES = {
  crm: "CRM Archaeologist",
  grad_student: "Graduate Student",
  undergrad_student: "Undergraduate Student"
};

export const WORKFLOW_LABELS = {
  "guided-id": "Guided identification",
  literature: "Literature exploration",
  dataset: "Research dataset building",
  debate: "Learning through debate",
  "rapid-id": "Rapid identification",
  reports: "Report preparation",
  legacy: "Legacy data recovery",
  "needs-review": "Needs-review submissions",
  "intro-id": "Introductory identification",
  comparison: "Learning-by-comparison",
  assignments: "Training assignments",
  browse: "Browse curated examples"
};

export const DEFAULT_HOME_CONTENT = {
  heroLine: "Document and discover ceramics.",
  heroSub: "An open platform for ceramic research across the Americas.",
  primaryCard: {
    heading: "Start Contributing",
    subtext: "Submit vessel records, compare assemblages, and explore the growing PACP database.",
    icon: Database,
    cta: "Browse all workflows",
    href: "/browse"
  },
  secondaryCards: [CARD_COMPARE, CARD_REFERENCES, CARD_SUBMIT],
  statsOrder: ["Vessels", "Types", "Wares", "Bibliography", "Petro-Fabrics", "Thin Sections", "Sites", "Contributors"]
};

export const HOME_STAT_TILES = {
  Wares: DATABASE_COUNTS.wares,
  Types: DATABASE_COUNTS.types,
  Vessels: DATABASE_COUNTS.vessels,
  "Petro-Fabrics": DATABASE_COUNTS.petrofabrics,
  "Thin Sections": DATABASE_COUNTS.thinSections,
  Sites: DATABASE_COUNTS.sites,
  Bibliography: DATABASE_COUNTS.bibliography,
  "Kilns/Workshops": DATABASE_COUNTS.kilns,
  Contributors: DATABASE_COUNTS.contributors
};

export function HomePage() {
  const {
      role: i,
      selectedTasks: n
    } = useRole(),
    o = n[0] ?? null,
    s = o && WORKFLOW_HOME_CONTENT[o] ? WORKFLOW_HOME_CONTENT[o] : DEFAULT_HOME_CONTENT,
    c = n.slice(1).filter(f => WORKFLOW_LABELS[f]),
    u = !!o,
    H = s.primaryCard.icon,
    drafts = useDrafts(),
    // CRM archaeologists and graduate students are the roles that run report
    // extraction, so they are the ones with a work table to clear.
    showDrafts = drafts.length > 0 && (i === "crm" || i === "grad_student"),
    cards = showDrafts ? [draftsCard(drafts.length), ...s.secondaryCards] : s.secondaryCards;
  return <div className="min-h-screen bg-background"><div className="relative h-[260px] bg-cover bg-center" style={{
      backgroundImage: "url('https://images.unsplash.com/photo-1772487488987-425a4a0c1499?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kcyUyMHNoYXBpbmclMjBwb3R0ZXJ5JTIwY2xheSUyMGNlcmFtaWNzJTIwd2hlZWx8ZW58MXx8fHwxNzc5MjY1MjU3fDA&ixlib=rb-4.1.0&q=80&w=1080')"
    }}><div className="absolute inset-0 bg-gradient-to-b from-transparent via-charcoal/20 to-charcoal/65" /><div className="relative h-full flex items-end justify-center pb-10"><h1 className="font-serif text-white text-4xl drop-shadow-lg text-center">Pan-American Ceramics Project</h1></div></div><div className="max-w-4xl mx-auto px-6 pt-10 pb-6 text-center">{!u && <div className="mb-5 flex items-center justify-center"><div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm text-primary"><span>Personalize your home — tell us what you're here to do</span><Link to="/onboarding" className="font-semibold hover:underline underline-offset-2">Get started →</Link></div></div>}{u && i && <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full mb-4 text-xs"><span>Set up for</span><span className="font-semibold">{ROLE_TITLES[i]}</span><span>focused on</span><span className="font-semibold">{WORKFLOW_LABELS[o]}</span><span className="mx-1 opacity-40">·</span><Link to="/onboarding" className="opacity-70 hover:opacity-100 hover:underline underline-offset-2">Change focus →</Link></div>}<h2 className="font-serif text-foreground text-2xl mb-2">{s.heroLine}</h2><p className="text-muted-foreground">{s.heroSub}</p></div><div className="max-w-5xl mx-auto px-6 pb-4"><Link to={s.primaryCard.href} className="flex items-center gap-6 px-8 py-7 rounded-xl bg-primary text-primary-foreground border-2 border-primary hover:bg-primary/90 transition-all group"><div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center shrink-0"><H className="w-7 h-7" /></div><div className="flex-1 min-w-0"><div className="font-serif text-xl font-semibold mb-1">{s.primaryCard.heading}</div><div className="text-sm text-primary-foreground/80 leading-snug">{s.primaryCard.subtext}</div></div><div className="flex items-center gap-2 text-sm font-semibold shrink-0 group-hover:gap-3 transition-all">{s.primaryCard.cta}{" "}<ArrowRight className="w-4 h-4" /></div></Link></div><div className="max-w-5xl mx-auto px-6 pb-8"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{cards.map(f => {
          const P = f.icon,
            b = f.label === "Submit Data";
          return <Link to={f.href} className={`flex flex-col gap-3 px-6 py-6 rounded-xl border-2 transition-all group ${b ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90" : "border-primary text-primary hover:bg-primary/5"}`} key={f.label}><P className="w-5 h-5" /><div><div className="font-semibold text-sm mb-0.5">{f.label}</div><div className={`text-xs leading-snug ${b ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{f.sublabel}</div></div><div className={`flex items-center gap-1 text-xs font-medium mt-auto group-hover:gap-2 transition-all ${b ? "text-primary-foreground/70" : "text-primary/60"}`}>{"Open "}<ArrowRight className="w-3 h-3" /></div></Link>;
        })}</div><div className="flex items-center justify-center mt-5 gap-1.5 text-sm text-muted-foreground"><LayoutGrid className="w-4 h-4" /><Link to="/browse" className="text-primary hover:underline font-medium">Browse all workflows</Link><span>— everything is always accessible</span></div></div>{c.length > 0 && <div className="max-w-5xl mx-auto px-6 pb-10"><div className="bg-card border border-border rounded-xl px-6 py-4 flex items-center gap-3 flex-wrap"><span className="text-sm text-muted-foreground shrink-0">You're also here to:</span>{c.map((f, p) => <span className="flex items-center gap-2" key={f}><Link to="/browse" className="text-sm font-medium text-primary hover:underline underline-offset-2">{WORKFLOW_LABELS[f]}</Link>{p < c.length - 1 && <span className="text-muted-foreground/40">·</span>}</span>)}</div></div>}<div className="max-w-6xl mx-auto px-6 pb-16"><div className="flex flex-wrap gap-3 justify-center items-center">{s.statsOrder.map(f => {
          const p = HOME_STAT_TILES[f];
          return p === void 0 ? null : <Link to="/browse" className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors" key={f}><span className="text-sm font-medium">{f}</span><span className="text-sm font-semibold">{p}</span></Link>;
        })}</div></div><div className="bg-secondary/20 py-16"><div className="max-w-6xl mx-auto px-6"><h2 className="font-serif text-foreground text-2xl mb-8 text-center font-bold">What is PACP?</h2><div className="grid md:grid-cols-2 gap-12 items-start"><div><p className="text-foreground leading-relaxed text-lg">The Pan-American Ceramics Project (PACP) is an open-access resource for information on the production and use of pottery across the Americas. PACP provides a collaborative platform for researchers, indigenous communities, cultural resource managers, and students to document ceramic traditions, share petrographic data, and contribute to a growing knowledge base that respects indigenous data sovereignty and diverse scholarly perspectives.</p></div><div className="bg-card rounded-lg p-6 border border-border"><img src="https://images.unsplash.com/photo-1664278983332-e8da853fba10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxhbmNpZW50JTIwcG90dGVyeSUyMGNlcmFtaWNzJTIwYXJ0aWZhY3RzJTIwYXJjaGFlb2xvZ3l8ZW58MXx8fHwxNzc5MjY1ODExfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="Collection of ceramic vessels" className="w-full h-auto rounded-lg" /><p className="text-sm text-muted-foreground mt-4 text-center">Geographic scope: North, Central, and South America</p></div></div></div></div><div className="bg-muted/30 py-12"><div className="max-w-4xl mx-auto px-6"><h2 className="font-serif text-foreground text-xl mb-6 text-center font-bold">Land Acknowledgement</h2><div className="bg-card rounded-lg p-6 border border-border"><p className="text-sm text-foreground leading-relaxed">We acknowledge that the ceramics documented in this project were created on the ancestral homelands of indigenous peoples throughout the Americas. We recognize the enduring relationship that indigenous communities maintain with these lands and cultural heritage. PACP is committed to supporting indigenous data sovereignty, respecting traditional knowledge, and centering indigenous voices in archaeological research and interpretation.</p></div></div></div><footer className="border-t border-border py-12 bg-card"><div className="max-w-6xl mx-auto px-6"><div className="grid md:grid-cols-3 gap-8 mb-8"><div><h3 className="font-semibold text-foreground mb-3">About</h3><ul className="space-y-2 text-sm"><li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About PACP</Link></li><li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">Editors</Link></li><li><Link to="/land-acknowledgement" className="text-muted-foreground hover:text-primary transition-colors">Land Acknowledgement</Link></li></ul></div><div><h3 className="font-semibold text-foreground mb-3">Resources</h3><ul className="space-y-2 text-sm"><li><Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">Research Resources</Link></li><li><Link to="/donate" className="text-muted-foreground hover:text-primary transition-colors">Donate</Link></li></ul></div><div><h3 className="font-semibold text-foreground mb-3">Funding</h3><img src={homeScreenshot} alt="PACP Development is made possible by: NSF SPRF Award # 2105424, Arizona State University, and the National Science Foundation" className="w-full max-w-md" /></div></div><div className="border-t border-border pt-6 text-center text-sm text-muted-foreground"><p>© 2026 Pan-American Ceramics Project. Open access for archaeological research.</p></div></div></footer></div>;
}

export default HomePage;
