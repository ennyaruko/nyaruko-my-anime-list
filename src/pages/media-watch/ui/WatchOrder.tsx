import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";

import {
  type PlaybackCatalog,
  mediaPlaybackServiceToken,
} from "@/entities/media";

import { useAppService } from "@/shared/lib";
import { Status, Heading, showNotification } from "@/shared/ui";

import * as styles from "./MediaWatch.css";

export function WatchOrder({ catalog }: { catalog: PlaybackCatalog }) {
  const { t } = useTranslation(["common"]);
  const service = useAppService(mediaPlaybackServiceToken);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const controller = useRef<null | AbortController>(null);
  useEffect(() => () => controller.current?.abort(), []);

  async function open(id: string) {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    setPending(true);
    try {
      const mediaId = await service.resolveMediaId(id, request.signal);
      request.signal.throwIfAborted();
      if (!mediaId) throw new Error("No matching AniList record");
      void navigate(`/media/${mediaId}/watch`);
    } catch {
      if (!request.signal.aborted)
        showNotification(t("common:watch.relatedFailed"), "error");
    } finally {
      if (!request.signal.aborted) setPending(false);
    }
  }

  return (
    <section className={styles.section}>
      <Heading variant="neutral">{t("common:watch.next")}</Heading>
      <ol className={styles.order}>
        {catalog.order.map((item) => (
          <li key={item.id} className={styles.orderRow}>
            <div className={styles.orderContent}>
              <div>
                {item.id === catalog.id ? (
                  <span aria-current="true" className={styles.orderTitle}>
                    {item.title}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={pending}
                    className={styles.link}
                    onClick={() => void open(item.id)}
                  >
                    <span className={styles.orderLinkTitle}>{item.title}</span>
                  </button>
                )}
                {[item.format, item.description, item.year].filter(Boolean)
                  .length > 0 && (
                  <span className={styles.orderDescription}>
                    {" "}
                    —{" "}
                    {[item.format, item.description, item.year]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                )}
              </div>
              <Status
                variant={
                  item.status === "released"
                    ? "positive"
                    : item.status === "ongoing"
                      ? "info"
                      : "negative"
                }
              />
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
