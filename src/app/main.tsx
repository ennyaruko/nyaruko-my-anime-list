import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { lightTheme } from "@/shared/styles";

import { App } from "./App";

import "./global.css";
import "./styles.css.ts";

// Keep the theme class on <html>, just like App's theme switcher.
// Applying it to #root would override the inherited dark-theme CSS variables.
const htmlElement = document.documentElement;
htmlElement.classList.add(lightTheme);
htmlElement.style.colorScheme = "light";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root was not found");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
