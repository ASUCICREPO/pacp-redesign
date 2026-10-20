import { createContext, useContext, useState } from 'react';

export const AssistantContext = createContext({
  open: !1,
  setOpen: () => {},
  toggle: () => {}
});

export function AssistantProvider({
  children: i
}) {
  const [n, o] = useState(!1),
    s = () => o(c => !c);
  return <AssistantContext.Provider value={{
    open: n,
    setOpen: o,
    toggle: s
  }}>{i}</AssistantContext.Provider>;
}

export function useAssistant() {
  return useContext(AssistantContext);
}
