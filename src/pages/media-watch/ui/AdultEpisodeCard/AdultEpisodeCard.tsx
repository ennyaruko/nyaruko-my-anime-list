import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { AdultVideo } from "@/entities/adult-anime";

import { Image, Score } from "@/shared/ui";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/shared/ui";

import * as styles from "./AdultEpisodeCard.css";

type AdultEpisodeCardProps = {
  dimmed: boolean;
  video: AdultVideo;
  selected: boolean;
  onSelect: () => void;
};

export function AdultEpisodeCard({
  video,
  dimmed,
  selected,
  onSelect,
}: AdultEpisodeCardProps) {
  const { t } = useTranslation(["common"]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={clsx(styles.card, dimmed && styles.dimmed)}
        >
          <span className={styles.cover}>
            <Image
              loading="lazy"
              alt={video.title}
              image={{ url: video.cover }}
              className={styles.coverImage}
            />
            <Score size="m" value={video.rating} className={styles.score} />
          </span>
          <span title={video.title} className={styles.title}>
            {video.title}
          </span>
          <span
            className={clsx(
              styles.contentRating,
              video.censored ? styles.censored : styles.uncensored,
            )}
          >
            {t(
              video.censored
                ? "common:watch.adultCensored"
                : "common:watch.adultUncensored",
            )}
          </span>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className={styles.contextContent}>
        <strong className={styles.contextTitle}>{video.title}</strong>
        <InfoRow
          value={String(video.episode)}
          label={t("common:watch.adultEpisode")}
        />
        <InfoRow
          label={t("common:watch.adultTags")}
          value={video.tags.join(", ") || "—"}
        />
        <InfoRow
          value={video.duration || "—"}
          label={t("common:watch.adultDuration")}
        />
        <InfoRow
          value={video.quality || "—"}
          label={t("common:watch.adultQuality")}
        />
        <InfoRow
          value={video.language || "—"}
          label={t("common:watch.adultLanguage")}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  );
}
