# Pan-American Ceramics Project — front end

A scholarly workspace for ceramic archaeology across the Americas. This
repository is the Next.js prototype: **JSON mock data only, no backend yet**.

```bash
npm run dev
```

Then open <http://localhost:3000>.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |

---

## What PACP is, and what it is not

Everything in this codebase follows from one distinction, stated plainly in the
Identify a Sherd workflow document:

> This is not "correctly classify a vessel". This is "help me narrow
> possibilities quickly and defensibly". If it tries to be perfect, people won't
> use it.

**PACP is not a classifier or a database.** It is a comparative reasoning tool.
Five principles come out of the source documents and each one has a concrete
consequence in the code:

| Principle | How it shows up |
| --- | --- |
| **Narrow possibilities defensibly** — never claim certainty | `ConfidenceLevel` tops out at `'probable'`. There is no `'certain'`. Search results carry `matched_fields` so a user can see *why* a record came back. |
| **Preserve uncertainty transparently** | Every record has a `stewardship_status` and a `versions[]` history. Prior versions are never overwritten. |
| **Multiple interpretations coexist** | `alternate_interpretations[]` sits *beside* the primary attribution rather than replacing it. Competing readings both stay visible. |
| **Stewardship over authority** | `stewarded` means a specialist vouches for the documentation — "informed confidence rather than [a claim] of final authority". It is not a truth flag. |
| **Incremental contribution is welcome** | Nearly every field in `src/types/pacp.ts` is nullable. Draft records with real gaps ship in the mock data on purpose. |

The last one is worth emphasising because it is easy to undo by accident: a
record with missing fields is a **valid** record, not a broken one. Six of the
thirty mock vessels are drafts, five have no type attribution and five have no
petro-fabric. Any validation added later should keep partial records saveable.

## Source documents

The six documents this build was designed against are in [`docs/`](./docs):

- `Toward_a_Transparent_and_Collaborative_Ceramic_Knowledge_Commons_docx.pdf` — vision statement; the source of the stewardship model and the plural-interpretation principle
- `Pacp_Phase1_Build_Spec.docx` — the six Phase 1 priorities and their build order
- `Updated_Project_Scope_PACP_Project_.docx` — POC scope and the CRM / graduate / undergraduate workflow designs
- `PACP_ERD.pdf` — the entity-relationship model that `src/types/pacp.ts` mirrors
- `Identify_a_Sherd_Workflow.docx` — the flagship workflow, plus its supporting tables
- `Helpful_definitions_for_Rachel_s_team.docx` — the ceramic-analysis vocabulary used throughout the mock data

## Folder layout

```
src/
  app/
    layout.tsx           Root layout — Inter + Playfair Display, the prototype shell
    legacy-shell.tsx     Loads the prototype shell client-only
    legacy-pages.tsx     Loads each prototype page client-only
    page.tsx             Home dashboard (the original prototype's)
    browse/ chat/ search/ identify/ compare/ submit/ submit/vessel/
    artifact/[id]/ vessel/[id]/ profile/ admin/ resources/ about/
    donate/ land-acknowledgement/ not-found.tsx
                         One-line routes into the prototype pages
    onboarding/page.tsx  Four-step wizard: role → tasks → sign up → confirm
    signin/page.tsx      Prototype sign-in
    submit/report/       Upload a Report — AI-assisted PDF extraction and review
    api/extract/         Streaming extraction route + credential status route
    globals.css          The original prototype's design tokens + base typography
  legacy/                The original prototype UI (see "The original UI" below)
    router.jsx           React Router → Next.js compatibility layer
    layout/              App shell, top nav
    pages/               The 16 original pages
    assistant/ onboarding/ submit/ components/ context/ data/ lib/
  components/
    extraction/          Upload a Report UI, built from the prototype's own patterns
    StewardshipBadge.tsx, RoleBadge.tsx, Breadcrumb.tsx, InfoBanner.tsx,
    EmptyState.tsx, PacpMark.tsx
    TopNav.tsx           Foundation-build nav — no longer rendered (see below)
    ui/                  shadcn components (generated — edit with care)
  lib/
    data.ts              Typed accessors, filtering, search, similarity, stewardship counts
    onboarding.ts        Role and task catalogue for the wizard
    user-storage.ts      localStorage "session", bridged to the prototype's role keys
    extraction/          Pipeline, schema, quote verification, demo data, drafts
    utils.ts             shadcn `cn()` helper
    mock-data/           Ten JSON files (see below)
  types/
    pacp.ts              Every entity interface, mirroring the ERD
docs/                    The six source documents
scripts/build-demo.mjs   Rebuilds the example extraction against the real PDF
public/assets/           Prototype images, including the PACP logo
```

