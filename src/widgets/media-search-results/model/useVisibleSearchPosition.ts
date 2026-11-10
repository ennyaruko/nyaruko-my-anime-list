import { useCallback } from "react";
import type { RefObject } from "react";

import type { SearchPosition } from "@/features/search-position";

export type UseVisibleSearchPositionOptions = {
  containerRef: RefObject<null | HTMLDivElement>;
};

export type UseVisibleSearchPositionResult = {
  captureAnchor: () => null | Pick<SearchPosition, "lastPage" | "lastAnime">;
};

export function useVisibleSearchPosition({
  containerRef,
}: UseVisibleSearchPositionOptions): UseVisibleSearchPositionResult {
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

  return { captureAnchor };
}
