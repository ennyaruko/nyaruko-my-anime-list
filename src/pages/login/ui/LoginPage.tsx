import { Link } from "react-router";
import { useTranslation } from "react-i18next";

import { LocaleSwitcher } from "@/features/change-language";

import { Button, Column, Container } from "@/shared/ui";

import { LoginForm } from "./LoginForm";

import * as styles from "./LoginPage.css";

export function LoginPage() {
  const { t } = useTranslation(["login"]);

  return (
    <Container as="main" className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <div className={styles.toolbar}>
            <LocaleSwitcher />
          </div>
          <h1 id="login-title" className={styles.title}>
            {t("login:title")}
          </h1>
          <p className={styles.description}>{t("login:description")}</p>
        </header>

        <div className={styles.illustration} />
        <div className={styles.illustrationFade} />

        <Column wide tall gap="xxl" className={styles.login}>
          <LoginForm onSubmit={() => {}}>
            <Button round size="l" type="submit" variant="secondary">
              {t("login:submit")}
            </Button>
          </LoginForm>
          <p className={styles.registerPrompt}>
            {t("login:noAccount")} <Link to="/register">{t("login:register")}</Link>
          </p>
        </Column>
      </section>
    </Container>
  );
}

export default LoginPage;
