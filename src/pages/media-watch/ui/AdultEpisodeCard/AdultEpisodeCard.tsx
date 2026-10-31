import { useTranslation } from "react-i18next";

import clsx from "clsx";

import type { AdultVideo } from "@/entities/adult-anime";
import { MediaContextInformation } from "@/entities/media";

import { Image, Score, Status } from "@/shared/ui";
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
  const cardTitle = `${video.title} - Ep. ${video.episode}`;

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
            <Score size="s" value={video.rating} className={styles.score} />
          </span>
          <span title={cardTitle} className={styles.title}>
            {cardTitle}
          </span>
          <Status size="s" variant={video.censored ? "negative" : "positive"}>
            {t(
              video.censored
                ? "common:watch.adultCensored"
                : "common:watch.adultUncensored",
            )}
          </Status>
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent style={{ width: "min(260px, calc(100vw - 24px))" }}>
        <MediaContextInformation
          title={video.title}
          rows={[
            {
              value: video.episode,
              label: t("common:watch.adultEpisodeLabel"),
            },
            {
              label: t("common:watch.adultTags"),
              value: video.tags.join(", ") || "—",
            },
            {
              value: video.duration || "—",
              label: t("common:watch.adultDuration"),
            },
            {
              value: video.quality || "—",
              label: t("common:watch.adultQuality"),
            },
            {
              value: video.language || "—",
              label: t("common:watch.adultLanguage"),
            },
          ]}
        />
      </ContextMenuContent>
    </ContextMenu>
  );
}
