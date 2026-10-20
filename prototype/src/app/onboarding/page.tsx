'use client';

import { useRouter } from 'next/navigation';

import { writeStoredUser } from '@/lib/user-storage';
import type { ContributorRole } from '@/types/pacp';

import { OnboardingFlow } from '../legacy-pages';

/**
 * Onboarding — the prototype's own four screens.
 *
 * This route briefly had a second, differently styled wizard. The prototype
 * already has one (role → tasks → account → ready, in `src/legacy/onboarding`)
 * and it is what the rest of the app looks like, so the route renders that
 * instead of a parallel design.
 *
 * The one thing the prototype's flow never did was remember the account it
 * asked you to create. It writes role and tasks through RoleContext; this
 * mirrors the whole thing into `pacp_user` as well, which is what the nav
 * reads to know you are signed in and what names you on a record you accept.
 */

const FROM_LEGACY_ROLE: Record<string, ContributorRole> = {
  crm: 'crm_archaeologist',
  grad_student: 'graduate_student',
  undergrad_student: 'undergraduate_student',
};

/** Prototype task ids → the onboarding task ids the rest of the app uses. */
const FROM_LEGACY_TASK: Record<string, string> = {
  'rapid-id': 'identify-sherd',
  reports: 'report-text',
  legacy: 'similar-assemblages',
  'guided-id': 'guided-identification',
  literature: 'literature-exploration',
  dataset: 'dataset-building',
  debate: 'learning-through-debate',
  browse: 'explore-traditions',
  comparison: 'compare-forms',
  'intro-id': 'identification-basics',
  assignments: 'course-exercises',
};

interface Finished {
  role: string;
  tasks: string[];
  account: { name?: string; email?: string; affiliation?: string };
}

export default function OnboardingPage() {
  const router = useRouter();

  function finish({ role, tasks, account }: Finished) {
    const mapped = FROM_LEGACY_ROLE[role] ?? null;
    writeStoredUser({
      name: account.name?.trim() || '',
      email: account.email?.trim() || '',
      role: mapped,
      // Keep the ids the rest of the app knows; anything unmapped passes through.
      tasks: tasks.map((task) => FROM_LEGACY_TASK[task] ?? task),
      affiliation: account.affiliation?.trim() || undefined,
    });
    router.push('/');
  }

  return <OnboardingFlow onFinish={finish} />;
}
