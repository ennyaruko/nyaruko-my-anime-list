import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, type ReactNode } from "react";
import {
  Meta,
  Links,
  Outlet,
  Scripts,
  useLocation,
  ScrollRestoration,
} from "react-router";

import { THEME_STORAGE_KEY } from "@/features/change-theme";

import { darkTheme, lightTheme } from "@/shared/styles";
import i18n, { LOCALE_STORAGE_KEY, supportedLanguages } from "@/shared/i18n";
import {
  QueryErrorBoundary,
  GlobalErrorFallback,
  NotificationContainer,
} from "@/shared/ui";

import { Providers } from "./providers";

import "./styles/global.css";

const SITE_URL = "https://nyar1othotep.github.io/my-anime-list/";

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
        <link
          rel="manifest"
          href={`${import.meta.env.BASE_URL}manifest.webmanifest`}
        />
        <link
          rel="icon"
          sizes="any"
          href={`${import.meta.env.BASE_URL}favicon.ico`}
        />
        <link
          rel="icon"
          sizes="32x32"
          type="image/png"
          href={`${import.meta.env.BASE_URL}favicon-32x32.png`}
        />
        <link
          rel="icon"
          sizes="48x48"
          type="image/png"
          href={`${import.meta.env.BASE_URL}favicon-48x48.png`}
        />
        <link
          rel="icon"
          sizes="16x16"
          type="image/png"
          href={`${import.meta.env.BASE_URL}favicon-16x16.png`}
        />
        <link
          sizes="180x180"
          rel="apple-touch-icon"
          href={`${import.meta.env.BASE_URL}apple-touch-icon.png`}
        />
        <link rel="canonical" href={SITE_URL} />
        <base href={import.meta.env.BASE_URL} />
        <meta content="MyAnimeList" name="application-name" />
        <meta content="MyAnimeList" name="apple-mobile-web-app-title" />
        <meta content="#10131a" name="theme-color" />
        <meta name="description" content={t("common:description")} />
        <meta
          property="og:locale"
          content={language === "ru" ? "ru_RU" : "en_US"}
        />
        <meta content="website" property="og:type" />
        <meta property="og:title" content={t("common:title")} />
        <meta property="og:description" content={t("common:description")} />
        <meta
          property="og:image"
          content={`${SITE_URL}android-chrome-512x512.png`}
        />
        <meta content="512" property="og:image:width" />
        <meta content="512" property="og:image:height" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:site_name" content={t("common:title")} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("common:title")} />
        <meta name="twitter:description" content={t("common:description")} />
        <meta
          name="twitter:image"
          content={`${SITE_URL}android-chrome-512x512.png`}
        />
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
  const location = useLocation();

  return (
    <Providers>
      <div className="app">
        <QueryErrorBoundary size="l" resetKeys={[location.key]}>
          <Outlet />
        </QueryErrorBoundary>
      </div>
      <NotificationContainer />
    </Providers>
  );
}

export function ErrorBoundary() {
  return <GlobalErrorFallback />;
}
