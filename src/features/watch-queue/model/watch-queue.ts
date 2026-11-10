import { useContext, createContext } from "react";

import type { Media } from "@/entities/media";

export type WatchQueueContextValue = {
  items: Media[];
  clearQueue: VoidFunction;
  selectedMedia: null | Media;
  pickRandomMedia: VoidFunction;
  addMedia: (media: Media) => void;
  removeMedia: (mediaId: number) => void;
};

export const WatchQueueContext = createContext<null | WatchQueueContextValue>(
  null,
);

export function useWatchQueueContext() {
  const context = useContext(WatchQueueContext);
  if (!context) throw new Error("WatchQueueProvider is missing");
  return context;
}
