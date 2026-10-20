import { ExternalLink } from 'lucide-react';

import { resourcesForText } from '@/lib/external-resources';

/**
 * Where else this material is documented.
 *
 * The 29 September position was that PACP links rather than stores: it keeps
 * metadata about which external resources cover which material and routes
 * people there. This is that, in the smallest honest form — the resources,
 * why each is relevant to this record, and a link out.
 *
 * Deep links per record are deliberately not guessed at; each site needs its
 * own query format and several need a key, so this names what to look for.
 */
export function ExternalResources({ context, heading = 'Documented Elsewhere' }) {
  const matches = resourcesForText(context ?? '');
  if (matches.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className="text-xs uppercase tracking-wider text-primary mb-3 font-semibold">{heading}</h3>
      <p className="text-xs text-muted-foreground mb-3">
        PACP links to these rather than copying them. Open one to follow this material outside the database.
      </p>
      <ul className="space-y-3">
        {matches.map((resource) => (
          <li key={resource.id}>
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium"
            >
              {resource.name} <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-xs text-muted-foreground">{resource.because}</p>
            <p className="text-xs text-muted-foreground/80">{resource.offers}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExternalResources;
