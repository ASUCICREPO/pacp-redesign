import { BookOpen, FileText, Globe2, Hourglass, PlayCircle, ShieldCheck } from 'lucide-react';

import { Link } from '../router.jsx';
import { SectionNav } from './SubmitPage.jsx';
import { periods, regions } from '@/lib/data';

/**
 * Resources (FR-13).
 *
 * Laid out like the Submit page — header band, sticky "Jump to Section" nav,
 * uppercase section labels — so it reads as part of PACP.
 *
 * Countries and periods come from the shared reference data rather than being
 * retyped here, so the page cannot drift from what records actually use.
 */

export const RESOURCE_SECTIONS = [
  { id: 'instructions', label: 'Instructions' },
  { id: 'glossary', label: 'Glossary' },
  { id: 'countries-regions', label: 'Countries & Regions' },
  { id: 'periods', label: 'Periods' },
  { id: 'videos', label: 'Instructional Videos' },
];

/** FR-13.1 — one entry per submission workflow on the Submit page. */
export const SUBMISSION_INSTRUCTIONS = [
  {
    title: 'Before you begin',
    body: 'Submissions can be partial. Save a draft with only the sections you can complete — a record with gaps is a valid contribution, and others can add to it later. You keep control of each entry through its privacy level, and you can change that at any time.',
  },
  {
    title: 'Vessels',
    body: 'Start from the registration number and site, then add morphology and technology as you have them. Vessels can be linked to existing wares, types, petro-fabrics and kilns/workshops by searching for them, so avoid creating a duplicate ware just to attach a vessel.',
  },
  {
    title: 'Wares and types',
    body: 'Give the defining criteria as your sources state them — temper, paste, slip colour, surface treatment, design style — and cite the publication that defines the category. Where scholars disagree, record the alternative reading rather than choosing between them.',
  },
  {
    title: 'Petro-fabrics and petrographic samples',
    body: 'A petrographic sample must be linked to an existing vessel by its registration number. Describe inclusions by kind, amount, sorting, size and shape, and note the matrix colour and optical activity, so fabrics can be compared across projects.',
  },
  {
    title: 'Illustrations and photographs',
    body: 'Accepted formats are .jpg, .tiff, .gif and .png. Record a caption and credit for every image, and note whether it shows an exterior, interior, break section or thin section.',
  },
  {
    title: 'Bulk vessel upload',
    body: 'For large assemblages, download the bulk template and fill one row per vessel: inventory number, archaeological context, reference, figure, page and plate. Upload the completed sheet from the Submit page.',
  },
  {
    title: 'Reports and published volumes',
    body: 'A CRM report, thesis or monograph can be read for you: Submit → Upload a Report proposes records from the PDF with the page and passage each came from. Every proposal is reviewed by you before anything is saved as a draft.',
  },
];

/**
 * FR-13.2 — decorative and surface-treatment techniques.
 * Definitions follow the standard references; the citation is given so a
 * reader can check the wording at source rather than trusting this page.
 */
