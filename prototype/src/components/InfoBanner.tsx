import { AlertTriangle, Info, Lightbulb, Scale } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/**
 * The terracotta-tinted callout used across PACP.
 *
 * The `uncertainty` and `plural` tones exist for a reason: the platform is
 * expected to say out loud when something is unresolved. "You must allow users
 * to end with 'I'm not sure, but these are the closest matches'" — if the
 * system forces certainty, experts avoid it.
 */
type BannerTone = 'info' | 'uncertainty' | 'plural' | 'guidance';

const TONE_META: Record<BannerTone, { icon: LucideIcon; className: string }> = {
  info: {
    icon: Info,
    className: 'border-terracotta/20 bg-terracotta/[0.07] text-charcoal',
  },
  uncertainty: {
    icon: AlertTriangle,
    className: 'border-status-review/35 bg-status-review/10 text-charcoal',
  },
  plural: {
    icon: Scale,
    className: 'border-terracotta/25 bg-terracotta/[0.09] text-charcoal',
  },
  guidance: {
    icon: Lightbulb,
    className: 'border-cream-warm bg-cream-warm/60 text-charcoal',
  },
};

export function InfoBanner({
  title,
  children,
  tone = 'info',
  icon,
  action,
  className,
}: {
  title?: string;
  children: ReactNode;
  tone?: BannerTone;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  const meta = TONE_META[tone];
  const Icon = icon ?? meta.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        meta.className,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0 text-terracotta" aria-hidden />
      <div className="flex-1 space-y-1">
        {title && <p className="font-medium text-charcoal">{title}</p>}
        <div className="text-charcoal-muted [&_a]:text-terracotta [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
