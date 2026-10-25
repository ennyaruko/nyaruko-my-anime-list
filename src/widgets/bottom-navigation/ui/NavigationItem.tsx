import type { ReactNode } from "react";
import { NavLink } from "react-router";

import clsx from "clsx";

import * as styles from "./NavigationItem.css";

export type NavigationItemProps = {
  to: string;
  end?: boolean;
  label: string;
  icon: ReactNode;
};

export function NavigationItem({
  to,
  icon,
  label,
  end = false,
}: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        clsx(styles.root, {
          [styles.state.active]: isActive,
          [styles.state.default]: !isActive,
        })
      }
    >
      {icon}
      <span className={styles.label}>{label}</span>
    </NavLink>
  );
}
