import { z } from "zod";

const optionalNumber = z.number().nullish();
export const animeSchema = z.object({
  title: z.string(),
  year: optionalNumber,
  original: z.string().nullish(),
  anime_url: z.string().optional(),
  anime_id: z.number().int().positive(),
  other_titles: z.array(z.string()).nullish(),
  anime_status: z.object({ alias: z.string() }).nullish(),
  episodes: z
    .object({ count: optionalNumber, aired: optionalNumber })
    .nullish(),
  type: z
    .object({ alias: z.string(), shortname: z.string().optional() })
    .nullish(),
  remote_ids: z
    .object({ shikimori_id: optionalNumber, myanimelist_id: optionalNumber })
    .nullish(),
});
export type YummyAnime = z.infer<typeof animeSchema>;

export const videoSchema = z.object({
  video_id: z.number(),
  iframe_url: z.string(),
  number: z.union([z.string(), z.number()]),
  views: z.number().nonnegative().default(0),
  data: z.object({
    player: z.string(),
    dubbing: z.string(),
    player_id: z.number(),
  }),
});
export type YummyVideo = z.infer<typeof videoSchema>;

const screenshotSchema = z.object({
  sizes: z
    .object({ full: z.string().optional(), small: z.string().optional() })
    .nullish(),
});

export const detailSchema = animeSchema.extend({
  videos: z.array(videoSchema).optional(),
  random_screenshots: z.array(screenshotSchema).nullish(),
  viewing_order: z
    .array(
      animeSchema.extend({
        data: z
          .object({ text: z.string().optional(), index: z.number().optional() })
          .optional(),
      }),
    )
    .nullish(),
});

export const commentSchema = z.object({
  id: z.number(),
  text: z.string(),
  name: z.string(),
  time: z.number(),
  deleted_at: optionalNumber,
  likes: z.number().default(0),
  dislikes: z.number().default(0),
  children_count: z.number().default(0),
  avatars: z.object({ small: z.string().optional() }).nullish(),
});

export function httpsResource(value: string | undefined): null | string {
  if (!value) return null;
  try {
    const url = new URL(value.startsWith("//") ? `https:${value}` : value);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}
