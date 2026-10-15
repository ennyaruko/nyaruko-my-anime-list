import type { ReactNode } from "react";
import "react-toastify/dist/ReactToastify.css";
import { Meta, Links, Outlet, Scripts, ScrollRestoration } from "react-router";

import { lightTheme } from "@/shared/styles";
import { NotificationContainer } from "@/shared/ui";

import "./global.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru" className={lightTheme} style={{ colorScheme: "light" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta content="#10131a" name="theme-color" />
        <meta
          name="description"
          content="UI Kit для Anime List на React и TypeScript"
        />
        <Meta />
        <Links />
        <title>Anime List</title>
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
