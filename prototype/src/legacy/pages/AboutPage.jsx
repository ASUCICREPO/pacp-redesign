import { Link } from '../router.jsx';

/**
 * About (content from panamericanceramics.org/about).
 *
 * The placeholder version named invented people ("Dr. Sarah Chen") and
 * invented funders. This is the project's own account of itself — history,
 * funding and technology as published on the live site.
 */
export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-foreground mb-6">About PACP</h1>
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Our Mission</h2>
            <p className="text-muted-foreground mb-3">
              The Pan-American Ceramics Project is a community-based digital project seeking to enhance FAIR
              (findable, accessible, interoperable, reusable) and CARE (collective benefit, authority to control,
              responsibility, ethics) principles in the dissemination of information related to the production and
              function of ceramics across all time periods, from Canada to Argentina. This includes prehistoric,
              historic, and modern potting communities.
            </p>
            <p className="text-muted-foreground">
              Users can browse ceramic wares, types, vessels, petro-fabrics, thin sections, kilns/workshops and sites
              added by registered contributors or uploaded on their behalf. Every entry can produce its own citation,
              and contributors choose one of three privacy levels when they upload: open access (the default),
              restricted access, or completely private.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Why Pottery</h2>
            <p className="text-muted-foreground">
              Pottery matters because it makes people visible. Since its invention, people have made and used ceramic
              pots for tasks inside and outside of their homes: to prepare, cook, serve and store food; to set the
              table; to transport commodities; to accompany ritual and ceremonial acts; to accompany their dead; to
              teach their youth &lsquo;proper&rsquo; ways of making and using pots within their community. Pottery
              situates people in time and space, reveals communities of practice, and illuminates past lives.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Our Goals</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li>
                <span className="text-foreground">Unprecedented scale.</span> Temporal and spatial coverage that allows
                phenomena to be observed at scales previously unattainable, and collaboration within and across
                international boundaries.
              </li>
              <li>
                <span className="text-foreground">A sustainable, community-built tool.</span> Dependent on an
                ever-growing community of stakeholders: archaeologists in academia, historic preservation and tribal
                offices, CRM companies, ceramic technology specialists, archaeological scientists, museum curators,
                Indigenous practicing potters, and educators.
              </li>
              <li>
                <span className="text-foreground">An equitable process.</span> An iterative and inclusive process by
                which the application and its content grow through the years, to help undo the colonial roots of
                exploration and excavation throughout the Americas.
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              How to balance data accessibility with Indigenous data control across the Americas, while keeping a tool
              that grows organically through its community, remains an open question. As the project puts it: the
              process through which data become available is as important, if not more important, than the data
              themselves.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Project History</h2>
            <p className="text-muted-foreground mb-3">
              What began as frustration in 2014 among Dr. Andrea Torvinen and colleagues working in Northwestern
              Mesoamerica, who sought a way to integrate ceramic data across projects, became the focus of her NSF SBE
              Postdoctoral Fellowship with Dr. Kostalena Michelaki (Arizona State University) and Dr. Andrea Berlin
              (Boston University), founder and editor of the Levantine Ceramics Project (LCP).
            </p>
            <p className="text-muted-foreground mb-3">
              Dr. Berlin gifted the LCP software code, roughly 60% of which forms the base of the PACP. Adaptation for
              the American context added ceramic type as a subcategory of ware, ceramic technological attributes, site
              assemblages recorded as type frequencies, and bulk upload of several thousand vessel entries. The PACP
              web app officially launched in December 2022.
            </p>
            <p className="text-muted-foreground">
              Content has been added primarily from Northwestern Mexico and the US Southwest and Southeast, in large
              part by a team of ASU Undergraduate Research Apprentices: Jerod Edwards, Alicia Fritz, Renee Kreczmer,
              Amanda Pannell, Evelyn Park, Yazmin Sagastume and Chiara Umbriano.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Funding &amp; Partners</h2>
            <p className="text-muted-foreground">
              Supported by the NSF SPRF Program and, at Arizona State University, the Institute for Social Science
              Research and the School of Human Evolution and Social Change. The project has also participated in the
              Networking Archaeological Data and Communities (NADAC) Institute.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Get Involved</h2>
            <p className="text-muted-foreground mb-3">
              The PACP invites scholars, Indigenous potters, museum professionals and CRM specialists to contribute.
              The team welcomes workshop proposals and is looking for volunteers to serve as regional editors.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="text-primary hover:underline">
                Editors &amp; contact →
              </Link>
              <Link to="/submit" className="text-primary hover:underline">
                Submit data →
              </Link>
              <Link to="/resources" className="text-primary hover:underline">
                Resources and instructions →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
