/** One episode option returned by the adult anime provider. */
export type AdultVideo = {
  id: string;
  year: number;
  title: string;
  cover: string;
  rating: number;
  tags: string[];
  episode: number;
  quality: string;
  language: string;
  duration: string;
  embedUrl: string;
  censored: boolean;
  thumbnail: string;
};
