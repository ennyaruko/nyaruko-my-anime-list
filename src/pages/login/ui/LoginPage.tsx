import { useTranslation } from "react-i18next";

import { useAuth } from "@/entities/auth";

import { Button, Column, Container } from "@/shared/ui";

import * as styles from "./LoginPage.css";

export function LoginPage() {
  const { t } = useTranslation(["common"]);
  const { login, authError, identityProvider } = useAuth();

  return (
    <Container as="main" className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <h1 id="login-title" className={styles.title}>
            {t("common:login.title")}
          </h1>
          <p className={styles.description}>{t("common:login.description")}</p>
        </header>

        <div className={styles.illustration} />
        <div className={styles.illustrationFade} />

        <Column wide tall gap="xxl" className={styles.login}>
          <Column gap="s">
            {authError && (
              <Column>
                <p role="alert">{t("common:login.authFailed")}</p>
                <Button round size="l" onClick={login}>
                  {t("common:login.retry")}
                </Button>
              </Column>
            )}
            <Button round size="l" onClick={login} variant="secondary">
              {t("common:login.continueWithProvider", {
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
