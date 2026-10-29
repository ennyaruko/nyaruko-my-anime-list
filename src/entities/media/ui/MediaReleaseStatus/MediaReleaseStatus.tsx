import { useTranslation } from "react-i18next";

import { Status } from "@/shared/ui";

import { getMediaReleaseStatusInfo } from "./model";

import * as styles from "./MediaReleaseStatus.css";

export type MediaReleaseStatusProps = {
  size?: "s" | "m";
  className?: string;
  releaseStatus: null | string;
};

export function MediaReleaseStatus({
  className,
  size = "m",
  releaseStatus,
}: MediaReleaseStatusProps) {
  const { t } = useTranslation(["common"]);
  const statusInfo = getMediaReleaseStatusInfo(releaseStatus);

  if (!statusInfo) return null;

  return (
    <Status
      size={size}
      variant={statusInfo.variant}
      className={className ?? styles.status}
    >
      {t(statusInfo.labelKey)}
    </Status>
  );
}
