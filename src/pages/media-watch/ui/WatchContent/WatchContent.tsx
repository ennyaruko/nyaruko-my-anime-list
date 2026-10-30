import { MediaRelations } from "@/widgets/media-relations";

import type { MediaDetail } from "@/entities/media";

import { ComponentErrorBoundary } from "@/shared/ui";

import { WatchOrder } from "../WatchOrder";
import { WatchComments } from "../WatchComments";
import { AiringSchedule } from "../AiringSchedule";
import { WatchPlayerSection } from "../WatchPlayerSection";
import { useWatchPlayback } from "../../model/useWatchPlayback";

import * as styles from "./WatchContent.css";

export function WatchContent({
  detail,
  userId,
}: {
  detail: MediaDetail;
  userId: string | undefined;
}) {
  const { media } = detail;
  const playback = useWatchPlayback(detail, userId);

  return (
    <>
      <h1 className={styles.title}>{playback.catalog?.title ?? media.title}</h1>
      <ComponentErrorBoundary resetKeys={[media.id]}>
        <WatchPlayerSection playback={playback} mediaTitle={media.title} />
      </ComponentErrorBoundary>
      {media.releaseStatus === "RELEASING" &&
        detail.airingSchedule.length > 0 && (
          <ComponentErrorBoundary resetKeys={[media.id]}>
            <AiringSchedule entries={detail.airingSchedule} />
          </ComponentErrorBoundary>
        )}
      {playback.catalog ? (
        <>
          <ComponentErrorBoundary resetKeys={[media.id]}>
            <WatchOrder catalog={playback.catalog} />
          </ComponentErrorBoundary>
          <ComponentErrorBoundary resetKeys={[playback.catalog.id]}>
            <WatchComments
              key={playback.catalog.id}
              catalogId={playback.catalog.id}
            />
          </ComponentErrorBoundary>
        </>
      ) : (
        !playback.loading && (
          <ComponentErrorBoundary resetKeys={[media.id]}>
            <MediaRelations userId={userId} mediaId={media.id} />
          </ComponentErrorBoundary>
        )
      )}
    </>
  );
}
