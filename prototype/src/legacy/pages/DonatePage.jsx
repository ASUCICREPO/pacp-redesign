import { Heart } from 'lucide-react';

/** The project's real donation page, via American Archaeology Abroad. */
export const DONATE_URL =
  'https://american-archaeology-abroad.myshopify.com/collections/pacp/products/contribute-to-thepan-american-ceramics-project';

export function DonatePage() {
  return <div className="min-h-screen bg-background"><div className="max-w-4xl mx-auto px-4 py-12"><div className="text-center mb-8"><Heart className="w-12 h-12 text-primary mx-auto mb-4" /><h1 className="font-serif text-foreground mb-3">Support PACP</h1><p className="text-muted-foreground max-w-2xl mx-auto">Your contribution helps maintain the database, support AI development, and provide open access to ceramic production research worldwide.</p></div><div className="grid grid-cols-3 gap-6 mb-8">{[{
          amount: "$25",
          description: "Supports one researcher account for a year"
        }, {
          amount: "$100",
          description: "Funds AI analysis for 100 submissions"
        }, {
          amount: "$500",
          description: "Sponsors a workshop for field researchers"
        }].map(i => <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-colors" key={i.amount}><p className="font-serif text-2xl text-primary mb-2">{i.amount}</p><p className="text-sm text-muted-foreground">{i.description}</p><a href={DONATE_URL} target="_blank" rel="noreferrer" className="mt-4 block w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center">Donate</a></div>)}</div><div className="bg-card border border-border rounded-lg p-6"><h2 className="font-serif text-foreground mb-3">Other Ways to Support</h2><ul className="space-y-2 text-muted-foreground"><li>• Contribute data and expertise to the platform</li><li>• Share PACP with colleagues and students</li><li>• Participate in our peer review process</li><li>• Volunteer as a data quality reviewer</li></ul></div></div></div>;
}

export default DonatePage;
