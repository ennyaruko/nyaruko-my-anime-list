import type { Media } from "./media";

/** Keeps media visible only in the matching regular or adult site mode. */
export function filterMediaForAdultMode<T extends Pick<Media, "isAdult">>(
  media: readonly T[],
  isAdultMode: boolean,
): T[] {
  return media.filter((item) => item.isAdult === isAdultMode);
}
