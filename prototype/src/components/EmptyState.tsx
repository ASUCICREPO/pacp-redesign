import { SearchX } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * Empty state for lists, browse pages and search results.
 *
 * "Search should not be a dead end" — so an empty result set always offers a
 * way onward via `action`, rather than just reporting nothing found.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = SearchX,
  action,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-cream-warm',
        'bg-card/60 px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-full bg-cream-warm">
        <Icon className="size-5 text-charcoal-muted" aria-hidden />
      </div>
      <h3 className="mb-1 text-base font-semibold">{title}</h3>
      {description && (
        <p className="max-w-md text-sm text-charcoal-muted">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