## The original UI

The interface is the original PACP prototype — its home dashboard, all 16
pages, the PACP Assistant panel and its onboarding — restored from the
published Figma Make site. The source lives in `src/legacy/`, largely as it was
reconstructed from that site's bundle.

How it runs inside Next.js:

- **Client-only.** The prototype was a single-page app: it reads localStorage
  while rendering, and Leaflet touches `window` on import. Pages and shell load
  through `next/dynamic` with `ssr: false`, the approach of Next's own
  "migrating from Vite" guide.
- **Routing.** Its `react-router-dom` imports point at `src/legacy/router.jsx`,
  which provides `Link`, `useNavigate`, `useParams`, `useLocation` and
  `useSearchParams` on top of Next's router. Every page kept its original URL.
- **Role gating is unchanged.** With no role chosen, any prototype page shows
  the prototype's onboarding. `/onboarding` and `/signin` sit outside that shell.
- **One role, two formats.** The prototype stores `pacp_user_role` /
  `pacp_user_tasks` with its own ids; the Next pages store `pacp_user`.
  `user-storage.ts` writes both, mapping the new onboarding's tasks to the
  prototype's dashboards (graduate and undergraduate tasks match one to one;
  CRM tasks map to the nearest dashboard, e.g. "Identify a Sherd" → Rapid
  identification). The shell re-reads storage when either side changes.
- **Additions.** "Upload a Report (PDF)" sits in the Submit page's Bulk Upload
  section, beside "Bulk Vessel Upload", and as an "Upload a Report" card on
  every role's home dashboard (all 13 workflow variants in `HomePage.jsx`).
  Both open `/submit/report`. The top nav
  is exactly the prototype's. The foundation-build `TopNav.tsx`, with its Sign
  In button, is no longer rendered.
- **Lint.** `src/legacy` is excluded from ESLint except the files written for
  the port (`router.jsx`, `layout/AppShell.jsx`, `layout/RootLayout.jsx`). The
  reconstructed code's minifier-era patterns weren't worth rewriting 12k lines
  for, at the risk of changing the design.

### Mock data

`src/lib/mock-data/` holds ten JSON files, cross-linked by ID so the knowledge
graph is navigable in every direction:

| File | Records | Notes |
| --- | --- | --- |
| `vessels.json` | 30 | The central record. Full morphology, technology, versions, alternate interpretations, discussion |
| `sites.json` | 8 | La Quemada, Monte Albán, Teotihuacan, Chichén Itzá, Tikal, Copán, Cerro Sechín, Sitio Conte |
| `wares.json` | 10 | With date ranges and back-links to their types |
| `types.json` | 15 | Each tied to a ware, region, period, fabric and bibliography |
| `petrofabrics.json` | 6 | Inclusion kind / amount / sorting / size / shape and matrix activity, per the definitions doc |
| `contributors.json` | 8 | ORCID, affiliation, expertise tags, contribution stats |
| `bibliography.json` | 24 | Real citation shapes — books, articles, a CRM report, a thesis |
| `periods.json` | 11 | Mesoamerican and pan-American, with negative years for BCE |
| `regions.json` | 8 | Country / region / subregion with local geology notes |
| `assemblages.json` | 6 | Type-to-site groupings with sherd counts |

Vessel measurements and descriptive values are generated deterministically from
each registration number, so the data is stable across rebuilds while staying
internally coherent — a coarse quartz fabric gets a soft, low-fired vessel with
a sharp core boundary; a fine orange paste gets a hard, fully oxidised one.

### Data helpers

