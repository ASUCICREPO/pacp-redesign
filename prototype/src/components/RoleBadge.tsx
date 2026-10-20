import { GraduationCap, HardHat, Microscope, Sprout } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ContributorRole } from '@/types/pacp';

/**
 * The viewer's working role.
 *
 * Role is a lens, not a permission. The scope document asks for different
 * entry points per community — CRM users want speed and defensibility,
 * graduate students want visible reasoning, undergraduates want visual
 * exploration — while everyone sees the same underlying records.
 */
const ROLE_META: Record<ContributorRole, { label: string; short: string; icon: LucideIcon }> = {
  crm_archaeologist: { label: 'CRM Archaeologist', short: 'CRM', icon: HardHat },
  graduate_student: { label: 'Graduate Student', short: 'Grad', icon: GraduationCap },
  undergraduate_student: { label: 'Undergraduate Student', short: 'Undergrad', icon: Sprout },
  specialist: { label: 'Specialist', short: 'Specialist', icon: Microscope },
};

export function RoleBadge({
  role,
  variant = 'short',
  showIcon = false,
  className,
}: {
  role: ContributorRole;
  variant?: 'short' | 'full';
  showIcon?: boolean;
  className?: string;
}) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;

  return (
    <span
      title={meta.label}
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-terracotta/25 bg-terracotta/10',
        'px-2 py-0.5 text-[11px] font-medium tracking-wide text-terracotta uppercase',
        className,
      )}
    >
      {showIcon && <Icon className="size-3" aria-hidden />}
      {variant === 'short' ? meta.short : meta.label}
    </span>
  );
}

export { ROLE_META };
