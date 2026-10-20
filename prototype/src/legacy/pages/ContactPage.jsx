import { Mail } from 'lucide-react';

import { Link } from '../router.jsx';

/**
 * Editors & Contact (content from panamericanceramics.org/contact).
 *
 * The live site lists this under About; the prototype had no equivalent page,
 * so the Info menu pointed nowhere for anyone looking for the editors.
 */
export const EDITORS = [
  {
    name: 'Andrea Torvinen',
    role: 'Editor-in-Chief',
    affiliation: 'Florida Museum of Natural History, University of Florida',
    email: 'a.torvinen@ufl.edu',
  },
  {
    name: 'Kostalena Michelaki',
    role: 'Editor-in-Chief',
    affiliation: 'School of Human Evolution and Social Change, Arizona State University',
    email: 'kmichela@asu.edu',
  },
];

export function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="font-serif text-foreground mb-6">Editors &amp; Contact</h1>
        <div className="space-y-6">
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-4">Editors-in-Chief</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {EDITORS.map((editor) => (
                <div key={editor.email}>
                  <p className="font-serif text-foreground">{editor.name}</p>
                  <p className="text-sm text-muted-foreground mb-2">{editor.role}</p>
                  <p className="text-sm text-muted-foreground mb-2">{editor.affiliation}</p>
                  <a
                    href={`mailto:${editor.email}`}
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    {editor.email}
                  </a>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Regional Editors</h2>
            <p className="text-muted-foreground">
              The PACP is looking for volunteers to serve as regional editors, and welcomes proposals for workshops
              with stakeholder communities. Contact either editor-in-chief if you would like to take part.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-serif text-foreground mb-3">Contributing Data</h2>
            <p className="text-muted-foreground mb-3">
              Questions about a submission, a correction to an existing record, or attribution of data uploaded on your
              behalf are best sent to the editors directly.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/submit" className="text-primary hover:underline">
                Submit data →
              </Link>
              <Link to="/resources" className="text-primary hover:underline">
                Submission instructions →
              </Link>
              <Link to="/about" className="text-primary hover:underline">
                About the PACP →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
