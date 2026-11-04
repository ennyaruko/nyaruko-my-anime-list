import type { Media } from "./media";

/** The active content category shown throughout the application. */
export type MediaContentMode = "safe" | "ecchi" | "hentai";

/** Whether the selected content category requires provider adult visibility. */
export function isAdultContentMode(mode: MediaContentMode): boolean {
  return mode !== "safe";
}

/** Checks whether media belongs to the active content category. */
export function isMediaVisibleInContentMode(
  media: Pick<Media, "genres" | "isAdult">,
  mode: MediaContentMode,
): boolean {
  if (mode === "safe") return !media.isAdult;

  if (mode === "hentai") {
    return media.isAdult && media.genres.includes("Hentai");
  }

  return (
    media.isAdult &&
    media.genres.includes("Ecchi") &&
    !media.genres.includes("Hentai")
  );
}

/** Keeps only media that belongs to the active content category. */
export function filterMediaForContentMode<
  T extends Pick<Media, "genres" | "isAdult">,
>(media: readonly T[], mode: MediaContentMode): T[] {
  return media.filter((item) => isMediaVisibleInContentMode(item, mode));
}