export const GLOSSARY = [
  {
    term: 'Primary finishing',
    definition:
      'Treatment whose purpose is to even out the wall thickness of a vessel after forming. Scraping is the most common primary method, and its striations often survive on interior surfaces.',
    citation: 'Rye 1981; Shepard 1956',
  },
  {
    term: 'Secondary finishing',
    definition:
      'Treatment whose purpose is to give the surface a particular texture or sheen rather than to even the wall. Includes smoothing, burnishing, polishing, brushing and the application of a slip.',
    citation: 'Rye 1981; Shepard 1956',
  },
  {
    term: 'Slip',
    definition:
      'A suspension of fine clay applied to the surface before firing, changing its colour and texture. A slip can be distinguished from a self-slipped or floated surface by a colour break visible in cross-section.',
    citation: 'Rice 1987; Shepard 1956',
  },
  {
    term: 'Burnishing',
    definition:
      'Compaction of a leather-hard surface with a smooth tool, producing a sheen. Recorded as light or high; individual facets from the tool are often visible under raking light.',
    citation: 'Rye 1981',
  },
  {
    term: 'Polishing',
    definition:
      'Compaction producing a uniform lustre without the discrete facets left by burnishing, generally worked over a finer surface.',
    citation: 'Rice 1987',
  },
  {
    term: 'Incised',
    definition:
      'Decoration cut into a leather-hard surface with a pointed tool, leaving a groove with displaced clay along its edges.',
    citation: 'Rice 1987',
  },
  {
    term: 'Engraved',
    definition:
      'Decoration cut after firing, or into a hardened surface, producing a cleaner edge than incision and no displaced clay ridge.',
    citation: 'Rice 1987',
  },
  {
    term: 'Impressed',
    definition:
      'Decoration made by pressing an object — a tool, cord, shell, fingernail or fabric — into a plastic surface, leaving the negative of that object.',
    citation: 'Rice 1987; Shepard 1956',
  },
  {
    term: 'Stamped',
    definition:
      'A form of impression in which a carved or moulded stamp repeats a single motif across the surface.',
    citation: 'Rice 1987',
  },
  {
    term: 'Punctated',
    definition:
      'Repeated discrete impressions made with a pointed tool, arranged in rows, fields or zones.',
    citation: 'Rice 1987',
  },
  {
    term: 'Appliqué',
    definition:
      'Decoration formed by attaching additional clay — fillets, pellets, lugs or modelled elements — to the surface before firing.',
    citation: 'Rice 1987',
  },
  {
    term: 'Painted',
    definition:
      'Pigment applied before or after firing. Record the technique, the motifs and their arrangement, the location on the vessel, and the pigment where known; pre-fire and post-fire paint weather differently.',
    citation: 'Shepard 1956; Rice 1987',
  },
  {
    term: 'Resist (negative) painting',
    definition:
      'A design produced by masking part of the surface — with wax, clay or an organic material — so that it resists a subsequent coating or smudging, leaving the motif in the original colour.',
    citation: 'Shepard 1956',
  },
  {
    term: 'Firing atmosphere',
    definition:
      'The oxygen conditions during firing, inferred from surface and core colour. Oxidising atmospheres give light reds, oranges and buffs; neutral conditions dull browns; reducing atmospheres greys and blacks.',
    citation: 'Rye 1981; Shepard 1956',
  },
  {
    term: 'Core (carbon core)',
    definition:
      'A darker zone in the cross-section left when organic matter has not fully burned out. A sharp core boundary points to a short firing or fast cooling; no visible core suggests a longer, fully oxidising firing.',
    citation: 'Rye 1981',
  },
  {
    term: 'Temper',
    definition:
      'Non-plastic material present in the clay body, whether added by the potter or naturally occurring. Described by kind, amount, sorting, size and shape — the attributes that let fabrics be compared between regions.',
    citation: 'Rice 1987; Whitbread 1995',
  },
];

