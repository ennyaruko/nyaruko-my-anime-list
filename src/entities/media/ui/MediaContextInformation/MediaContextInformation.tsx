import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Fragment, type ReactNode } from "react";

import { Button } from "@/shared/ui";
import { ArrowDownIcon } from "@/shared/icons";

import type { Media } from "../../model/media";
import { MediaReleaseStatus } from "../MediaReleaseStatus";

import * as styles from "./MediaContextInformation.css";

export type MediaContextInformationProps = {
  media?: Media;
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rows?: Array<{ label: string; value: ReactNode }>;
};

export function MediaContextInformation({
  rows,
  media,
  title,
  onBack,
  showBack = false,
}: MediaContextInformationProps) {
  const { t, i18n } = useTranslation(["common"]);
  const episodeDuration = media?.duration
    ? ` (${new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language, {
        style: "unit",
        unit: "minute",
        unitDisplay: "long",
      }).format(media.duration)})`
    : "";

  return (
    <div className={styles.root}>
      {showBack && (
        <Button
          variant="flat"
          onClick={onBack}
          leftIcon={<ArrowDownIcon />}
          className={styles.backButton}
        >
          {t("mediaDetail.back")}
        </Button>
      )}
      <div className={styles.title}>{media?.title ?? title}</div>
      {media ? (
        <>
          <InformationRow label={t("common:mediaDetail.status")}>
            <MediaReleaseStatus size="s" releaseStatus={media.releaseStatus} />
          </InformationRow>
          <InformationRow label={t("common:mediaDetail.genres")}>
            {media.genres.length > 0 ? (
              <span className={styles.genres}>
                {media.genres.map((genre, index) => (
                  <Fragment key={genre}>
                    {index > 0 && ", "}
                    <Link
                      className={styles.genreLink}
                      to={`/search?genre=${encodeURIComponent(genre)}`}
                    >
                      {genre}
                    </Link>
                  </Fragment>
                ))}
              </span>
            ) : (
              "—"
            )}
          </InformationRow>
          <InformationRow label={t("common:mediaDetail.episodes")}>
            {media.episodes ? `${media.episodes}${episodeDuration}` : "—"}
          </InformationRow>
        </>
      ) : (
        rows?.map(({ label, value }) => (
          <InformationRow key={label} label={label}>
            {value}
          </InformationRow>
        ))
      )}
    </div>
  );
}

function InformationRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{children}</span>
    </div>
  );
}
