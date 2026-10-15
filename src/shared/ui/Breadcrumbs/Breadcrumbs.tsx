import { Link } from "react-router";
import type { To } from "react-router";
import type { HTMLAttributes } from "react";

import clsx from "clsx";

import * as styles from "./Breadcrumbs.css";

export type Breadcrumb = { to?: To; label: string };
export type BreadcrumbsProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  items: Breadcrumb[];
};

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav {...props} className={clsx(styles.root, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <li className={styles.item} key={`${item.label}-${index}`}>
              {item.to && !isCurrent ? (
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.active}>{item.label}</span>
              )}
              {!isCurrent && <span className={styles.separator}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
