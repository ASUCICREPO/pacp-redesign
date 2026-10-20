'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

/**
 * The original prototype's app shell — role gating, top nav and the PACP
 * Assistant dock — loaded client-only for the same reasons as its pages.
 */
const PrototypeRootLayout = dynamic(() => import('@/legacy/layout/RootLayout.jsx'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-background" />,
});

export function LegacyShell({ children }: { children: ReactNode }) {
  return <PrototypeRootLayout>{children}</PrototypeRootLayout>;
}
