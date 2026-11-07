import { useState } from "react";
import { useSearchParams } from "react-router";

import type { Media } from "@/entities/media";

const dialogSearchParam = "watch-queue";

export function useWatchQueue() {
  const [items, setItems] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<null | Media>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get(dialogSearchParam) === "1";

  const addMedia = (media: Media) => {
    setItems((currentItems) =>
      currentItems.some(({ id }) => id === media.id)
        ? currentItems
        : [...currentItems, media],
    );
  };

  const removeMedia = (mediaId: number) => {
    setItems((currentItems) => currentItems.filter(({ id }) => id !== mediaId));
    setSelectedMedia((currentMedia) =>
      currentMedia?.id === mediaId ? null : currentMedia,
    );
  };

  const clearQueue = () => {
    setItems([]);
    setSelectedMedia(null);
  };

  const pickRandomMedia = () => {
    if (items.length === 0) return;

    const randomIndex = Math.floor(Math.random() * items.length);
    setSelectedMedia(items[randomIndex] ?? null);
  };

  const openDialog = () => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.set(dialogSearchParam, "1");
        return nextParams;
      },
      { preventScrollReset: true },
    );
  };

  const closeDialog = () => {
    setSearchParams(
      (currentParams) => {
        const nextParams = new URLSearchParams(currentParams);
        nextParams.delete(dialogSearchParam);
        return nextParams;
      },
      { replace: true, preventScrollReset: true },
    );
  };

  return {
    items,
    isOpen,
    addMedia,
    clearQueue,
    openDialog,
    closeDialog,
    removeMedia,
    selectedMedia,
    pickRandomMedia,
  };
}
