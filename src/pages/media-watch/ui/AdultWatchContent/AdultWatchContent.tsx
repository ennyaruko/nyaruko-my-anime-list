import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useShikimoriMediaInfo } from "@/features/shikimori-media-info";

import type { MediaDetail } from "@/entities/media";
import type { AdultVideo, AdultVideoSource } from "@/entities/adult-anime";

import { Column } from "@/shared/ui";

import { AdultEpisodeList } from "../AdultEpisodeList";
import { AdultVideoPlayer } from "../AdultVideoPlayer";
import { useAdultAnimeVideos } from "../../model/useAdultAnimeVideos";

import * as styles from "./AdultWatchContent.css";

export function AdultWatchContent({ detail }: { detail: MediaDetail }) {
  const { t } = useTranslation(["common"]);
  const [selectedId, setSelectedId] = useState<string>();
  const [source, setSource] = useState<AdultVideoSource>("hentai-tv");
  const title = detail.media.title;
  const shikimoriInfoQuery = useShikimoriMediaInfo({ detail });
  const videosQuery = useAdultAnimeVideos(
    [title, shikimoriInfoQuery.data?.shikimoriTitle ?? ""],
    source,
    !shikimoriInfoQuery.isPending,
  );
  const selectedVideo = videosQuery.data?.find(
    (video) => video.id === selectedId,
  );

  const selectVideo = (video: AdultVideo) => setSelectedId(video.id);
  const selectSource = (nextSource: AdultVideoSource) => {
    setSource(nextSource);
    setSelectedId(undefined);
  };

  return (
    <Column gap="xl" className={styles.content}>
      <h1 className={styles.title}>{title}</h1>
      <AdultEpisodeList
        source={source}
        onSelect={selectVideo}
        selectedId={selectedId}
        onSourceChange={selectSource}
        isError={videosQuery.isError}
        videos={videosQuery.data ?? []}
        isLoading={videosQuery.isPending}
        onRetry={() => void videosQuery.refetch()}
      />
      <AdultVideoPlayer title={title} source={source} video={selectedVideo} />
      <span role="status" aria-live="polite" className={styles.srOnly}>
        {selectedVideo
          ? t("common:watch.adultSelectedEpisode", {
              number: selectedVideo.episode,
            })
          : ""}
      </span>
    </Column>
  );
}
