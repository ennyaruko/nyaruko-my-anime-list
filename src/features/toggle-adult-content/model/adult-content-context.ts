import { createContext } from "react";

import type { MediaContentMode } from "@/entities/media";

export type AdultContentContextValue = {
  mode: MediaContentMode;
  setMode: (mode: MediaContentMode) => void;
};

export const AdultContentContext =
  createContext<null | AdultContentContextValue>(null);
