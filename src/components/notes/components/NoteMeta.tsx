import React from 'react';
import { format } from 'date-fns';

interface NoteMetaProps {
  createdAt: string;
  updatedAt?: string;
  compact?: boolean;
}

export const NoteMeta = ({ createdAt, updatedAt, compact = false }: NoteMetaProps) => {
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <time>{format(new Date(createdAt), 'MMM d, HH:mm')}</time>
        {updatedAt && (
          <>
            <span>•</span>
            <time>Updated {format(new Date(updatedAt), 'HH:mm')}</time>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <time>{format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
      {updatedAt && (
        <>
          <span>•</span>
          <time>Updated {format(new Date(updatedAt), 'MMM d, yyyy HH:mm')}</time>
        </>
      )}
    </div>
  );
};