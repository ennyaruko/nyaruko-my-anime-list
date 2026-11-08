import { useContext, createContext } from "react";

import type { MediaContentMode } from "@/entities/media";

type WatchContinuationBase = {
  userId: string;
  mediaId: number;
  contentMode: Exclude<MediaContentMode, "hentai">;
};

export type WatchContinuation =
  | (WatchContinuationBase & {
      source: "kodik";
      embedId: "playerKodikRu";
    })
  | (WatchContinuationBase & {
      language: "en";
      source: "embed";
      episode: number;
      embedId: string;
    })
  | (WatchContinuationBase & {
      episode: number;
      trackId: string;
      playerId: string;
      source: "yummyani";
    });

export type WatchContinuationContextValue = {
  clearContinuation: VoidFunction;
  continuation: null | WatchContinuation;
  saveContinuation: (continuation: WatchContinuation) => void;
};

export const WatchContinuationContext =
  createContext<null | WatchContinuationContextValue>(null);

export function useWatchContinuation(userId?: string) {
  const context = useContext(WatchContinuationContext);
  if (!context) throw new Error("WatchContinuationProvider is missing");

  return {
    ...context,
    continuation:
      context.continuation?.userId === userId ? context.continuation : null,
  };
}
