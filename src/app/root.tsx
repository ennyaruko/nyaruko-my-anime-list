import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "react-toastify/dist/ReactToastify.css";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import i18n from "@/shared/i18n";
import { lightTheme } from "@/shared/styles";
import { NotificationContainer } from "@/shared/ui";

import "./global.css";

export function Layout({ children }: { children: ReactNode }) {
  const { t } = useTranslation(["common"]);
  const language = i18n.resolvedLanguage ?? "ru";

  return (
    <html lang={language} className={lightTheme} style={{ colorScheme: "light" }}>
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
    <>
      <Outlet />
      <NotificationContainer />
    </>
  );
}
