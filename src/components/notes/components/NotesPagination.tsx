import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NotesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  compact?: boolean;
}

export const NotesPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  compact = false
}: NotesPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
      >
        <ChevronLeft className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
      <span className={`text-muted-foreground ${compact ? "text-[10px]" : "text-xs"}`}>
        {currentPage + 1} / {totalPages}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage === totalPages - 1}
        className={compact ? "h-6 w-6 p-0" : "h-7 w-7 p-0"}
      >
        <ChevronRight className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </Button>
    </div>
  );
};