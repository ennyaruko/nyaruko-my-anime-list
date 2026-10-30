import { useTranslation } from "react-i18next";

import type { MediaAiringScheduleEntry } from "@/entities/media";

import { Heading, CollapsibleContent } from "@/shared/ui";

import * as styles from "./AiringSchedule.css";

export function AiringSchedule({
  entries,
}: {
  entries: MediaAiringScheduleEntry[];
}) {
  const { t, i18n } = useTranslation(["common"]);
  const locale = i18n.resolvedLanguage ?? i18n.language;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section className={styles.section} aria-labelledby="airing-schedule-title">
      <Heading
        variant="neutral"
        id="airing-schedule-title"
        className={styles.heading}
      >
        {t("common:watch.schedule")}
      </Heading>
      <CollapsibleContent
        collapsedHeight={240}
        expandLabel={t("common:table.showAll")}
        collapseLabel={t("common:table.showLess")}
      >
        <ol className={styles.list}>
          {entries.map(({ episode, airingAt }) => {
            const date = new Date(airingAt * 1000);

            return (
              <li className={styles.item} key={`${episode}:${airingAt}`}>
                <span className={styles.episode}>
                  {t("common:watch.scheduleEpisode", { number: episode })}
                </span>
                <time className={styles.time} dateTime={date.toISOString()}>
                  {t("common:watch.scheduleDateTime", {
                    date: dateFormatter.format(date),
                    time: timeFormatter.format(date),
                  })}
                </time>
              </li>
            );
          })}
        </ol>
      </CollapsibleContent>
    </section>
  );
}
