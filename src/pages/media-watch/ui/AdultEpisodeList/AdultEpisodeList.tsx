import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { MediaCarousel } from "@/widgets/media-carousel";

import type { AdultVideo, AdultVideoSource } from "@/entities/adult-anime";

import { Heading, ModeControls } from "@/shared/ui";
import { skeletonAnimation } from "@/shared/styles";

import { AdultEpisodeCard } from "../AdultEpisodeCard";

import * as styles from "./AdultEpisodeList.css";

type AdultEpisodeListProps = {
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  videos: AdultVideo[];
  source: AdultVideoSource;
  selectedId: string | undefined;
  onSelect: (video: AdultVideo) => void;
  onSourceChange: (source: AdultVideoSource) => void;
};

export function AdultEpisodeList({
  videos,
  source,
  isError,
  onRetry,
  onSelect,
  isLoading,
  selectedId,
  onSourceChange,
}: AdultEpisodeListProps) {
  const { t } = useTranslation(["common"]);
  const title = t("common:watch.adultEpisodes");
  const sortedVideos = [...videos].sort(
    (first, second) => first.episode - second.episode,
  );
  const sourceControls = (
    <ModeControls
      value={source}
      options={SOURCE_OPTIONS}
      onChange={onSourceChange}
    />
  );

  if (isError) {
    return (
      <section className={styles.section}>
        <Heading variant="neutral" action={sourceControls}>
          {title}
        </Heading>
        <div role="alert" className={styles.message}>
          <p className={styles.messageText}>
            {t("common:watch.adultEpisodesLoadFailed")}
          </p>
          <button type="button" onClick={onRetry} className={styles.retry}>
            {t("common:watch.retry")}
          </button>
        </div>
      </section>
    );
  }

  if (!isLoading && videos.length === 0) {
    return (
      <section className={styles.section}>
        <Heading variant="neutral" action={sourceControls}>
          {title}
        </Heading>
        <div className={styles.empty}>
          <span aria-hidden="true" className={styles.emptyMark}>
            ···
          </span>
          <p className={styles.emptyText}>
            {t("common:watch.adultNoEpisodes")}
          </p>
        </div>
      </section>
    );
  }

  return (
    <MediaCarousel
      title={title}
      hasNextPage={false}
      items={sortedVideos}
      isPending={isLoading}
      isFetchingNextPage={false}
      titleAction={sourceControls}
      getKey={(video) => video.id}
      onFetchNextPage={() => undefined}
      renderSkeleton={() => <EpisodeSkeleton />}
      renderItem={(video) => (
        <AdultEpisodeCard
          video={video}
          onSelect={() => onSelect(video)}
          selected={video.id === selectedId}
          dimmed={Boolean(selectedId && video.id !== selectedId)}
        />
      )}
    />
  );
}

const SOURCE_OPTIONS: { label: string; value: AdultVideoSource }[] = [
  { value: "hentai-tv", label: "Hentai TV" },
  { label: "MuchoHentai", value: "mucho-hentai" },
];

function EpisodeSkeleton() {
  return (
    <div aria-hidden="true" className={styles.skeleton}>
      <div className={clsx(styles.skeletonCover, skeletonAnimation)} />
      <div className={clsx(styles.skeletonTitle, skeletonAnimation)} />
      <div className={clsx(styles.skeletonRating, skeletonAnimation)} />
    </div>
  );
}
