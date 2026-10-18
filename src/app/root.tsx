import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import { AuthProvider } from "@/entities/auth";

import i18n from "@/shared/i18n";
import { lightTheme } from "@/shared/styles";
import { NotificationContainer } from "@/shared/ui";

import { QueryProvider, AppServicesProvider } from "./providers";

import "./global.css";

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation(["common"]);
  const language = i18n.resolvedLanguage ?? "ru";

  return (
    <html
      lang={language}
      className={lightTheme}
      style={{ colorScheme: "light" }}
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
    <QueryProvider>
      <AppServicesProvider>
        <AuthProvider>
          <Outlet />
          <NotificationContainer />
        </AuthProvider>
      </AppServicesProvider>
    </QueryProvider>
  );
}
