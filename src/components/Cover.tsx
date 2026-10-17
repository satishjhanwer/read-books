import { BookOpen, UserRound } from 'lucide-react';
import { useState } from 'react';

import { authorPhotoUrl, coverUrl, type ImageSize } from '../api/openLibrary';

interface CoverProps {
  /** Open Library cover or photo id; a placeholder is shown when missing or when the image fails. */
  imageId?: number;
  alt: string;
  kind?: 'book' | 'author';
  size?: ImageSize;
  className?: string;
}

export function Cover({ imageId, alt, kind = 'book', size = 'M', className = '' }: CoverProps) {
  const [failedId, setFailedId] = useState<number>();
  const frame = `overflow-hidden rounded-md bg-slate-200 dark:bg-slate-800 ${className}`;

  if (imageId === undefined || failedId === imageId) {
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
      src={kind === 'book' ? coverUrl(imageId, size) : authorPhotoUrl(imageId, size)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        setFailedId(imageId);
      }}
      className={`object-cover ${frame}`}
    />
  );
}
