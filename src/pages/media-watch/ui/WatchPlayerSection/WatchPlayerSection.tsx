import { useTranslation } from "react-i18next";

import clsx from "clsx";

import { ContentLanguageControls } from "@/features/translate-content";

import { Button, Heading, Combobox, EmbedFrame, ScrollArea } from "@/shared/ui";

import type { WatchPlaybackModel } from "../../model/useWatchPlayback";

import * as styles from "./WatchPlayerSection.css";

export function WatchPlayerSection({
  playback,
  mediaTitle,
}: {
  mediaTitle: string;
  playback: WatchPlaybackModel;
}) {
  const { t } = useTranslation(["common"]);
  const {
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
    allTracks,
    primaryRu,
    trackPlayers,
    forceFallback,
    availableEmbeds,
    catalogFetching,
    selectedEpisode,
    catalogAvailable,
    canSelectEpisodes,
  } = playback;

  return (
    <section className={styles.section}>
      <Heading
        variant="neutral"
        action={
          <ContentLanguageControls
            language={language}
            onChange={playback.setLanguage}
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
                  onValueChange={playback.selectTrack}
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
                  onValueChange={playback.selectPlayer}
                  options={(trackPlayers ?? []).map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
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
                  onValueChange={playback.setEmbedId}
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
            <ScrollArea
              className={styles.episodes}
              viewportClassName={styles.episodesViewport}
            >
              <div
                role="group"
                className={styles.episodeButtons}
                aria-label={t("common:watch.episodes")}
              >
                {episodes.map((number) => (
                  <button
                    key={number}
                    type="button"
                    disabled={saving}
                    aria-pressed={number === selectedEpisode}
                    aria-label={t("common:watch.episode", { number })}
                    onClick={() => void playback.selectEpisode(number)}
                    className={clsx(
                      styles.episode,
                      number <= playback.progress && styles.watched,
                      number === selectedEpisode && styles.selected,
                    )}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </ScrollArea>
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
              title={`${mediaTitle} — ${t("common:watch.episode", { number: selectedEpisode })}`}
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
          {canSelectEpisodes && (total === null || selectedEpisode < total) && (
            <Button
              variant="secondary"
              onClick={() => void playback.selectEpisode(selectedEpisode + 1)}
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
          onClick={() => playback.setForceFallback(true)}
        >
          <span className={styles.fallbackLabel}>
            {t("common:watch.fallback")}
          </span>
        </button>
      ) : (
        <div className={styles.meta}>
          {!loading && <span>{t("common:watch.fallbackHint")}</span>}
          {forceFallback && catalogAvailable ? (
            <button
              type="button"
              className={styles.link}
              onClick={() => playback.setForceFallback(false)}
            >
              {t("common:watch.restore")}
            </button>
          ) : (
            !catalogFetching && (
              <button
                type="button"
                className={styles.link}
                onClick={playback.retryCatalog}
              >
                {t("common:watch.retry")}
              </button>
            )
          )}
        </div>
      )}
    </section>
  );
}
