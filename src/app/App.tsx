import { useState, useEffect } from "react";

import { DialogDemo } from "@/shared/ui";
import { darkTheme, lightTheme } from "@/shared/styles";

import * as styles from "./styles.css";

type Theme = "dark" | "light";

export function App() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = document.documentElement;
    const activeTheme = theme === "dark" ? darkTheme : lightTheme;
    const inactiveTheme = theme === "dark" ? lightTheme : darkTheme;

    root.classList.remove(inactiveTheme);
    root.classList.add(activeTheme);
    root.style.colorScheme = theme;
  }, [theme]);

  return (
    <main className={styles.app}>
      <div className={styles.shell}>
        <div className={styles.eyebrow}>DESIGN SYSTEM</div>

        <h1 className={styles.title}>Radix + vanilla-extract</h1>

        <p className={styles.description}>
          Semantic light/dark themes, global static tokens and a real Radix
          primitive.
        </p>

        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.button}
            aria-pressed={theme === "light"}
            onClick={() => setTheme("light")}
          >
            Light
          </button>

          <button
            type="button"
            className={styles.button}
            aria-pressed={theme === "dark"}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>

          <DialogDemo />
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Theme contract</h2>
          <p className={styles.cardText}>
            Only one semantic theme class is switched on{" "}
            <code>&lt;html&gt;</code>. Radix portals inherit the same CSS
            variables automatically.
          </p>

          <div aria-hidden="true" className={styles.fadeDemo} />
        </section>
      </div>
    </main>
  );
}
