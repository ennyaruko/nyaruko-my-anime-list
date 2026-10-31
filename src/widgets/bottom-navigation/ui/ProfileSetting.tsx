import type { ReactNode } from "react";

import * as styles from "./ProfileSetting.css";

export type ProfileSettingProps = {
  label: string;
  children: ReactNode;
};

export function ProfileSetting({ label, children }: ProfileSettingProps) {
  return (
    <label className={styles.root}>
      {children}
      <span className={styles.label}>{label}</span>
    </label>
  );
}
