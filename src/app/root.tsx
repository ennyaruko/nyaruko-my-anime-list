import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, type ReactNode } from "react";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import { darkTheme, lightTheme } from "@/shared/styles";
import { GlobalErrorFallback, NotificationContainer } from "@/shared/ui";
import i18n, { LOCALE_STORAGE_KEY, supportedLanguages } from "@/shared/i18n";

import { Providers } from "./providers";

import "./global.css";

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation(["common"]);
  const [prefersDarkTheme, setPrefersDarkTheme] = useState(false);
  const language = i18n.resolvedLanguage ?? "ru";

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    const detectedLanguage =
      storedLanguage ?? window.navigator.language.split("-")[0];
    if (
      typeof detectedLanguage === "string" &&
      detectedLanguage !== language &&
      supportedLanguages.some((language) => language === detectedLanguage)
    ) {
      void i18n.changeLanguage(detectedLanguage);
    }
  }, [language]);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setPrefersDarkTheme(preference.matches);

    updateTheme();
    preference.addEventListener("change", updateTheme);
    return () => preference.removeEventListener("change", updateTheme);
  }, []);

  return (
    <html
      lang={language}
      className={prefersDarkTheme ? darkTheme : lightTheme}
      style={{ colorScheme: prefersDarkTheme ? "dark" : "light" }}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="#10131a" name="theme-color" />
        <meta name="description" content={t("common:description")} />
        <Meta />
        <Links />
        <title>{t("common:title")}</title>
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return (
    <Providers>
      <Outlet />
      <NotificationContainer />
    </Providers>
  );
}

export function ErrorBoundary() {
  return <GlobalErrorFallback />;
}
