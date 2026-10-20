import { AssistantProvider } from '../context/AssistantContext.jsx';
import { RoleProvider } from '../context/RoleContext.jsx';
import { AppShell } from './AppShell.jsx';

export function RootLayout({ children }) {
  return (
    <RoleProvider>
      <AssistantProvider>
        <AppShell>{children}</AppShell>
      </AssistantProvider>
    </RoleProvider>
  );
}

export default RootLayout;
