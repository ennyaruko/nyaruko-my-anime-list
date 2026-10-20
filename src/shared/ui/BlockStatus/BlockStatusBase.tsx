import type { ReactNode, CSSProperties } from "react";

import clsx from "clsx";

import { Column } from "../Layout";
import { colors } from "../../styles";

import * as styles from "./BlockStatus.css";

const illustrationVariables = {
  "--illustration-text": colors.text.tertiary,
  "--illustration-detail": colors.background.elevation2,
  "--illustration-background": colors.background.elevation1,
} as CSSProperties;

export type BlockStatusBaseProps = {
  icon: ReactNode;
  title: ReactNode;
  className?: string;
  description: ReactNode;
};

export function BlockStatusBase({
  icon,
  title,
  className,
  description,
}: BlockStatusBaseProps) {
  return (
    <section
      style={illustrationVariables}
      className={clsx(styles.root, className)}
    >
      <div className={styles.icon}>{icon}</div>
      <Column wide gap="xxs" alignItem="center">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </Column>
    </section>
  );
}
