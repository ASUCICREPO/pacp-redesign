'use client';

import { useRouter } from 'next/navigation';

import { ResetPasswordScreen } from '../legacy-pages';

/**
 * Password recovery (FR-3.5), in the prototype's own onboarding card.
 *
 * The confirmation never says whether the address is registered — telling a
 * stranger which emails have accounts is the one thing a recovery form should
 * not do.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  return <ResetPasswordScreen onBackToSignIn={() => router.push('/signin')} />;
}
