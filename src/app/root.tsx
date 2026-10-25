import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, type ReactNode } from "react";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import { THEME_STORAGE_KEY } from "@/features/change-theme";

import { darkTheme, lightTheme } from "@/shared/styles";
import { GlobalErrorFallback, NotificationContainer } from "@/shared/ui";
import i18n, { LOCALE_STORAGE_KEY, supportedLanguages } from "@/shared/i18n";

import { Providers } from "./providers";

import "./styles/global.css";

const themeInitializerScript = `
  (function() {
    let storedTheme = null;
    try {
      storedTheme = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    } catch {}
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = storedTheme === "dark" || (storedTheme !== "light" && prefersDark);

    document.documentElement.classList.add(isDark ? "${darkTheme}" : "${lightTheme}");

    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", isDark ? "#151719" : "#FFFFFF");
  })();
`;

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation(["common"]);
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

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta content="#10131a" name="theme-color" />
        <meta name="description" content={t("common:description")} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
        />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
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
      <div className="app">
        <Outlet />
      </div>
      <NotificationContainer />
    </Providers>
  );
}

export function ErrorBoundary() {
  return <GlobalErrorFallback />;
}
