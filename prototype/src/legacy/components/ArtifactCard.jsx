import { Lock, MapPin } from 'lucide-react';
import { Link } from '../router.jsx';

export function ArtifactCard({
  artifact: i
}) {
  return <Link to={`/vessel/${i.id}`} className="block bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"><div className="aspect-[4/3] bg-muted overflow-hidden">{i.images.exterior && <img src={i.images.exterior} alt={i.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />}</div><div className="p-4"><div className="flex items-start justify-between gap-2 mb-2"><h3 className="font-serif text-foreground">{i.name}</h3>{i.privacy !== "Public" && <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />}</div><p className="text-sm text-muted-foreground mb-1">{i.type}{" · "}{i.period}</p>{i.location && <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="w-3 h-3" /><span>{i.location}</span></div>}{i.tradition && <p className="text-sm text-primary mt-2">{i.tradition}</p>}</div></Link>;
}
