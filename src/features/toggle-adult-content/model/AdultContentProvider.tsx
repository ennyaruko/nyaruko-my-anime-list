import { useState, type ReactNode } from "react";

import { AdultContentContext } from "./adult-content-context";

export type { AdultContentContextValue } from "./adult-content-context";

export type AdultContentProviderProps = {
  children: ReactNode;
};

export function AdultContentProvider({ children }: AdultContentProviderProps) {
  const [enabled, setEnabled] = useState(true);

  return (
    <AdultContentContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </AdultContentContext.Provider>
  );
}