```ts
import { getVessel, getVessels, searchRecords, getSimilarVessels } from '@/lib/data';

getVessels({ stewardship_status: 'needs_review', site_id: 'site-tikal' })
searchRecords('polychrome bowl', 'vessel')   // → SearchResult[] with matched_fields
getSimilarVessels('ves-lq-v-112')            // shared type > ware > fabric > site
getStewardshipCounts()                       // → { draft: 6, needs_review: 8, … }
getTaskQueues()                              // records missing types, images, review…
```

`getSimilarVessels` is the seam for the workflow document's "This is close"
interaction — shared type is the strongest signal, then ware, then fabric, then
site. It ranks records worth comparing; it does not assert they are the same
thing.

---

## Design tokens

Colours, fonts and radii live in `src/app/globals.css`, restored from the
original prototype so the interface matches it.

**There is no `tailwind.config.ts`.** Tailwind v4 is CSS-first: `@theme` in the
stylesheet *is* the config, and anything declared there becomes a utility.

### Palette

| Token | Value | Use |
| --- | --- | --- |
| `primary` / `terracotta` | `#A0593F` | Actions, links, active states |
| `accent` / `terracotta-light` | `#C87D52` | Accents, hover tints |
| `secondary` / `sand` | `#D4A574` | Secondary surfaces |
| `clay` | `#8B6F47` | Supporting brown |
| `background` / `cream` | `#FAF8F5` | Page background |
| `muted` / `cream-warm` | `#E8DFD6` | Muted surfaces |
| `input-background` | `#F4EDE4` | Form fields |
| `foreground` / `charcoal` | `#2D2520` | Primary text |
| `muted-foreground` / `charcoal-muted` | `#6B5D52` | Secondary text |
| `border` | `#A0593F` at 15% | Borders and dividers |

`terracotta`, `cream`, `charcoal` and the `status-*` colours are the names the
pages added in Next.js use (sign-in, onboarding, Extract). They are aliased to
the original palette above, so those pages match the rest of the app.

### Typography

As in the prototype:

- **Body** — Inter.
- **`h1`–`h6`** — Playfair Display.
- **`font-serif`** — Tailwind's default serif stack. The prototype's headings
  styled with `font-serif` use this rather than Playfair, and that is kept.

Both faces load through `next/font/google`. `globals.css` names them directly
(`Inter`, `'Playfair Display'`) rather than through `next/font`'s variables, which
keeps the prototype's exact fallback order.

### Shape

`--radius: 0.5rem`, with `sm`/`md`/`lg`/`xl` derived from it as in the prototype.

---

## Functional Requirements coverage

Built against `Functional Requirements.pdf` (Sept 2026). Added in this pass:

| Requirement | Where |
| --- | --- |
| FR-3.5 account recovery | `/reset-password` — the sign-in link pointed at a 404 |
| FR-4.1 Login in nav | `src/legacy/layout/TopNav.jsx`, shown when no account is signed in |
| FR-4.2 hamburger for mobile | same file — below `lg` only; the desktop row is unchanged and no longer overflows |
| FR-6.1 sortable columns | `src/legacy/pages/BrowsePage.jsx` — header cycles ascending → descending → unsorted |
| FR-6.2 per-column filters | same file — the boxes already existed but were decorative; they now filter |
| FR-6.a categories | added Petro-fabrics, Petrographic Samples, Figurines, Master Bibliography, Contributors |
| FR-13.1–13.6 Resources | `src/legacy/pages/ResourcesPage.jsx` — instructions, glossary with citations, countries, periods, videos |
| §3 ethics affirmation + permissions upload | `src/legacy/submit/SubmissionEthics.jsx`, on the submission summary step |
| FR-14.2.4 licensing at submission | same component — CC BY / BY-NC / BY-SA / CC0 / all rights reserved |
| §14.3.4 sensitive-content flag | same component |
| FR-14.2.4 recommended citation | `src/legacy/components/RecordCitation.jsx`, on vessel records |
| FR-14.2.2 CSV / JSON export | same component |

Countries and periods on the Resources page read from `src/lib/mock-data/`, so the
reference lists cannot drift from what records use.

### Content from the live site

Pages that held placeholder text now carry the project's own content from
panamericanceramics.org (Sept 2026):

