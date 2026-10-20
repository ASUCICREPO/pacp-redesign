import { createContext, useContext, useEffect, useState } from 'react';

export const RoleContext = createContext(null);

export const ROLE_STORAGE_KEY = "pacp_user_role";

export const TASKS_STORAGE_KEY = "pacp_user_tasks";

export function RoleProvider({
  children: i
}) {
  const [n, o] = useState(() => localStorage.getItem(ROLE_STORAGE_KEY) ?? null),
    [s, c] = useState(() => {
      try {
        const p = localStorage.getItem(TASKS_STORAGE_KEY);
        return p ? JSON.parse(p) : [];
      } catch {
        return [];
      }
    }),
    u = p => {
      localStorage.setItem(ROLE_STORAGE_KEY, p), o(p);
    },
    h = p => {
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(p)), c(p);
    },
    f = () => {
      localStorage.removeItem(ROLE_STORAGE_KEY), localStorage.removeItem(TASKS_STORAGE_KEY), o(null), c([]);
    };
  // The Next.js sign-in and onboarding pages write the role outside this
  // provider. The layout stays mounted across client navigation, so re-read
  // storage when they announce a change rather than only on first mount.
  useEffect(() => {
    const sync = () => {
      o(localStorage.getItem(ROLE_STORAGE_KEY) ?? null);
      try {
        const p = localStorage.getItem(TASKS_STORAGE_KEY);
        c(p ? JSON.parse(p) : []);
      } catch {
        c([]);
      }
    };
    window.addEventListener('pacp:user-changed', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('pacp:user-changed', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);
  return <RoleContext.Provider value={{
    role: n,
    setRole: u,
    clearRole: f,
    selectedTasks: s,
    setTasks: h
  }}>{i}</RoleContext.Provider>;
}

export function useRole() {
  const i = useContext(RoleContext);
  if (!i) throw new Error("useRole must be used inside RoleProvider");
  return i;
}
