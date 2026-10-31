const releaseStatusInfo = {
  RELEASING: {
    variant: "info",
    labelKey: "common:ui.filters.mediaStatus.releasing",
  },
  FINISHED: {
    variant: "positive",
    labelKey: "common:ui.filters.mediaStatus.finished",
  },
  CANCELLED: {
    variant: "negative",
    labelKey: "common:ui.filters.mediaStatus.cancelled",
  },
  NOT_YET_RELEASED: {
    variant: "negative",
    labelKey: "common:ui.filters.mediaStatus.announced",
  },
} as const;

export type MediaReleaseStatusInfo =
  (typeof releaseStatusInfo)[keyof typeof releaseStatusInfo];

export function getMediaReleaseStatusInfo(
  releaseStatus: null | string,
): null | MediaReleaseStatusInfo {
  if (
    !releaseStatus ||
    !Object.prototype.hasOwnProperty.call(releaseStatusInfo, releaseStatus)
  ) {
    return null;
  }

  return releaseStatusInfo[releaseStatus as keyof typeof releaseStatusInfo];
}
