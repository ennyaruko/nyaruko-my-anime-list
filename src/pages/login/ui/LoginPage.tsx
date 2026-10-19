import { useTranslation } from "react-i18next";

import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/entities/auth";

import { queryCacheConfig } from "@/shared/lib";
import { Button, Column, Container } from "@/shared/ui";

import * as styles from "./LoginPage.css";

export function LoginPage() {
  const { t } = useTranslation(["common", "login"]);
  const {
    login,
    status,
    authError,
    sessionId,
    accessToken,
    clearAuthError,
    identityProvider,
  } = useAuth();
  const accountQuery = useQuery({
    retry: false,
    enabled:
      status === "authenticated" && Boolean(accessToken) && Boolean(sessionId),
    queryFn: ({ signal }) =>
      identityProvider.getCurrentAccount(accessToken!, signal),
    queryKey: queryCacheConfig.families.account.key(
      identityProvider.id,
      sessionId,
    ),
  });

  return (
    <Container as="main" className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <h1 id="login-title" className={styles.title}>
            {t("login:title")}
          </h1>
          <p className={styles.description}>{t("login:description")}</p>
        </header>

        <div className={styles.illustration} />
        <div className={styles.illustrationFade} />

        <Column wide tall gap="xxl" className={styles.login}>
          <Column gap="s">
            {authError && (
              <Column>
                <p role="alert" onClick={clearAuthError}>
                  {t("login:authFailed")}
                </p>
                <Button round size="l" onClick={() => accountQuery.refetch()}>
                  {t("login:retry")}
                </Button>
              </Column>
            )}
            <Button round size="l" onClick={login} variant="secondary">
              {t("login:continueWithProvider", {
                provider: identityProvider.displayName,
              })}
            </Button>
          </Column>
        </Column>
      </section>
    </Container>
  );
}

export default LoginPage;
