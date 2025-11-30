import { z } from 'zod';

export const BookSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string().min(1),
  author: z.string().min(1),
  summary: z.string(),
  genre: z.string().min(1),
  cover_url: z.string(),
  views: z.string(),
  likes: z.string(),
  quotes: z.string(),
});

export const TopBannerSlideSchema = z.object({
  id: z.number().int().nonnegative(),
  book_id: z.number().int().nonnegative(),
  cover: z.string(),
});

export const JsonDataSchema = z.object({
  books: z.array(BookSchema).default([]),
  top_banner_slides: z.array(TopBannerSlideSchema).default([]),
  you_will_like_section: z.array(z.number().int().nonnegative()).default([]),
});

export const CarouselDataSchema = z.object({
  books: z.array(BookSchema).default([]),
});

export type BookValidated = z.infer<typeof BookSchema>;
export type TopBannerSlideValidated = z.infer<typeof TopBannerSlideSchema>;
export type JsonDataValidated = z.infer<typeof JsonDataSchema>;
export type CarouselDataValidated = z.infer<typeof CarouselDataSchema>;
