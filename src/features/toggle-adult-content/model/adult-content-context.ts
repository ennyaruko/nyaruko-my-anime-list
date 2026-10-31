import { createContext } from "react";

export type AdultContentContextValue = {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export const AdultContentContext =
  createContext<null | AdultContentContextValue>(null);