| Page | What changed |
| --- | --- |
| `/about` | Real mission, goals, history (2014 → NSF fellowship → Dec 2022 launch), funders and named apprentices. The placeholder invented people ("Dr. Sarah Chen") and funders. |
| `/contact` | New page — Editors-in-Chief with affiliations and emails; linked from the Info menu, as on the live site. |
| `/land-acknowledgement` | The project's own statement verbatim, English and Spanish, naming the Akimel O'odham (Pima) and Pee Posh (Maricopa) peoples. |
| `/donate` | Buttons point at the real American Archaeology Abroad store page. |

`next.config.ts` also redirects every live-site URL to its prototype
equivalent, so links and bookmarks carried over do not 404: the nine browse
sections (`/sites`, `/wares`, `/ceramic_types`, `/petrofabrics`, `/vessels`,
`/petrographics`, `/kilns`, `/references`, `/contributors`, including deep
links like `/sites/1-la-quemada`) land on Browse; the five Resources pages
(`/instructions`, `/glossary`, `/maps`, `/periods`, `/instructional_videos`)
land on the matching Resources section; and `/land_acknowledgement`,
`/forms/v2`, `/users/sign_in`, `/users/sign_up`, `/users/password/new` map to
their new paths.

### Submit page entry types

All ten entry types on the Submit page now lead somewhere; previously only
"Submit a Vessel" did and the other nine 404'd. `/submit/[entity]` renders a
form from a field spec in `src/legacy/submit/entityForms.js`, built from the
vessel form's own components:

| Route | Entries on the live site |
| --- | --- |
| `/submit/ware` | 108 |
| `/submit/type` | 451 |
| `/submit/petro-fabric` | 4 |
| `/submit/site` | 6 |
| `/submit/kiln`, `/submit/workshop` | 0 |
| `/submit/sample` | 9 — requires a vessel registration number (FR-7.7) |
| `/submit/bibliography` | 447 |
| `/submit/contributor` | 31 |
| `/submit/vessel` (existing), `/submit/report` | 858 |

Fields follow the categories the live site records and Functional Requirements
§6.a/§6.b. The entry counts on the Submit page cards were invented (Wares 342,
Vessels 5834, Bibliography 2341…) and now match the live site. Every form ends
with the same ethics affirmation and privacy selector as the vessel flow, and
only the fields marked Required are needed to save a draft (FR-7.2).

### Known gaps

Not yet built, in rough priority order: email verification (FR-3.3) and the
sign-up Specialty field and contributor checkbox (FR-3.1); password policy
(FR-3.2); browse categories beyond Vessels still show the vessel table;
Figurines has no schema or data; multilingual EN/ES with a global language
selector (§14.5) exists only inside the Assistant; production-sequence
comparison as framed in the Sept 2026 Project Scope (raw materials → forming →
finishing → firing) is not a first-class feature.

## Status

In place:

- Next.js 16 + React 19 + TypeScript + Tailwind v4
- **The original prototype UI** — home dashboard, 16 pages, PACP Assistant and onboarding
- shadcn/ui (neutral base, CSS variables) with 19 components installed
- The full mock-data layer with typed accessors, filtering, search and similarity
- The four-step onboarding wizard at `/onboarding` and sign-in at `/signin`
- **Upload a Report** at `/submit/report` — AI-assisted PDF extraction with CRM, graduate and undergraduate review views

### Prototype auth

There is none. `/signin` accepts anything and `/onboarding` validates nothing —
both write `pacp_user` (`{ name, email, role, tasks[] }`) to localStorage, mirrored
into the prototype's role keys so they unlock its dashboard. `useStoredUser()` reads through `useSyncExternalStore` so the signed-in
state survives hydration without a mismatch, and same-tab writes broadcast a
`pacp:user-changed` event since the native `storage` event is cross-tab only.

Visiting `/onboarding` always shows the wizard, including for returning users —
that is deliberate, so the flow stays demoable.

## Upload a Report — AI-assisted PDF extraction (`/submit/report`)

The scope document lists "AI-assisted data extraction from CRM reports, PhD
theses [and] public archaeological documents" as a goal, while ruling out
"automated authoritative interpretation or replacement of expert review". This
feature is built around that tension: **Claude proposes, a person decides.**