const formatYear = (year) => (year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`);

export function ResourcesPage() {
  const byCountry = regions.reduce((acc, region) => {
    (acc[region.country] ??= []).push(region);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="font-serif text-foreground mb-4">Resources</h1>
          <p className="text-muted-foreground max-w-3xl">
            Guidance for contributing to the Pan-American Ceramics Project, together with the reference lists records
            are built from: a glossary of decorative and surface-treatment terms, the countries and regions covered,
            and the period names and date ranges in use.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          <aside className="hidden lg:block w-56 shrink-0">
            <SectionNav sections={RESOURCE_SECTIONS} />
          </aside>

          <div className="flex-1 min-w-0 space-y-12">
            <section id="instructions">
              <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Instructions</h2>
              <div className="space-y-4">
                {SUBMISSION_INSTRUCTIONS.map((item) => (
                  <div key={item.title} className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="font-sans text-foreground mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                ))}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                  <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground flex-1">
                    Ready to contribute?{' '}
                    <Link to="/submit" className="text-primary hover:underline font-medium">
                      Go to the Submit page
                    </Link>
                    , or{' '}
                    <Link to="/submit/report" className="text-primary hover:underline font-medium">
                      upload a report
                    </Link>{' '}
                    and review what it proposes.
                  </p>
                </div>
              </div>
            </section>

            <section id="glossary">
              <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">
                Glossary of Decorative &amp; Surface Techniques
              </h2>
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <dl className="divide-y divide-border">
                  {GLOSSARY.map((entry) => (
                    <div key={entry.term} className="px-6 py-4">
                      <dt className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-sans text-foreground font-semibold">{entry.term}</span>
                        <span className="text-xs text-muted-foreground">{entry.citation}</span>
                      </dt>
                      <dd className="mt-1 text-sm text-muted-foreground leading-relaxed">{entry.definition}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Definitions follow Rice, <em>Pottery Analysis: A Sourcebook</em> (1987); Shepard,{' '}
                <em>Ceramics for the Archaeologist</em> (1956); Rye, <em>Pottery Technology</em> (1981); and Whitbread,{' '}
                <em>Ceramic Petrology</em> (1995). Regional traditions use some of these terms differently — record the
                usage your sources follow.
              </p>
            </section>

            <section id="countries-regions">
              <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Countries &amp; Regions</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(byCountry).map(([country, list]) => (
                  <div key={country} className="bg-card rounded-lg p-6 border border-border">
                    <h3 className="flex items-center gap-2 font-sans text-foreground mb-3 font-semibold">
                      <Globe2 className="w-4 h-4 text-primary" />
                      {country}
                    </h3>
                    <dl className="space-y-3">
                      {list.map((region) => (
                        <div key={region.region_id}>
                          <dt className="text-sm text-foreground">
                            {region.name}
                            {region.subregion && (
                              <span className="text-muted-foreground"> · {region.subregion}</span>
                            )}
                          </dt>
                          {region.description && (
                            <dd className="text-xs text-muted-foreground leading-relaxed">{region.description}</dd>
                          )}
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>

            <section id="periods">
              <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Period Names &amp; Dates</h2>
              <div className="bg-card border border-border rounded-lg overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm">Period</th>
                      <th className="text-left px-4 py-3 text-sm">Applies to</th>
                      <th className="text-left px-4 py-3 text-sm">Dates</th>
                      <th className="text-left px-4 py-3 text-sm">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {periods.map((period) => (
                      <tr key={period.period_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm text-foreground">
                          <span className="inline-flex items-center gap-2">
                            <Hourglass className="w-3.5 h-3.5 text-primary shrink-0" />
                            {period.term}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{period.region_scope}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {formatYear(period.date_range_start)} – {formatYear(period.date_range_end)}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{period.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Period boundaries are conventions, not facts, and they differ between regional sequences. Where a
                record&rsquo;s source uses a different span, record the source&rsquo;s dates alongside the period name.
              </p>
            </section>

            <section id="videos">
              <h2 className="text-xs uppercase tracking-wider text-primary mb-6 font-semibold">Instructional Videos</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Submitting a vessel', body: 'A walkthrough of the submission wizard, from registration number to review.', admin: false },
                  { title: 'Bulk vessel upload', body: 'Filling the template and uploading an assemblage in one pass.', admin: false },
                  { title: 'Linking petrographic samples', body: 'Attaching a thin-section sample to an existing vessel record.', admin: false },
                  { title: 'Reviewing an uploaded report', body: 'Checking AI-proposed records against the page they came from.', admin: false },
                  { title: 'Changing user permissions', body: 'Assigning and revoking roles from the admin dashboard.', admin: true },
                  { title: 'Approving submissions and editing entries', body: 'Working through the approval queue and correcting published records.', admin: true },
                ].map((video) => (
                  <div key={video.title} className="bg-card rounded-lg p-6 border border-border">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-primary">
                        <PlayCircle className="w-8 h-8" />
                      </div>
                      {video.admin && (
                        <span className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          <ShieldCheck className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                    <h3 className="font-sans text-foreground mb-2 font-semibold">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{video.body}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5" />
                      Not yet recorded
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResourcesPage;
