import { Link } from "react-router";

import { ArrowDownIcon } from "@/shared/icons";

import * as styles from "./BackLink.css";

export function BackLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className={styles.root}>
      <ArrowDownIcon className={styles.icon} />
      {children}
    </Link>
  );
}
