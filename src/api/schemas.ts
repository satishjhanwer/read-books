import { z } from 'zod';

// Raw Open Library response shapes. Only the fields the app reads are listed;
// everything else is stripped. Most fields are optional in practice.

/** Text fields come back either as a plain string or as `{ type: '/type/text', value }`. */
export const textSchema = z.union([z.string(), z.object({ value: z.string() })]);

const linkSchema = z.object({ title: z.string(), url: z.string() });

export const searchDocSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.array(z.string()).optional(),
  author_key: z.array(z.string()).optional(),
  cover_i: z.number().optional(),
  first_publish_year: z.number().optional(),
  edition_count: z.number().optional(),
  ratings_average: z.number().optional(),
  ratings_count: z.number().optional(),
});

export const searchResponseSchema = z.object({
  numFound: z.number(),
  start: z.number(),
  docs: z.array(searchDocSchema),
});

export const workSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: textSchema.optional(),
  authors: z.array(z.object({ author: z.object({ key: z.string() }) })).optional(),
  covers: z.array(z.number()).optional(),
  first_publish_date: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  links: z.array(linkSchema).optional(),
});

export const ratingsSchema = z.object({
  summary: z.object({
    average: z.number().nullish(),
    count: z.number(),
  }),
});

export const authorSchema = z.object({
  key: z.string(),
  name: z.string().optional(),
  personal_name: z.string().optional(),
  bio: textSchema.optional(),
  birth_date: z.string().optional(),
  death_date: z.string().optional(),
  photos: z.array(z.number()).optional(),
  links: z.array(linkSchema).optional(),
});

export type SearchDoc = z.infer<typeof searchDocSchema>;

/** Record envelope used to detect merge redirects (`/type/redirect` + `location`) and deletions. */
export const recordMetaSchema = z.object({
  type: z.object({ key: z.string() }).optional(),
  location: z.string().optional(),
});
