import { useRef, useEffect, useCallback, type ReactNode } from "react";

import useEmblaCarousel from "embla-carousel-react";

import { Heading } from "@/shared/ui";

import * as styles from "./MediaCarousel.css";

export type MediaCarouselProps<T> = {
  items: T[];
  title: ReactNode;
  isPending: boolean;
  hasNextPage: boolean;
  titleAction?: ReactNode;
  isFetchingNextPage: boolean;
  renderSkeleton: () => ReactNode;
  renderItem: (item: T) => ReactNode;
  getKey: (item: T) => string | number;
  onFetchNextPage: () => void | Promise<unknown>;
};

export function MediaCarousel<T>({
  items,
  title,
  getKey,
  isPending,
  renderItem,
  titleAction,
  hasNextPage,
  renderSkeleton,
  onFetchNextPage,
  isFetchingNextPage,
}: MediaCarouselProps<T>) {
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });
  const isFetchingMore = useRef(false);

  const requestNextPage = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage || isFetchingMore.current) return;

    isFetchingMore.current = true;
    void Promise.resolve(onFetchNextPage()).finally(() => {
      isFetchingMore.current = false;
    });
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  useEffect(() => {
    if (!emblaApi) return;

    const fetchNextPageAtEnd = () => {
      const lastSnapIndex = emblaApi.scrollSnapList().length - 1;
      if (
        lastSnapIndex >= 0 &&
        emblaApi.selectedScrollSnap() >= lastSnapIndex
      ) {
        requestNextPage();
      }
    };

    emblaApi.on("select", fetchNextPageAtEnd);
    return () => {
      emblaApi.off("select", fetchNextPageAtEnd);
    };
  }, [emblaApi, requestNextPage]);

  return (
    <section className={styles.section}>
      <Heading size="m" variant="neutral" action={titleAction}>
        {title}
      </Heading>
      <div ref={viewportRef} className={styles.viewport}>
        <div className={styles.track}>
          {isPending
            ? Array.from({ length: 3 }, (_, index) => (
                <div key={index} className={styles.slide}>
                  {renderSkeleton()}
                </div>
              ))
            : items.map((item) => (
                <div key={getKey(item)} className={styles.slide}>
                  {renderItem(item)}
                </div>
              ))}
          {isFetchingNextPage && (
            <div className={styles.slide}>{renderSkeleton()}</div>
          )}
        </div>
      </div>
    </section>
  );
}
