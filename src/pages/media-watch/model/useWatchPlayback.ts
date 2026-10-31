import { useRef, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { useMediaListActions } from "@/features/manage-media-list";

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
  const service = useAppService(mediaPlaybackServiceToken);
  const actions = useMediaListActions(userId);
  const catalogQuery = useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    meta: { errorNotifier: () => null },
    queryFn: ({ signal }) => service.getCatalog(detail, signal),
    queryKey: queryCacheConfig.families.mediaPlayback.key(media.id),
  });
  const embedsQuery = useQuery({
    retry: false,
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
  const loading =
    (!forceFallback && catalogQuery.isPending) ||
    (!primaryRu && embedsQuery.isPending);

  useWatchPageExit(() => {
    if (!src || loading || progressPending.current || !actions.canManageList)
      return;
    const nextProgress = progressAfterWatchPageExit(
      progress,
      selectedEpisode,
      total,
    );
    if (nextProgress === progress) return;
    void actions
      .updateProgressAsync(media.id, nextProgress, {
        keepalive: true,
        status: statusAfterPlaybackProgress(status, nextProgress, total),
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
