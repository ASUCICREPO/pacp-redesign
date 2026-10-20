import { CircleDashed, Eye, ShieldCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { StewardshipStatus } from '@/types/pacp';

/**
 * The stewardship pill.
 *
 * These four states are the visible face of Phase 1's stewardship layer. The
 * wording matters: none of them means "correct". `stewarded` means a specialist
 * has vouched for the documentation, which the vision statement is explicit is
 * "informed confidence rather than [a claim] of final authority".
 */
interface StatusMeta {
  label: string;
  icon: LucideIcon;
  /** What the state actually tells a reader — surfaced via `title`. */
  description: string;
  className: string;
}

export const STEWARDSHIP_META: Record<StewardshipStatus, StatusMeta> = {
  draft: {
    label: 'Draft',
    icon: CircleDashed,
    description: 'Partial record. Contributed as a work in progress — gaps are expected.',
    className: 'border-status-draft/35 bg-status-draft/12 text-status-draft',
  },
  needs_review: {
    label: 'Needs Review',
    icon: Eye,
    description: 'The contributor has asked for community input on this record.',
    className: 'border-status-review/45 bg-status-review/15 text-[#8a6415]',
  },
  community_reviewed: {
    label: 'Community Reviewed',
    icon: Users,
    description:
      'At least one other contributor has reviewed this record openly. Not a claim of certainty.',
    className: 'border-status-reviewed/40 bg-status-reviewed/12 text-status-reviewed',
  },
  stewarded: {
    label: 'Stewarded',
    icon: ShieldCheck,
    description:
      'A specialist vouches for the documentation. Informed confidence, not final authority.',
    className: 'border-status-stewarded/45 bg-status-stewarded/12 text-status-stewarded',
  },
};

export function StewardshipBadge({
  status,
  size = 'default',
  showIcon = true,
  className,
}: {
  status: StewardshipStatus;
  size?: 'sm' | 'default';
  showIcon?: boolean;
  className?: string;
}) {
  const meta = STEWARDSHIP_META[status];
  const Icon = meta.icon;

  return (
    <span
      title={meta.description}
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        meta.className,
        className,
      )}
    >
      {showIcon && <Icon className={size === 'sm' ? 'size-3' : 'size-3.5'} aria-hidden />}
      {meta.label}
    </span>
  );
}
