import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";

import { MediaRelations } from "@/widgets/media-relations";

import { useMediaListActions } from "@/features/manage-media-list";
import { ContentLanguageControls } from "@/features/translate-content";

import { useAuth } from "@/entities/auth";
import {
  type MediaDetail,
  initialPlaybackEpisode,
  mediaDetailServiceToken,
  mediaPlaybackServiceToken,
  progressAfterEpisodeChange,
} from "@/entities/media";

import { useAppService, queryCacheConfig } from "@/shared/lib";
import {
  Column,
  Header,
  Button,
  Heading,
  BackLink,
  Combobox,
  Container,
  EmbedFrame,
} from "@/shared/ui";

import { WatchOrder } from "./WatchOrder";
import { WatchComments } from "./WatchComments";

import * as styles from "./MediaWatch.css";

export function MediaWatchPage({
  userId,
  mediaId,
}: {
  mediaId: number;
  userId: string | undefined;
}) {
  const { t } = useTranslation(["common"]);
  const { accessToken } = useAuth();
  const service = useAppService(mediaDetailServiceToken);
  const query = useQuery({
    queryFn: ({ signal }) =>
      service.getMediaDetail(accessToken!, mediaId, signal),
    queryKey: queryCacheConfig.families.mediaDetail.key(
      userId ?? "unknown",
      mediaId,
    ),
    enabled: Boolean(
      accessToken && userId && Number.isSafeInteger(mediaId) && mediaId > 0,
    ),
  });
  return (
    <Container as="main" className={styles.page}>
      <Column gap="xl">
        <Header
          variant="plain"
          leading={<BackLink>{t("common:mediaDetail.back")}</BackLink>}
        />
        {query.data ? (
          <WatchContent
            userId={userId}
            detail={query.data}
            key={`${userId}:${mediaId}`}
          />
        ) : query.isError || !Number.isSafeInteger(mediaId) || mediaId <= 0 ? (
          <div role="alert">
            {t("common:watch.loadFailed")}
            <Button variant="flat" onClick={() => void query.refetch()}>
              {t("common:watch.retry")}
            </Button>
          </div>
        ) : (
          <p role="status">{t("common:loading")}</p>
        )}
      </Column>
    </Container>
  );
}

