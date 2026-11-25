import { z } from "zod";

const adultVideoSchema = z.object({
  title: z.string(),
  cover: z.string(),
  quality: z.string(),
  language: z.string(),
  duration: z.string(),
  embedUrl: z.string(),
  id: z.string().min(1),
  censored: z.boolean(),
  thumbnail: z.string(),
  year: z.number().int(),
  tags: z.array(z.string()),
  rating: z.number().finite(),
  episode: z.number().int().positive(),
});

export const searchResponseSchema = z.object({
  videos: z.array(adultVideoSchema),
});

export type MuchoHentaiVideo = z.infer<typeof adultVideoSchema>;
