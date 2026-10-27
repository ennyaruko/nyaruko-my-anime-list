import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { Media } from "@/entities/media";

import { skeletonAnimation } from "@/shared/styles";
import { Row, Score, Status, Column, Heading } from "@/shared/ui";

import { formatLabelKey } from "../media-detail-labels";

import * as styles from "./MediaInformation.css";
import * as pageStyles from "../MediaDetailPage.css";

const releaseStatusVariant = {
  RELEASING: "info",
  FINISHED: "positive",
  CANCELLED: "negative",
  NOT_YET_RELEASED: "negative",
} as const;

const releaseStatusLabelKey = {
  FINISHED: "common:ui.filters.mediaStatus.finished",
  CANCELLED: "common:ui.filters.mediaStatus.cancelled",
  RELEASING: "common:ui.filters.mediaStatus.releasing",
  NOT_YET_RELEASED: "common:ui.filters.mediaStatus.announced",
} as const;

const sourceLabelKey = {
  GAME: "common:ui.filters.mediaSource.game",
  ANIME: "common:ui.filters.mediaSource.anime",
  COMIC: "common:ui.filters.mediaSource.comic",
  MANGA: "common:ui.filters.mediaSource.manga",
  NOVEL: "common:ui.filters.mediaSource.novel",
  OTHER: "common:ui.filters.mediaSource.other",
  ORIGINAL: "common:ui.filters.mediaSource.original",
  WEB_NOVEL: "common:ui.filters.mediaSource.webNovel",
  DOUJINSHI: "common:ui.filters.mediaSource.doujinshi",
  VIDEO_GAME: "common:ui.filters.mediaSource.videoGame",
  LIGHT_NOVEL: "common:ui.filters.mediaSource.lightNovel",
  LIVE_ACTION: "common:ui.filters.mediaSource.liveAction",
  PICTURE_BOOK: "common:ui.filters.mediaSource.pictureBook",
  VISUAL_NOVEL: "common:ui.filters.mediaSource.visualNovel",
  MULTIMEDIA_PROJECT: "common:ui.filters.mediaSource.multimediaProject",
} as const;

type MediaInformationProps = {
  language: string;
  media: Media | undefined;
};

export function MediaInformation({ media, language }: MediaInformationProps) {
  const { t } = useTranslation(["common"]);

  return (
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.info")}
      </Heading>
      {media ? (
        <MediaInformationContent media={media} language={language} />
      ) : (
        <MediaInformationSkeleton />
      )}
    </section>
  );
}

function MediaInformationContent({
  media,
  language,
}: {
  media: Media;
  language: string;
}) {
  const { t } = useTranslation(["common"]);
  const releaseStatus = media.releaseStatus;
  const releaseVariant = releaseStatus
    ? releaseStatusVariant[releaseStatus as keyof typeof releaseStatusVariant]
    : undefined;
  const releaseLabel = releaseStatus
    ? releaseStatusLabelKey[releaseStatus as keyof typeof releaseStatusLabelKey]
    : undefined;
  const startDate = formatDate(media.startDate, language);
  const endDate = formatDate(media.endDate, language);
  const dateRange =
    startDate && endDate
      ? t("common:mediaDetail.releaseRange", { end: endDate, start: startDate })
      : (startDate ??
        endDate ??
        (media.seasonYear
          ? t("common:mediaDetail.year", { year: media.seasonYear })
          : null));
  const formatKey = media.format
    ? formatLabelKey[media.format as keyof typeof formatLabelKey]
    : undefined;
  const sourceKey = media.source
    ? sourceLabelKey[media.source as keyof typeof sourceLabelKey]
    : undefined;
  const duration = media.duration
    ? ` (${new Intl.NumberFormat(language, {
        style: "unit",
        unit: "minute",
        unitDisplay: "long",
      }).format(media.duration)})`
    : "";

  return (
    <Column gap="xxs">
      <InfoRow label={t("common:mediaDetail.status")}>
        {releaseVariant && releaseLabel ? (
          <Status size="m" variant={releaseVariant}>
            {t(releaseLabel)}
          </Status>
        ) : (
          <span>—</span>
        )}
        {dateRange && <span className={styles.releaseDate}>({dateRange})</span>}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.score")}>
        {media.averageScore !== null ? (
          <Score size="m" shadow={false} value={media.averageScore / 10} />
        ) : (
          <span>—</span>
        )}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.genres")}>
        {media.genres.length > 0 ? (
          <span className={styles.genreList}>{media.genres.join(", ")}</span>
        ) : (
          <span>—</span>
        )}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.format")}>
        {formatKey ? t(formatKey) : (media.format ?? "—")}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.episodes")}>
        {media.episodes ? `${media.episodes}${duration}` : "—"}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.releaseDate")}>
        {startDate ??
          (media.seasonYear
            ? t("common:mediaDetail.year", { year: media.seasonYear })
            : "—")}
      </InfoRow>
      <InfoRow label={t("common:mediaDetail.source")}>
        {sourceKey ? t(sourceKey) : (media.source ?? "—")}
      </InfoRow>
    </Column>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Row gap="xxs" className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{children}</span>
    </Row>
  );
}

function MediaInformationSkeleton() {
  return (
    <div className={styles.skeletonLines}>
      {Array.from({ length: 7 }, (_, index) => (
        <span
          key={index}
          className={clsx(styles.infoSkeletonLine, skeletonAnimation)}
        />
      ))}
    </div>
  );
}

function formatDate(date: Media["startDate"], language: string): null | string {
  if (!date?.year) return null;
  const parts = [date.day, date.month, date.year].filter(
    (part): part is number => typeof part === "number",
  );
  if (parts.length < 3) return String(date.year);

  return new Intl.DateTimeFormat(language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date.year, (date.month ?? 1) - 1, date.day ?? 1));
}
