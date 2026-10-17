// App-level models. Components use these, never raw Open Library shapes.

export interface AuthorRef {
  id: string;
  /** Undefined when Open Library has no name; the UI shows a translated fallback. */
  name?: string;
}

export interface Rating {
  average: number;
  count: number;
}

export interface ExternalLink {
  title: string;
  url: string;
}

export interface BookSummary {
  id: string;
  title: string;
  authors: AuthorRef[];
  coverId?: number;
  firstPublishYear?: number;
  editionCount?: number;
  rating?: Rating;
}

export interface BookPage {
  books: BookSummary[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface BookDetails {
  id: string;
  title: string;
  authors: AuthorRef[];
  description?: string;
  subjects: string[];
  firstPublishDate?: string;
  coverId?: number;
  rating?: Rating;
  /** Number of 1- to 5-star ratings (index 0 is one star). Only present when there are ratings. */
  ratingCounts?: [number, number, number, number, number];
  links: ExternalLink[];
  openLibraryUrl: string;
}

export interface Edition {
  id: string;
  title?: string;
  subtitle?: string;
  publishers: string[];
  publishDate?: string;
  pages?: number;
  format?: string;
  isbn?: string;
  /** MARC language codes such as `eng` or `ger`; `Intl.DisplayNames` turns them into names. */
  languages: string[];
  coverId?: number;
  openLibraryUrl: string;
}

export interface EditionPage {
  editions: Edition[];
  total: number;
  page: number;
  hasMore: boolean;
}

export interface AuthorDetails {
  id: string;
  name?: string;
  bio?: string;
  birthDate?: string;
  deathDate?: string;
  photoId?: number;
  links: ExternalLink[];
  openLibraryUrl: string;
}

export interface AuthorSummary {
  id: string;
  name?: string;
  birthDate?: string;
  deathDate?: string;
  topWork?: string;
  workCount?: number;
}

export interface AuthorSearchPage {
  authors: AuthorSummary[];
  total: number;
  page: number;
  hasMore: boolean;
}
