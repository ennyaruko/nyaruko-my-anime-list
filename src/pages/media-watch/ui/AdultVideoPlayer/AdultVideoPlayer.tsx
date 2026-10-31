import { useTranslation } from "react-i18next";

import type { AdultVideo } from "@/entities/adult-anime";

import { Heading, EmbedFrame } from "@/shared/ui";

import * as styles from "./AdultVideoPlayer.css";

export function AdultVideoPlayer({
  title,
  video,
}: {
  title: string;
  video: undefined | AdultVideo;
}) {
  const { t } = useTranslation(["common"]);

  return (
    <section className={styles.section}>
      <Heading variant="neutral">{t("common:watch.adultVideoPlayer")}</Heading>
      {video ? (
        <EmbedFrame
          src={video.embedUrl}
          title={`${title} — ${t("common:watch.adultEpisode", { number: video.episode })}`}
        />
      ) : (
        <div role="status" className={styles.placeholder}>
          <span aria-hidden="true" className={styles.playMark}>
            ▶
          </span>
          <strong>{t("common:watch.adultChooseEpisode")}</strong>
          <span className={styles.hint}>
            {t("common:watch.adultPlayerHint")}
          </span>
        </div>
      )}
    </section>
  );
}
