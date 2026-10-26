const DEFAULT_COVER_PATH =
  /\/media\/anime\/cover\/(?:small|medium|large)\/default\.jpg(?:[?#].*)?$/i;

/** AniList returns a stock cover URL when media has no artwork. */
export function mapAniListCoverUrl(
  url: null | string | undefined,
): null | string {
  return !url || DEFAULT_COVER_PATH.test(url) ? null : url;
}
