import { createContext } from "react";

export type DrawerContextValue = { close: VoidFunction };

export const DrawerContext = createContext<null | DrawerContextValue>(null);
