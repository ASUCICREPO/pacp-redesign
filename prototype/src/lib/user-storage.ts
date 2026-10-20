'use client';

import { useMemo, useSyncExternalStore } from 'react';

import type { ContributorRole } from '@/types/pacp';

/**
 * Prototype "session", persisted to localStorage.
 *
 * Stands in for real auth until a backend exists. The homepage reads this to
 * personalise task cards, which is why role and tasks live here rather than in
 * component state — Phase 1 leaves open whether role is session- or
 * profile-based, and this is the seam where that gets decided.
 */
export const PACP_USER_KEY = 'pacp_user';

/** Same-tab change signal. The native `storage` event only fires cross-tab. */
export const PACP_USER_EVENT = 'pacp:user-changed';

export interface PacpUser {
  name: string;
  email: string;
  role: ContributorRole | null;
  tasks: string[];
  affiliation?: string;
  orcid?: string;
}

/* ── Bridge to the original prototype UI ────────────────────────────────────
   The restored prototype shell (src/legacy) keeps role and tasks under its own
   keys and ids. Writes here mirror into those keys so signing in or onboarding
   through the Next.js pages unlocks the prototype dashboard, and reads fall
   back to them so a role chosen in prototype onboarding is seen here too.   */

const LEGACY_ROLE_KEY = 'pacp_user_role';
const LEGACY_TASKS_KEY = 'pacp_user_tasks';

const TO_LEGACY_ROLE: Record<ContributorRole, string> = {
  crm_archaeologist: 'crm',
  graduate_student: 'grad_student',
  undergraduate_student: 'undergrad_student',
  specialist: 'grad_student',
};
const FROM_LEGACY_ROLE: Record<string, ContributorRole> = {
  crm: 'crm_archaeologist',
  grad_student: 'graduate_student',
  undergrad_student: 'undergraduate_student',
};

/**
 * New onboarding task ids → the prototype's, which choose its home dashboard.
 * Graduate and undergraduate sets match one to one. The CRM set differs (the
 * new onboarding follows the scope document), so each maps to its nearest
 * prototype dashboard.
 */
const TO_LEGACY_TASK: Record<string, string> = {
  'identify-sherd': 'rapid-id',
  'regional-parallels': 'rapid-id',
  'report-text': 'reports',
  'similar-assemblages': 'legacy',
  'guided-identification': 'guided-id',
  'literature-exploration': 'literature',
  'dataset-building': 'dataset',
  'learning-through-debate': 'debate',
  'explore-traditions': 'browse',
  'compare-forms': 'comparison',
  'identification-basics': 'intro-id',
  'course-exercises': 'assignments',
};

function writeLegacyKeys(user: PacpUser) {
  if (user.role) window.localStorage.setItem(LEGACY_ROLE_KEY, TO_LEGACY_ROLE[user.role]);
  else window.localStorage.removeItem(LEGACY_ROLE_KEY);
  const tasks = [...new Set(user.tasks.map((t) => TO_LEGACY_TASK[t] ?? t))];
  window.localStorage.setItem(LEGACY_TASKS_KEY, JSON.stringify(tasks));
}

function readLegacyRole(): ContributorRole | null {
  try {
    const legacy = window.localStorage.getItem(LEGACY_ROLE_KEY);
    return legacy ? (FROM_LEGACY_ROLE[legacy] ?? null) : null;
  } catch {
    return null;
  }
}

function parseUser(raw: string | null): PacpUser | null {
  if (!raw || raw.startsWith('legacy:')) {
    // Someone who only went through the prototype's own onboarding.
    const role = typeof window === 'undefined' ? null : readLegacyRole();
    return role ? { name: '', email: '', role, tasks: [] } : null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PacpUser>;
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      name: parsed.name ?? '',
      email: parsed.email ?? '',
      role: parsed.role ?? null,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      affiliation: parsed.affiliation,
      orcid: parsed.orcid,
    };
  } catch {
    // Corrupt storage should never break the app.
    return null;
  }
}

/** Raw read. Returns the stored string so snapshots stay referentially stable. */
function readRaw(): string | null {
  try {
    // Include the legacy role so the snapshot changes when only it changes.
    const user = window.localStorage.getItem(PACP_USER_KEY);
    return user ?? (window.localStorage.getItem(LEGACY_ROLE_KEY) ? `legacy:${window.localStorage.getItem(LEGACY_ROLE_KEY)}` : null);
  } catch {
    // Private browsing and blocked site data are survivable.
    return null;
  }
}

export function readStoredUser(): PacpUser | null {
  if (typeof window === 'undefined') return null;
  return parseUser(readRaw());
}

export function writeStoredUser(user: PacpUser): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PACP_USER_KEY, JSON.stringify(user));
    writeLegacyKeys(user);
  } catch {
    // The flow continues; it just won't be remembered on the next visit.
  }
  window.dispatchEvent(new Event(PACP_USER_EVENT));
}

export function clearStoredUser(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(PACP_USER_KEY);
    window.localStorage.removeItem(LEGACY_ROLE_KEY);
    window.localStorage.removeItem(LEGACY_TASKS_KEY);
  } catch {
    /* no-op */
  }
  window.dispatchEvent(new Event(PACP_USER_EVENT));
}

/* ── React bindings ─────────────────────────────────────────────────────── */

function subscribe(onChange: () => void): () => void {
  window.addEventListener(PACP_USER_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(PACP_USER_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

const serverSnapshot = () => null;
const noopSubscribe = () => () => {};

/**
 * True once the client has taken over from the server render.
 *
 * Signed-in state cannot be known during SSR, so components hold the layout
 * steady until this flips rather than rendering a signed-out flash.
 */
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export function useStoredUser(): { user: PacpUser | null; ready: boolean } {
  const raw = useSyncExternalStore(subscribe, readRaw, serverSnapshot);
  const ready = useIsHydrated();
  const user = useMemo(() => parseUser(raw), [raw]);
  return { user, ready };
}

/* ── Formatting ─────────────────────────────────────────────────────────── */

export const firstNameOf = (name: string): string =>
  name.trim().split(/\s+/)[0] || 'there';

export const initialsOf = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'PA';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
