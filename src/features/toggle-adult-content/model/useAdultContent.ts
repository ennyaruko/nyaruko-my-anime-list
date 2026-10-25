import { useContext } from "react";

import { AdultContentContext } from "./adult-content-context";

export function useAdultContent() {
  const context = useContext(AdultContentContext);

  if (!context) {
    throw new Error("useAdultContent must be used within AdultContentProvider");
  }

  return context;
}
