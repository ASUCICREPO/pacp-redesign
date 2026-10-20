import { BookOpen, CircleCheckBig, FlaskConical, Layers, Package } from 'lucide-react';
import { useState } from 'react';
import { Link } from '../router.jsx';
import { VesselSubmissionForm } from '../submit/VesselSubmissionForm.jsx';

export const SUBMIT_START_STEPS = [{
  step: 0,
  icon: Package,
  title: "Start from a Vessel",
  description: "Site name, registration number, and basic identification"
}, {
  step: 2,
  icon: Layers,
  title: "Start from a Ceramic Type",
  description: "Link to an existing ware, type, or petro-fabric"
}, {
  step: 4,
  icon: FlaskConical,
  title: "Start from a Clay / Fabric",
  description: "Document fabric composition and forming technology"
}, {
  step: 5,
  icon: BookOpen,
  title: "Start from a Bibliography",
  description: "Attach references and contributors first"
}];

export function SubmitVesselPage() {
  const [i, n] = useState(!1),
    [o, s] = useState(null),
    [c, u] = useState(null);
  return i ? <div className="min-h-screen bg-background flex items-center justify-center"><div className="max-w-md text-center"><CircleCheckBig className="w-16 h-16 text-primary mx-auto mb-4" /><h1 className="font-serif text-foreground mb-3">Submission Received!</h1><p className="text-muted-foreground mb-6">Thank you for your contribution. Your submission is now in the approval queue and will be reviewed by our editorial team.</p><div className="flex gap-3 justify-center"><Link to="/profile" className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">View My Submissions</Link><Link to="/browse" className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors">Browse Database</Link></div></div></div> : c === null ? <div className="min-h-screen bg-background flex items-center justify-center px-6 py-16"><div className="max-w-2xl w-full"><div className="text-center mb-10"><h1 className="font-serif text-foreground text-3xl mb-3">Where would you like to start?</h1><p className="text-muted-foreground">You can fill in any step in any order. Only Site Name + Vessel Registration Number is required to save.</p></div><div className="grid grid-cols-2 gap-4 mb-8">{SUBMIT_START_STEPS.map(h => {
          const F = h.icon,
            p = o === h.step;
          return <button type="button" onClick={() => s(h.step)} className={`bg-white text-left p-6 rounded-xl border-2 transition-all ${p ? "border-primary shadow-md" : "border-border hover:border-primary/50"}`} key={h.step}><div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4"><F className="w-5 h-5 text-muted-foreground" /></div><h3 className="font-serif text-foreground text-base font-medium mb-1">{h.title}</h3><p className="text-xs text-muted-foreground leading-snug">{h.description}</p></button>;
        })}</div>{o !== null && <div className="flex justify-center"><button type="button" onClick={() => u(o)} className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">Continue →</button></div>}</div></div> : <VesselSubmissionForm onComplete={() => n(!0)} initialStep={c} />;
}

export default SubmitVesselPage;
