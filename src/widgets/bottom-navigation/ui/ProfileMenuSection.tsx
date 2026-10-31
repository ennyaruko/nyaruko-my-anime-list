import type { ReactNode } from "react";

import * as styles from "./ProfileMenuSection.css";

export type ProfileMenuSectionProps = {
  title: string;
  children: ReactNode;
};

export function ProfileMenuSection({
  title,
  children,
}: ProfileMenuSectionProps) {
  return (
    <section className={styles.root}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  );
}
