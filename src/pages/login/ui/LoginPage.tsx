import { Link } from "react-router";

import { Button, Column, Container } from "@/shared/ui";

import { LoginForm } from "./LoginForm";

import * as styles from "./LoginPage.css";

export function LoginPage() {
  return (
    <Container as="main" className={styles.page}>
      <section className={styles.content}>
        <header className={styles.header}>
          <h1 id="login-title" className={styles.title}>
            Авторизация
          </h1>
          <p className={styles.description}>
            На данной странице вы сможете авторизоваться на нашем сайте.
          </p>
        </header>

        <div className={styles.illustration} />
        <div className={styles.illustrationFade} />

        <Column wide tall gap="xxl" className={styles.login}>
          <LoginForm onSubmit={() => {}}>
            <Button round size="l" type="submit" variant="secondary">
              Войти
            </Button>
          </LoginForm>
          <p className={styles.registerPrompt}>
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </p>
        </Column>
      </section>
    </Container>
  );
}

export default LoginPage;
