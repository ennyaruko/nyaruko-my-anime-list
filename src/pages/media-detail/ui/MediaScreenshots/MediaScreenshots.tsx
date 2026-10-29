import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Lightbox from "yet-another-react-lightbox";
import useEmblaCarousel from "embla-carousel-react";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";

import type { Media, MediaScreenshot } from "@/entities/media";

import { Heading } from "@/shared/ui";

import { useMediaScreenshots } from "../../model/useMediaScreenshots";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

import * as styles from "./MediaScreenshots.css";
import * as pageStyles from "../MediaDetailPage.css";

type ScreenshotImage = MediaScreenshot & { title: string };

type MediaScreenshotsProps = {
  media: Media | undefined;
  malId: null | number | undefined;
};

export function MediaScreenshots({ media, malId }: MediaScreenshotsProps) {
  const { t } = useTranslation(["common"]);
  const screenshotsQuery = useMediaScreenshots({
    fallbackMalId: malId,
    mediaId: media?.id ?? 0,
  });
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const images = useMemo(() => {
    if (!media) return [];

    const values: ScreenshotImage[] = [];
    const seen = new Set<string>();
    const addImage = (url: null | string | undefined, preview?: string) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      values.push({
        original: url,
        title: media.title,
        preview: preview ?? url,
      });
    };

    addImage(media.bannerImage ?? undefined);
    screenshotsQuery.data?.forEach(({ preview, original }) =>
      addImage(original, preview),
    );

    return values;
  }, [media, screenshotsQuery.data]);
  const isPending = screenshotsQuery.isPending;

  if (!media || (images.length === 0 && !isPending)) return null;

  return (
    <section className={pageStyles.section}>
      <Heading size="m" variant="neutral">
        {t("common:mediaDetail.screenshots")}
      </Heading>
      {images.length > 0 ? (
        <ScreenshotStrip images={images} onSelect={setSelectedIndex} />
      ) : (
        <div className={styles.skeletonTrack}>
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.skeleton} />
          ))}
        </div>
      )}
      <ScreenshotLightbox
        images={images}
        selectedIndex={selectedIndex}
        onSelectedIndexChange={setSelectedIndex}
      />
    </section>
  );
}

function ScreenshotStrip({
  images,
  onSelect,
}: {
  images: ScreenshotImage[];
  onSelect: (index: number) => void;
}) {
  const [viewportRef] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div className={styles.track}>
        {images.map((image, index) => (
          <div className={styles.slide} key={`${image.original}-${index}`}>
            <button
              type="button"
              title={image.title}
              onClick={() => onSelect(index)}
              className={styles.thumbnailButton}
            >
              <img
                loading="lazy"
                alt={image.title}
                src={image.preview}
                className={styles.thumbnail}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenshotLightbox({
  images,
  selectedIndex,
  onSelectedIndexChange,
}: {
  images: ScreenshotImage[];
  selectedIndex: null | number;
  onSelectedIndexChange: (index: null | number) => void;
}) {
  const { t } = useTranslation(["common"]);
  const slides = useMemo(
    () =>
      images.map(({ original, title: imageTitle }) => ({
        src: original,
        alt: imageTitle,
      })),
    [images],
  );

  return (
    <Lightbox
      slides={slides}
      plugins={[Counter, Zoom]}
      index={selectedIndex ?? 0}
      className={styles.lightbox}
      close={() => onSelectedIndexChange(null)}
      controller={{ closeOnBackdropClick: true }}
      open={selectedIndex !== null && images.length > 0}
      on={{
        view: ({ index }) => onSelectedIndexChange(index),
      }}
      labels={{
        Next: t("common:mediaDetail.nextScreenshot"),
        Close: t("common:mediaDetail.closeScreenshots"),
        "Zoom in": t("common:mediaDetail.zoomInScreenshot"),
        Previous: t("common:mediaDetail.previousScreenshot"),
        "Zoom out": t("common:mediaDetail.zoomOutScreenshot"),
        "{index} of {total}": t("common:mediaDetail.screenshotCounter", {
          index: "{index}",
          total: "{total}",
        }),
      }}
    />
  );
}
