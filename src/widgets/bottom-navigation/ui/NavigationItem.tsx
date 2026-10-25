import { NavLink } from "react-router";
import type { ReactNode, MouseEventHandler } from "react";

import clsx from "clsx";

import * as styles from "./NavigationItem.css";

export type NavigationItemProps = {
  to: string;
  end?: boolean;
  label: string;
  icon: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export function NavigationItem({
  to,
  icon,
  label,
  onClick,
  end = false,
}: NavigationItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
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
