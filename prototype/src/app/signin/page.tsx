'use client';

import { useRouter } from 'next/navigation';

import { readStoredUser, writeStoredUser } from '@/lib/user-storage';

import { SignInScreen } from '../legacy-pages';

/**
 * Sign in (FR-3.4), in the prototype's own onboarding card.
 *
 * No validation, as everywhere else in the prototype: there is no backend to
 * check against, and pretending otherwise would be the wrong thing to show a
 * stakeholder. Signing in keeps whatever role and tasks onboarding already
 * chose, so it never silently resets someone's home screen.
 */
export default function SignInPage() {
  const router = useRouter();

  function signIn({ email }: { email: string; password: string }) {
    const existing = readStoredUser();
    writeStoredUser({
      name: existing?.name || '',
      email: email.trim() || existing?.email || '',
      role: existing?.role ?? null,
      tasks: existing?.tasks ?? [],
      affiliation: existing?.affiliation,
      orcid: existing?.orcid,
    });
    router.push('/');
  }

  return (
    <SignInScreen
      onSignIn={signIn}
      onForgotPassword={() => router.push('/reset-password')}
      onCreateAccount={() => router.push('/onboarding')}
    />
  );
}
