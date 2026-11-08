import type { RefObject } from "react";
import { useState, useEffect, useCallback } from "react";

import type { SearchPosition } from "@/features/search-position";

export type UseVisibleSearchPositionOptions = {
  resetKey: string;
  baselinePage: number;
  containerRef: RefObject<null | HTMLDivElement>;
};

export type UseVisibleSearchPositionResult = {
  furthestVisiblePage: number;
  captureAnchor: () => null | Pick<SearchPosition, "lastPage" | "lastAnime">;
};

export function useVisibleSearchPosition({
  resetKey,
  baselinePage,
  containerRef,
}: UseVisibleSearchPositionOptions): UseVisibleSearchPositionResult {
  const [furthestVisiblePage, setFurthestVisiblePage] = useState(baselinePage);

  const captureAnchor = useCallback(() => {
    const visibleCards = Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>(
        "[data-search-anime]",
      ) ?? [],
    )
      .map((node) => ({ node, rect: node.getBoundingClientRect() }))
      .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
      .sort(
        (first, second) =>
          first.rect.top - second.rect.top ||
          first.rect.left - second.rect.left,
      );
    const card = visibleCards[0]?.node;
    const lastAnime = Number(card?.dataset.searchAnime);
    const lastPage = Number(card?.dataset.searchPage);
    return lastAnime && lastPage ? { lastPage, lastAnime } : null;
  }, [containerRef]);

  useEffect(() => {
    setFurthestVisiblePage(baselinePage);
  }, [baselinePage, resetKey]);

  useEffect(() => {
    const updateFurthestVisiblePage = () => {
      const visiblePages = Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(
          "[data-search-page]",
        ) ?? [],
      )
        .filter((node) => {
          const rect = node.getBoundingClientRect();
          return rect.bottom > 0 && rect.top < window.innerHeight;
        })
        .map((node) => Number(node.dataset.searchPage))
        .filter((page) => Number.isSafeInteger(page) && page > 0);

      if (visiblePages.length) {
        setFurthestVisiblePage((current) => Math.max(current, ...visiblePages));
      }
    };

    updateFurthestVisiblePage();
    window.addEventListener("scroll", updateFurthestVisiblePage, {
      passive: true,
    });
    window.addEventListener("resize", updateFurthestVisiblePage);

    const observer = new MutationObserver(updateFurthestVisiblePage);
    if (containerRef.current) {
      observer.observe(containerRef.current, {
        subtree: true,
        childList: true,
      });
    }

    return () => {
      window.removeEventListener("scroll", updateFurthestVisiblePage);
      window.removeEventListener("resize", updateFurthestVisiblePage);
      observer.disconnect();
    };
  }, [containerRef]);

  return { captureAnchor, furthestVisiblePage };
}
