import type { ReactNode } from "react";

import clsx from "clsx";

import { Row, Column } from "@/shared/ui";
import { NoImageIcon } from "@/shared/icons";

import * as styles from "./AccountIdentity.css";

export type AccountIdentityProps = {
  name?: string;
  className?: string;
  content?: ReactNode;
  trailing?: ReactNode;
  avatarUrl?: null | string;
};

export type AccountIdentitySkeletonProps = {
  className?: string;
};

/** Compact account identity used by reviews and other user-authored content. */
export function AccountIdentity({
  name,
  content,
  trailing,
  avatarUrl,
  className,
}: AccountIdentityProps) {
  const isPlaceholder = !avatarUrl;

  return (
    <div className={clsx(styles.root, className)}>
      <div className={styles.avatar}>
        {avatarUrl && !isPlaceholder ? (
          <img
            alt=""
            loading="lazy"
            src={avatarUrl}
            className={styles.avatarImage}
          />
        ) : (
          <NoImageIcon className={styles.noImageIcon} />
        )}
      </div>
      <Column
        gap="normal"
        className={styles.info}
        justifyContent="space-between"
      >
        <Row gap="xxs" justifyContent="space-between">
          <span className={styles.name}>{name}</span>
          {trailing}
        </Row>
        {content && <div className={styles.content}>{content}</div>}
      </Column>
    </div>
  );
}

/** Loading placeholder for an account identity row. */
export function AccountIdentitySkeleton({
  className,
}: AccountIdentitySkeletonProps) {
  return (
    <div className={clsx(styles.root, styles.skeleton, className)}>
      <span className={styles.avatarSkeleton} />
      <span className={styles.infoSkeleton}>
        <span className={styles.nameSkeleton} />
        <span className={styles.contentSkeleton} />
      </span>
    </div>
  );
}