**Where it lives.** Submit → Bulk Upload → *Upload a Report (PDF)*, beside the
prototype's *Bulk Vessel Upload*. The page is built only from patterns already
in the prototype, so it reads as part of PACP: the Identify page's breadcrumb
header and reasoning callout, the Submit page's section labels, featured card
and buttons, the Admin page's table (CRM view), detail-page cards (graduate
view), the Identify flow with the submission form's Back/Next bar
(undergraduate view), Profile-page tabs and the Identify toast. Each class
string's source is noted in `src/components/extraction/pacp-ui.tsx`. The old
`/upload` URL redirects here.

```bash
cp .env.local.example .env.local   # add ANTHROPIC_API_KEY, then restart npm run dev
```

The example report works with no key.

### How it works

1. **Upload** a PDF and pick a page range. A rough cost estimate is shown first.
2. **`POST /api/extract`** splits the PDF into 20-page excerpts, uploads each
   through the Anthropic Files API, and asks Claude Opus 5 for candidate records
   against a strict schema — wares and types, sites, petrographic samples,
   assemblage counts, references. Results stream back as each excerpt finishes.
3. **Every item is checked in code**, not by the model:
   - its quote is matched against the PDF's text layer (*verified* / *partial* /
     *unverified*);
   - assemblage counts are re-added against their printed totals.
4. **A person reviews** each item. Accepting saves it as a **Draft** with its
   page, quote, checks and source citation attached.

| Design choice | Why |
| --- | --- |
| Pages go to Claude as PDF, not extracted text | Report tables scramble in the text layer. Pueblo Grande's Table 2.1 interleaves row labels into its numbers, so text-only extraction would corrupt exactly the counts people need. |
| Excerpt-relative page numbers, converted in code | Provenance is the point; page arithmetic isn't delegated to the model. |
| A chunk that overflows its output budget splits and retries | A references chapter can hold hundreds of entries; truncating mid-JSON would lose all of them. |
| A free Models API preflight before any PDF work | A missing or invalid key otherwise fails identically on every chunk. |
| `confidence` stops at "probable" | The same rule as the rest of PACP — nothing is ever marked certain. |
| Server-side refusal fallbacks enabled | A declined excerpt is retried on a fallback model rather than silently lost. |

### Three review views

| Role | View | Built for |
| --- | --- | --- |
| CRM archaeologist | Dense table, bulk accept, CSV export, copy citation | Speed under deadline. Bulk accept only takes items whose quote was found *and* whose totals reconcile, so going fast never skips a check. |
| Graduate student | Cards with full reasoning, evidence, "needs a closer look" filter, JSON dataset export | Examining how each record was derived and where it is weakest. |
| Undergraduate | One record at a time: *What is this?*, a concrete check, key-terms glossary | Guided learning. "I'm not sure — skip for now" is a first-class answer. |

The view defaults to the signed-in user's role and can be switched. All three
share one review state.

### The example report

Abbott, David R. (ed.) 1994, *The Pueblo Grande Project* Vol. 3 Part 1 — a
489-page Hohokam volume from tDAR (doi:10.6067/XCV8XW4H60).

**The bundled example results were curated by hand, not produced by Claude**,
and the UI says so. What is real is the verification: `scripts/build-demo.mjs`
runs the same quote-matching and totals code as live runs against the actual PDF.
Rebuild it with:

```bash
node --experimental-strip-types scripts/build-demo.mjs /path/to/pueblo_grande_ssi_vol-3pt-1.pdf
```

It surfaced something worth knowing: **the printed Redware total in Table 2.1
(45,005) does not match its own column**, which sums to 45,085. Every row
reconciles and the grand total matches the row totals, so this is probably a
typo in the 1994 report. The demo flags it rather than correcting it.

### Cost

Roughly **$0.015–$0.035 per page** on Claude Opus 5 — about $7–17 for the full
489-page volume, since a PDF page costs its text plus an image and adaptive
thinking adds output. The real figure is computed from token usage and shown
when a run finishes. Start with a single chapter.

Browse, record pages, search, submission, Identify a Sherd and the task-based
home dashboard all come from the original prototype, and run on its own inline
sample data. They are not yet wired to the typed mock-data layer in
`src/lib/data.ts`, which is the natural next step.
