import { useMemo, useState, useCallback, type PropsWithChildren } from "react";

import type { Media } from "@/entities/media";

import { WatchQueueContext } from "./watch-queue";

export function WatchQueueProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<Media[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<null | Media>(null);

  const addMedia = useCallback((media: Media) => {
    setItems((currentItems) =>
      currentItems.some(({ id }) => id === media.id)
        ? currentItems
        : [...currentItems, media],
    );
  }, []);

  const removeMedia = useCallback((mediaId: number) => {
    setItems((currentItems) => currentItems.filter(({ id }) => id !== mediaId));
    setSelectedMedia((currentMedia) =>
      currentMedia?.id === mediaId ? null : currentMedia,
    );
  }, []);

  const clearQueue = useCallback(() => {
    setItems([]);
    setSelectedMedia(null);
  }, []);

  const pickRandomMedia = useCallback(() => {
    if (items.length === 0) return;

    const randomIndex = Math.floor(Math.random() * items.length);
    setSelectedMedia(items[randomIndex] ?? null);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      addMedia,
      clearQueue,
      removeMedia,
      selectedMedia,
      pickRandomMedia,
    }),
    [items, selectedMedia, addMedia, removeMedia, clearQueue, pickRandomMedia],
  );

  return (
    <WatchQueueContext.Provider value={value}>
      {children}
    </WatchQueueContext.Provider>
  );
}
