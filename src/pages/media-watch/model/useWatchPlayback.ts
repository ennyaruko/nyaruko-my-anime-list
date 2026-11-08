import { useRef, useState, useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { useAdultContent } from "@/features/toggle-adult-content";
import { useMediaListActions } from "@/features/manage-media-list";
import { useWatchContinuation } from "@/features/watch-continuation";

import {
  type MediaDetail,
  initialPlaybackEpisode,
  mediaPlaybackServiceToken,
  progressAfterEpisodeChange,
  progressAfterWatchPageExit,
  statusAfterPlaybackProgress,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";

import { useWatchPageExit } from "./useWatchPageExit";
import { getPlaybackTracks } from "./playback-tracks";

export function useWatchPlayback(
  detail: MediaDetail,
  userId: string | undefined,
) {
  const { media } = detail;
  const { mode: contentMode } = useAdultContent();
  const { continuation, saveContinuation, clearContinuation } =
    useWatchContinuation(userId);
  const service = useAppService(mediaPlaybackServiceToken);
  const actions = useMediaListActions(userId);
  const catalogQuery = useQuery({
    retry: false,
    throwOnError: false,
    refetchOnWindowFocus: false,
    meta: { errorNotifier: () => null },
    queryFn: ({ signal }) => service.getCatalog(detail, signal),
    queryKey: queryCacheConfig.families.mediaPlayback.key(media.id),
  });
  const embedsQuery = useQuery({
    retry: false,
    throwOnError: false,
    meta: { errorNotifier: () => null },
    queryFn: ({ signal }) =>
      service.getEmbedPlayers(media.id, detail.malId, signal),
    queryKey: queryCacheConfig.families.playbackEmbeds.key(
      media.id,
      detail.malId,
    ),
  });

  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [forceFallback, setForceFallback] = useState(false);
  const [playerId, setPlayerId] = useState<string>();
  const [trackId, setTrackId] = useState<string>();
  const [embedId, setEmbedId] = useState<string>();
  const [episode, setEpisode] = useState(() =>
    initialPlaybackEpisode(media.progress ?? 0, media.episodes),
  );
  const [savedEntry, setSavedEntry] = useState({
    status: media.status,
    progress: media.progress ?? 0,
  });
  const [saving, setSaving] = useState(false);
  const [restoredMediaId, setRestoredMediaId] = useState<null | number>(null);
  const progressPending = useRef(false);

  const progress = Math.max(media.progress ?? 0, savedEntry.progress);
  const status =
    savedEntry.progress > (media.progress ?? 0)
      ? savedEntry.status
      : media.status;
  const catalog =
    !forceFallback && catalogQuery.data?.players.length
      ? catalogQuery.data
      : undefined;
  const primaryRu = language === "ru" && Boolean(catalog);
  const allTracks = catalog ? getPlaybackTracks(catalog) : [];
  const selectedTrackId = trackId ?? allTracks[0]?.id;
  const player =
    catalog?.players.find(
      (item) =>
        item.id === playerId &&
        item.tracks.some((candidate) => candidate.id === selectedTrackId),
    ) ??
    catalog?.players.find((item) =>
      item.tracks.some((candidate) => candidate.id === selectedTrackId),
    ) ??
    catalog?.players[0];
  const track =
    player?.tracks.find((item) => item.id === selectedTrackId) ??
    player?.tracks[0];
  const trackPlayers = catalog?.players.filter((item) =>
    item.tracks.some((candidate) => candidate.id === track?.id),
  );
  const availableEmbeds =
    embedsQuery.data?.filter((item) => item.language === language) ?? [];
  useEffect(() => {
    if (
      catalog ||
      language !== "ru" ||
      embedsQuery.isPending ||
      (!forceFallback && catalogQuery.isPending)
    )
      return;

    const hasRussianEmbed = embedsQuery.data?.some(
      (item) => item.language === "ru",
    );
    const hasEnglishEmbed = embedsQuery.data?.some(
      (item) => item.language === "en",
    );

    if (!hasRussianEmbed && hasEnglishEmbed) setLanguage("en");
  }, [
    catalog,
    catalogQuery.isPending,
    embedsQuery.data,
    embedsQuery.isPending,
    forceFallback,
    language,
  ]);
  const embed =
    availableEmbeds.find((item) => item.id === embedId) ?? availableEmbeds[0];
  const total = media.episodes || catalog?.episodes || null;
  const selectedEpisode = Math.min(episode, total ?? Infinity);
  const canSelectEpisodes = primaryRu || Boolean(embed?.supportsEpisodes);
  const episodes = primaryRu
    ? (track?.episodes.map((item) => item.number) ?? [])
    : Array.from(
        { length: total ?? Math.max(progress + 1, selectedEpisode + 1) },
        (_, index) => index + 1,
      );
  const src = primaryRu
    ? track?.episodes.find((item) => item.number === selectedEpisode)?.url
    : embed?.urlTemplate.replaceAll(":episode", String(selectedEpisode));
  const waitingForContinuation = Boolean(
    continuation?.mediaId === media.id &&
    continuation.userId === userId &&
    restoredMediaId !== media.id,
  );
  const loading =
    (!forceFallback && catalogQuery.isPending) ||
    (!primaryRu && embedsQuery.isPending) ||
    waitingForContinuation;

  useEffect(() => {
    if (
      !userId ||
      !continuation ||
      continuation.mediaId !== media.id ||
      continuation.userId !== userId ||
      restoredMediaId === media.id
    )
      return;

    if (continuation.source === "yummyani") {
      if (catalogQuery.isPending) return;

      const savedTrack = allTracks.find(
        (item) => item.id === continuation.trackId,
      );
      const savedPlayer = catalog?.players.find(
        (item) =>
          item.id === continuation.playerId &&
          item.tracks.some((candidate) => candidate.id === savedTrack?.id),
      );
      const matchingPlayer =
        savedPlayer ??
        catalog?.players.find((item) =>
          item.tracks.some((candidate) => candidate.id === savedTrack?.id),
        );

      if (savedTrack && matchingPlayer) {
        const fallbackEpisode = initialPlaybackEpisode(
          progress,
          media.episodes || catalog?.episodes || null,
        );
        const availableEpisodes = savedTrack.episodes.map(
          (item) => item.number,
        );
        const restoredEpisode = availableEpisodes.includes(continuation.episode)
          ? continuation.episode
          : (availableEpisodes.find((number) => number >= fallbackEpisode) ??
            availableEpisodes.at(-1) ??
            fallbackEpisode);

        setLanguage("ru");
        setForceFallback(false);
        setTrackId(savedTrack.id);
        setPlayerId(matchingPlayer.id);
        setEpisode(restoredEpisode);
      }

      setRestoredMediaId(media.id);
      return;
    }

    if (continuation.source === "embed") {
      if (embedsQuery.isPending) return;

      const savedEmbed = embedsQuery.data?.find(
        (item) =>
          item.id === continuation.embedId &&
          item.language === "en" &&
          item.supportsEpisodes,
      );

      if (savedEmbed) {
        const total = media.episodes || catalogQuery.data?.episodes || null;
        setLanguage("en");
        setForceFallback(false);
        setEmbedId(savedEmbed.id);
        setEpisode(Math.min(continuation.episode, total ?? Infinity));
      }

      setRestoredMediaId(media.id);
      return;
    }

    if (embedsQuery.isPending) return;

    const kodik = embedsQuery.data?.find(
      (item) => item.id === continuation.embedId && item.language === "ru",
    );
    if (kodik) {
      setLanguage("ru");
      setForceFallback(true);
      setEmbedId(kodik.id);
    }
    setRestoredMediaId(media.id);
  }, [
    allTracks,
    catalog,
    catalogQuery.data,
    catalogQuery.isPending,
    continuation,
    embedsQuery.data,
    embedsQuery.isPending,
    media.episodes,
    media.id,
    progress,
    restoredMediaId,
    userId,
  ]);

  useEffect(() => {
    if (
      !userId ||
      contentMode === "hentai" ||
      loading ||
      primaryRu ||
      language !== "ru" ||
      embed?.id !== "playerKodikRu" ||
      !src
    )
      return;

    saveContinuation({
      userId,
      contentMode,
      source: "kodik",
      mediaId: media.id,
      embedId: "playerKodikRu",
    });
  }, [
    contentMode,
    embed?.id,
    language,
    loading,
    media.id,
    primaryRu,
    saveContinuation,
    src,
    userId,
  ]);

  function saveSelectedPlayback(nextEpisode: number) {
    if (!userId || contentMode === "hentai" || !src) return;

    if (!primaryRu && language === "ru" && embed?.id === "playerKodikRu") {
      saveContinuation({
        userId,
        contentMode,
        source: "kodik",
        mediaId: media.id,
        embedId: "playerKodikRu",
      });
      return;
    }

    if (primaryRu && player && track) {
      saveContinuation({
        userId,
        contentMode,
        mediaId: media.id,
        trackId: track.id,
        source: "yummyani",
        playerId: player.id,
        episode: nextEpisode,
      });
      return;
    }

    if (language === "en" && embed?.supportsEpisodes) {
      saveContinuation({
        userId,
        contentMode,
        language: "en",
        source: "embed",
        mediaId: media.id,
        embedId: embed.id,
        episode: nextEpisode,
      });
    }
  }

  useWatchPageExit(() => {
    if (!src || loading || progressPending.current || !actions.canManageList)
      return;
    const nextProgress = progressAfterWatchPageExit(
      progress,
      selectedEpisode,
      total,
    );
    const returnsToDetails = window.location.pathname === `/media/${media.id}`;
    if (nextProgress === progress) {
      if (
        total !== null &&
        progress >= total &&
        continuation?.mediaId === media.id &&
        returnsToDetails
      )
        clearContinuation();
      return;
    }
    const completesAnime =
      total !== null &&
      nextProgress >= total &&
      continuation?.mediaId === media.id &&
      returnsToDetails;
    void actions
      .updateProgressAsync(media.id, nextProgress, {
        keepalive: true,
        status: statusAfterPlaybackProgress(status, nextProgress, total),
      })
      .then(() => {
        if (completesAnime) clearContinuation();
      })
      .catch(() => undefined);
  });

  async function selectEpisode(next: number) {
    if (progressPending.current || next === selectedEpisode) return;
    const nextProgress = src
      ? progressAfterEpisodeChange(progress, selectedEpisode, next)
      : progress;
    if (nextProgress > progress) {
      progressPending.current = true;
      setSaving(true);
      try {
        const nextStatus = statusAfterPlaybackProgress(
          status,
          nextProgress,
          total,
        );
        await actions.updateProgressAsync(media.id, nextProgress, {
          status: nextStatus,
        });
        setSavedEntry({ status: nextStatus, progress: nextProgress });
      } catch {
        return;
      } finally {
        progressPending.current = false;
        setSaving(false);
      }
    }
    setEpisode(next);
    saveSelectedPlayback(next);
  }

  function selectTrack(id: string) {
    setTrackId(id);
    if (!player?.tracks.some((candidate) => candidate.id === id))
      setPlayerId(undefined);
  }

  function selectPlayer(id: string) {
    const selectedPlayer = catalog?.players.find((item) => item.id === id);
    setPlayerId(id);
    if (
      selectedPlayer &&
      track &&
      !selectedPlayer.tracks.some((candidate) => candidate.id === track.id)
    )
      setTrackId(selectedPlayer.tracks[0]?.id);
  }

  return {
    src,
    embed,
    track,
    total,
    player,
    saving,
    catalog,
    loading,
    episodes,
    language,
    progress,
    allTracks,
    primaryRu,
    setEmbedId,
    setLanguage,
    selectTrack,
    trackPlayers,
    selectPlayer,
    forceFallback,
    selectEpisode,
    availableEmbeds,
    selectedEpisode,
    setForceFallback,
    canSelectEpisodes,
    catalogFetching: catalogQuery.isFetching,
    catalogAvailable: Boolean(catalogQuery.data?.players.length),
    retryCatalog: () => {
      setForceFallback(false);
      void catalogQuery.refetch();
    },
  };
}

export type WatchPlaybackModel = ReturnType<typeof useWatchPlayback>;
