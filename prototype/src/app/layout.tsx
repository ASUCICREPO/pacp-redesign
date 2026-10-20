import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { TooltipProvider } from '@/components/ui/tooltip';

import { LegacyShell } from './legacy-shell';

import './globals.css';

/**
 * Body face, as in the original prototype. globals.css names the family
 * directly ("Inter"), which keeps the original fallback order — characters the
 * font lacks, like the "→" in "Change focus →", come from the system font.
 */
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

/** Heading face, as in the original prototype. */
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Pan-American Ceramics Project',
    template: '%s · PACP',
  },
  description:
    'Explore, submit, and collaborate on ceramic production data with expert tools for archaeologists, researchers, and institutions.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <TooltipProvider delayDuration={200}>
          <LegacyShell>{children}</LegacyShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
