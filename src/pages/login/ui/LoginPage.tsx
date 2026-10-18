import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { LocaleSwitcher } from "@/features/change-language";

import { useAuth } from "@/entities/auth";

import { queryKeys } from "@/shared/api";
import { Button, Column, Spinner, Container } from "@/shared/ui";

import * as styles from "./LoginPage.css";

export function LoginPage() {
  const { t } = useTranslation(["common", "login"]);
  const {
    login,
    status,
    logout,
    authError,
    sessionId,
    accessToken,
    clearAuthError,
    identityProvider,
  } = useAuth();
  const accountQuery = useQuery({
    retry: false,
    staleTime: 5 * 60 * 1000,
    queryKey: queryKeys.account(identityProvider.id, sessionId),
    enabled:
      status === "authenticated" && Boolean(accessToken) && Boolean(sessionId),
    queryFn: ({ signal }) =>
      identityProvider.getCurrentAccount(accessToken!, signal),
  });

  const handleLogout = () => void logout();

  return (
    <Container as="main" className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.toolbar}>
            <LocaleSwitcher />
          </div>
          <h1 id="login-title" className={styles.title}>
            {status === "authenticated" && accountQuery.data
              ? t("login:connectedTitle")
              : t("login:title")}
          </h1>
          <p className={styles.description}>
            {status === "authenticated" && accountQuery.data
              ? t("login:connectedDescription")
              : t("login:description")}
          </p>
        </header>

        <div className={styles.illustration} />
        <div className={styles.illustrationFade} />

        <Column wide tall gap="xxl" className={styles.login}>
          {status === "initializing" && <Spinner />}
          {status === "anonymous" && (
            <Column gap="s">
              {authError && (
                <p role="alert" onClick={clearAuthError}>
                  {t("login:authFailed")}
                </p>
              )}
              <Button round size="l" onClick={login} variant="secondary">
                {t("login:continueWithProvider", {
                  provider: identityProvider.displayName,
                })}
              </Button>
            </Column>
          )}
          {status === "authenticated" && accountQuery.isPending && <Spinner />}
          {status === "authenticated" && accountQuery.isError && (
            <Column gap="s">
              <p role="alert">{t("login:accountLoadFailed")}</p>
              <Button
                round
                size="l"
                onClick={() => void accountQuery.refetch()}
              >
                {t("login:retry")}
              </Button>
              <Button
                round
                size="l"
                variant="flat"
                onClick={() => void handleLogout()}
              >
                {t("login:logout")}
              </Button>
            </Column>
          )}
          {status === "authenticated" && accountQuery.data && (
            <Column gap="m">
              {accountQuery.data.avatarUrl && (
                <img
                  alt=""
                  width={72}
                  height={72}
                  src={accountQuery.data.avatarUrl}
                  style={{ objectFit: "cover", borderRadius: "50%" }}
                />
              )}
              <p>
                {t("login:signedInAs", {
                  username: accountQuery.data.username,
                })}
              </p>
              {accountQuery.data.profileUrl && (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={accountQuery.data.profileUrl}
                >
                  {t("login:openProfile")}
                </a>
              )}
              <Button
                round
                size="l"
                variant="secondary"
                onClick={() => void handleLogout()}
              >
                {t("login:logout")}
              </Button>
            </Column>
          )}
        </Column>
      </section>
    </Container>
  );
}

export default LoginPage;
