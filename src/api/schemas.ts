// zod/mini: the tree-shakable functional API (the classic chained API added ~20% to the bundle).
import * as z from 'zod/mini';

// Raw Open Library response shapes. Only the fields the app reads are listed;
// everything else is stripped. Most fields are optional in practice.

/** Text fields come back either as a plain string or as `{ type: '/type/text', value }`. */
export const textSchema = z.union([z.string(), z.object({ value: z.string() })]);

const linkSchema = z.object({ title: z.string(), url: z.string() });

export const searchDocSchema = z.object({
  key: z.string(),
  title: z.string(),
  author_name: z.optional(z.array(z.string())),
  author_key: z.optional(z.array(z.string())),
  cover_i: z.optional(z.number()),
  first_publish_year: z.optional(z.number()),
  edition_count: z.optional(z.number()),
  ratings_average: z.optional(z.number()),
  ratings_count: z.optional(z.number()),
});

export const searchResponseSchema = z.object({
  numFound: z.number(),
  start: z.number(),
  docs: z.array(searchDocSchema),
});

export const workSchema = z.object({
  key: z.string(),
  title: z.string(),
  description: z.optional(textSchema),
  authors: z.optional(z.array(z.object({ author: z.object({ key: z.string() }) }))),
  covers: z.optional(z.array(z.number())),
  first_publish_date: z.optional(z.string()),
  subjects: z.optional(z.array(z.string())),
  links: z.optional(z.array(linkSchema)),
});

export const ratingsSchema = z.object({
  summary: z.object({
    average: z.nullish(z.number()),
    count: z.number(),
  }),
  /** Star histogram keyed "1".."5". */
  counts: z.optional(z.record(z.string(), z.number())),
});

export const authorSchema = z.object({
  key: z.string(),
  name: z.optional(z.string()),
  personal_name: z.optional(z.string()),
  bio: z.optional(textSchema),
  birth_date: z.optional(z.string()),
  death_date: z.optional(z.string()),
  photos: z.optional(z.array(z.number())),
  links: z.optional(z.array(linkSchema)),
});

export type SearchDoc = z.infer<typeof searchDocSchema>;

/** Record envelope used to detect merge redirects (`/type/redirect` + `location`) and deletions. */
export const recordMetaSchema = z.object({
  type: z.optional(z.object({ key: z.string() })),
  location: z.optional(z.string()),
});

export const authorSearchResponseSchema = z.object({
  numFound: z.number(),
  start: z.number(),
  docs: z.array(
    z.object({
      key: z.string(),
      name: z.optional(z.string()),
      birth_date: z.optional(z.string()),
      death_date: z.optional(z.string()),
      top_work: z.optional(z.string()),
      work_count: z.optional(z.number()),
    }),
  ),
});

export const editionsResponseSchema = z.object({
  size: z.number(),
  entries: z.array(
    z.object({
      key: z.string(),
      title: z.optional(z.string()),
      subtitle: z.optional(z.string()),
      publishers: z.optional(z.array(z.string())),
      publish_date: z.optional(z.string()),
      number_of_pages: z.optional(z.number()),
      physical_format: z.optional(z.string()),
      isbn_13: z.optional(z.array(z.string())),
      isbn_10: z.optional(z.array(z.string())),
      languages: z.optional(z.array(z.object({ key: z.string() }))),
      covers: z.optional(z.array(z.number())),
    }),
  ),
});
