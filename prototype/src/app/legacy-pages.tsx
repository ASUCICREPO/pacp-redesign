'use client';

import dynamic from 'next/dynamic';

/**
 * The original prototype pages, loaded client-only.
 *
 * The prototype was a single-page app: it reads localStorage while rendering
 * and Leaflet touches `window` on import, both of which fail under server
 * rendering. `ssr: false` is the approach Next's own "migrating from Vite"
 * guide takes for this, and it must be declared in a Client Component — hence
 * this module, which each route file imports from.
 */

// Options must be an inline object literal: Next analyses them at build time.
const blank = () => <div className="min-h-screen bg-background" />;

export const HomePage = dynamic(() => import('@/legacy/pages/HomePage.jsx'), { ssr: false, loading: blank });
export const BrowsePage = dynamic(() => import('@/legacy/pages/BrowsePage.jsx'), { ssr: false, loading: blank });
export const ChatPage = dynamic(() => import('@/legacy/pages/ChatPage.jsx'), { ssr: false, loading: blank });
export const SearchPage = dynamic(() => import('@/legacy/pages/SearchPage.jsx'), { ssr: false, loading: blank });
export const OnboardingFlow = dynamic(() => import('@/legacy/onboarding/OnboardingFlow.jsx'), { ssr: false, loading: blank });
export const SignInScreen = dynamic(
  () => import('@/legacy/onboarding/AccountScreens.jsx').then((m) => m.SignInScreen),
  { ssr: false, loading: blank },
);
export const ResetPasswordScreen = dynamic(
  () => import('@/legacy/onboarding/AccountScreens.jsx').then((m) => m.ResetPasswordScreen),
  { ssr: false, loading: blank },
);
export const ArtifactDetailPage = dynamic(() => import('@/legacy/pages/ArtifactDetailPage.jsx'), { ssr: false, loading: blank });
export const VesselDetailPage = dynamic(() => import('@/legacy/pages/VesselDetailPage.jsx'), { ssr: false, loading: blank });
export const SubmitPage = dynamic(() => import('@/legacy/pages/SubmitPage.jsx'), { ssr: false, loading: blank });
export const SubmitVesselPage = dynamic(() => import('@/legacy/pages/SubmitVesselPage.jsx'), { ssr: false, loading: blank });
export const ProfilePage = dynamic(() => import('@/legacy/pages/ProfilePage.jsx'), { ssr: false, loading: blank });
export const AdminPage = dynamic(() => import('@/legacy/pages/AdminPage.jsx'), { ssr: false, loading: blank });
export const ResourcesPage = dynamic(() => import('@/legacy/pages/ResourcesPage.jsx'), { ssr: false, loading: blank });
export const AboutPage = dynamic(() => import('@/legacy/pages/AboutPage.jsx'), { ssr: false, loading: blank });
export const DonatePage = dynamic(() => import('@/legacy/pages/DonatePage.jsx'), { ssr: false, loading: blank });
export const LandAcknowledgementPage = dynamic(() => import('@/legacy/pages/LandAcknowledgementPage.jsx'), { ssr: false, loading: blank });
export const IdentifyPage = dynamic(() => import('@/legacy/pages/IdentifyPage.jsx'), { ssr: false, loading: blank });
export const ComparePage = dynamic(() => import('@/legacy/pages/ComparePage.jsx'), { ssr: false, loading: blank });
export const NotFoundPage = dynamic(() => import('@/legacy/pages/NotFoundPage.jsx'), { ssr: false, loading: blank });
