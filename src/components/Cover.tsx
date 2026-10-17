import { BookOpen, UserRound } from 'lucide-react';
import { useState } from 'react';

import { authorPhotoUrl, coverUrl, type ImageSize } from '../api/openLibrary';

interface CoverProps {
  /** Open Library cover or photo id; a placeholder is shown when missing or when the image fails. */
  imageId?: number;
  /** A ready-made image URL instead of an id (e.g. author photos by author id). */
  src?: string;
  alt: string;
  kind?: 'book' | 'author';
  size?: ImageSize;
  className?: string;
}

export function Cover({ imageId, src, alt, kind = 'book', size = 'M', className = '' }: CoverProps) {
  const [failedUrl, setFailedUrl] = useState<string>();
  const frame = `overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800 ${className}`;
  const url =
    src ??
    (imageId === undefined ? undefined : kind === 'book' ? coverUrl(imageId, size) : authorPhotoUrl(imageId, size));

  if (url === undefined || failedUrl === url) {
    const Icon = kind === 'book' ? BookOpen : UserRound;
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center text-slate-400 dark:text-slate-600 ${frame}`}>
        <Icon aria-hidden className="size-1/3" strokeWidth={1.25} />
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        setFailedUrl(url);
      }}
      className={`object-cover ${frame}`}
    />
  );
}
