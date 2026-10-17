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
  links: ExternalLink[];
  openLibraryUrl: string;
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
