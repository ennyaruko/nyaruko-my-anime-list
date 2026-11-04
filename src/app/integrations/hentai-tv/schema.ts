import { z } from "zod";

const adultVideoSchema = z.object({
  title: z.string(),
  cover: z.string(),
  thumb: z.string(),
  quality: z.string(),
  language: z.string(),
  duration: z.string(),
  id: z.string().min(1),
  censored: z.boolean(),
  year: z.number().int(),
  ep: z.number().positive(),
  tags: z.array(z.string()),
  rating: z.number().finite(),
  embedUrl: z.string().nullish(),
});

export const searchResponseSchema = z.object({
  videos: z.array(adultVideoSchema),
});

export type HentaiTvVideo = z.infer<typeof adultVideoSchema>;
