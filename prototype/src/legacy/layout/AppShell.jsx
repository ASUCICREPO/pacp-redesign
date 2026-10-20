import { usePathname } from 'next/navigation';

import { AssistantDock } from '../assistant/AssistantDock.jsx';
import { useRole } from '../context/RoleContext.jsx';
import { OnboardingFlow } from '../onboarding/OnboardingFlow.jsx';
import { TopNav } from './TopNav.jsx';

/**
 * Pages added in the Next.js app that are full-screen flows of their own.
 * They render outside the prototype shell, so a signed-out visitor to /signin
 * sees the sign-in page rather than being routed into prototype onboarding.
 */
const STANDALONE_ROUTES = ['/onboarding', '/signin', '/reset-password'];

export function AppShell({ children }) {
  const { role } = useRole();
  const pathname = usePathname() ?? '/';

  if (STANDALONE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return children;
  }

  // Same rule as the original prototype: no role yet means onboarding first.
  return role ? (
    <div className="min-h-screen bg-background">
      <TopNav />
      {children}
      <AssistantDock />
    </div>
  ) : (
    <OnboardingFlow />
  );
}

export default AppShell;
