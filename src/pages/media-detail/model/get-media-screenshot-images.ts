import type { Media, MediaScreenshot } from "@/entities/media";

export type MediaScreenshotImage = MediaScreenshot & { title: string };

/** Keeps the AniList banner as the first frame, even without Shikimori images. */
export function getMediaScreenshotImages(
  media: undefined | Pick<Media, "title" | "bannerImage">,
  screenshots: undefined | readonly MediaScreenshot[],
): MediaScreenshotImage[] {
  if (!media) return [];

  const images: MediaScreenshotImage[] = [];
  const seen = new Set<string>();
  const addImage = (url: null | string | undefined, preview?: string) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    images.push({
      original: url,
      title: media.title,
      preview: preview ?? url,
    });
  };

  addImage(media.bannerImage);
  screenshots?.forEach(({ preview, original }) => addImage(original, preview));

  return images;
}