function WatchContent({
  detail,
  userId,
}: {
  detail: MediaDetail;
  userId: string | undefined;
}) {
  const { t } = useTranslation(["common"]);
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
  const embeds = useQuery({
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
  const [savedProgress, setSavedProgress] = useState(media.progress ?? 0);
  const [saving, setSaving] = useState(false);
  const progressPending = useRef(false);
  const progress = Math.max(media.progress ?? 0, savedProgress);
  const catalog =
    !forceFallback && catalogQuery.data?.players.length
      ? catalogQuery.data
      : undefined;
  const primaryRu = language === "ru" && Boolean(catalog);
  const allTracks = catalog
    ? (() => {
        const tracks = new Map(
          catalog.players
            .flatMap((item) => item.tracks)
            .map((item) => [item.id, item]),
        );
        for (const player of catalog.players) {
          for (const candidate of player.tracks) {
            const current = tracks.get(candidate.id);
            if (current && candidate.views > current.views)
              tracks.set(candidate.id, candidate);
          }
        }
        return [...tracks.values()].sort((a, b) => {
          const aIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(a.name);
          const bIsSubtitle = /субтитр|\bsubtitles?\b|\bsubs?\b/i.test(b.name);
          if (aIsSubtitle !== bIsSubtitle) return aIsSubtitle ? 1 : -1;
          return b.views - a.views;
        });
      })()
    : [];
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
    embeds.data?.filter((item) => item.language === language) ?? [];
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
    (!primaryRu && embeds.isPending);

  async function selectEpisode(next: number) {
    if (progressPending.current || next === selectedEpisode) return;
    const nextProgress = src
      ? progressAfterEpisodeChange(progress, selectedEpisode, next)
      : progress;
    if (nextProgress > progress) {
      progressPending.current = true;
      setSaving(true);
      try {
        await actions.updateProgressAsync(media.id, nextProgress);
        setSavedProgress(nextProgress);
      } catch {
        return;
      } finally {
        progressPending.current = false;
        setSaving(false);
      }
    }
    setEpisode(next);
  }

  return (
    <>
      <h1 className={styles.title}>{catalog?.title ?? media.title}</h1>
      <section className={styles.section}>
        <Heading
          variant="neutral"
          action={
            <ContentLanguageControls
              language={language}
              onChange={setLanguage}
            />
          }
        >
          {t("common:watch.players")}
        </Heading>
        {loading ? (
          <p role="status">{t("common:loading")}</p>
        ) : (
          <>
            {primaryRu && player && track ? (
              <div className={styles.controls}>
                <div className={styles.select}>
                  <label htmlFor="playback-track" className={styles.srOnly}>
                    {t("common:watch.track")}
                  </label>
                  <Combobox
                    value={track.id}
                    searchable={false}
                    id="playback-track"
                    onValueChange={(id) => {
                      setTrackId(id);
                      setPlayerId(undefined);
                    }}
                    options={allTracks.map((item) => ({
                      value: item.id,
                      label: t("common:watch.trackEpisodes", {
                        name: item.name,
                        count: item.episodes.length,
                      }),
                    }))}
                  />
                </div>
                <div className={styles.select}>
                  <label htmlFor="playback-player" className={styles.srOnly}>
                    {t("common:watch.player")}
                  </label>
                  <Combobox
                    value={player.id}
                    searchable={false}
                    id="playback-player"
                    options={(trackPlayers ?? catalog!.players).map((item) => ({
                      value: item.id,
                      label: item.name,
                    }))}
                    onValueChange={(id) => {
                      const selectedPlayer = catalog!.players.find(
                        (item) => item.id === id,
                      );
                      setPlayerId(id);
                      setTrackId(selectedPlayer?.tracks[0]?.id);
                    }}
                  />
                </div>
              </div>
            ) : language === "en" && embed ? (
              <div className={styles.controls}>
                <div className={styles.select}>
                  <label htmlFor="playback-embed" className={styles.srOnly}>
                    {t("common:watch.player")}
                  </label>
                  <Combobox
                    value={embed.id}
                    searchable={false}
                    id="playback-embed"
                    onValueChange={setEmbedId}
                    options={availableEmbeds.map((item) => ({
                      value: item.id,
                      label: t(
                        item.mode === "dub"
                          ? "common:watch.dub"
                          : "common:watch.sub",
                        { name: item.name },
                      ),
                    }))}
                  />
                </div>
              </div>
            ) : null}
            {canSelectEpisodes && (
              <div
                role="group"
                className={styles.episodes}
                aria-label={t("common:watch.episodes")}
              >
                {episodes.map((number) => (
                  <button
                    key={number}
                    type="button"
                    disabled={saving}
                    aria-pressed={number === selectedEpisode}
                    onClick={() => void selectEpisode(number)}
                    aria-label={t("common:watch.episode", { number })}
                    className={clsx(
                      styles.episode,
                      number <= progress && styles.watched,
                      number === selectedEpisode && styles.selected,
                    )}
                  >
                    {number}
                  </button>
                ))}
              </div>
            )}
            {saving && (
              <p role="status" className={styles.message}>
                {t("common:watch.syncing")}
              </p>
            )}
            {src ? (
              <EmbedFrame
                src={src}
                sandbox={primaryRu ? undefined : embed?.sandbox}
                title={`${media.title} — ${t("common:watch.episode", { number: selectedEpisode })}`}
              />
            ) : (
              <div className={styles.placeholder}>
                {t(
                  primaryRu
                    ? "common:watch.episodeUnavailable"
                    : "common:watch.unavailable",
                )}
              </div>
            )}
            {canSelectEpisodes &&
              (total === null || selectedEpisode < total) && (
                <Button
                  variant="secondary"
                  onClick={() => void selectEpisode(selectedEpisode + 1)}
                  disabled={
                    saving ||
                    !src ||
                    (primaryRu && !episodes.includes(selectedEpisode + 1))
                  }
                >
                  {t("common:watch.nextEpisode")}
                </Button>
              )}
          </>
        )}
        {catalog ? (
          <button
            type="button"
            className={styles.link}
            onClick={() => setForceFallback(true)}
          >
            <span className={styles.fallbackLabel}>
              {t("common:watch.fallback")}
            </span>
          </button>
        ) : (
          <div className={styles.meta}>
            {!loading && <span>{t("common:watch.fallbackHint")}</span>}
            {forceFallback && catalogQuery.data?.players.length ? (
              <button
                type="button"
                className={styles.link}
                onClick={() => setForceFallback(false)}
              >
                {t("common:watch.restore")}
              </button>
            ) : (
              !catalogQuery.isFetching && (
                <button
                  type="button"
                  className={styles.link}
                  onClick={() => {
                    setForceFallback(false);
                    void catalogQuery.refetch();
                  }}
                >
                  {t("common:watch.retry")}
                </button>
              )
            )}
          </div>
        )}
      </section>
      {catalog ? (
        <>
          <WatchOrder catalog={catalog} />
          <WatchComments key={catalog.id} catalogId={catalog.id} />
        </>
      ) : (
        !loading && <MediaRelations userId={userId} mediaId={media.id} />
      )}
    </>
  );
}
