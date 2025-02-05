import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Send, Sparkles } from 'lucide-react';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  tags?: string[];
}

interface SavedNotesProps {
  onOpenEmailModal?: () => void;
  onEditNote?: (note: Note) => void;
}

const NOTES_PER_PAGE = 4;

export const SavedNotes = ({ onOpenEmailModal, onEditNote }: SavedNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
    }
  }, []);

  const handleDeleteNote = (noteId: string) => {
    const newNotes = notes.filter(note => note.id !== noteId);
    setNotes(newNotes);
    localStorage.setItem('notes', JSON.stringify(newNotes));
    toast.success("Note deleted 🗑️");
  };

  const totalPages = Math.ceil(notes.length / NOTES_PER_PAGE);
  const paginatedNotes = notes.slice(
    currentPage * NOTES_PER_PAGE,
    (currentPage + 1) * NOTES_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Saved Notes</h2>
        {notes.length > 0 && onOpenEmailModal && (
          <Button
            variant="outline"
            size="default"
            onClick={onOpenEmailModal}
            className="text-primary hover:text-primary"
          >
            <Send className="w-4 h-4 mr-2" />
            Send Summary
          </Button>
        )}
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground/60">Start writing to create your first note</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-2">
            {paginatedNotes.map(note => (
              <div
                key={note.id}
                className="relative flex items-center justify-between p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-primary/30 hover:bg-accent/5"
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-foreground line-clamp-1">
                    {note.content}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <time className="text-xs text-muted-foreground">
                    {format(new Date(note.createdAt), 'MMM d, yyyy')}
                  </time>
                  <div className="flex items-center gap-2">
                    {onEditNote && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditNote(note)}
                        className="h-6 px-2 text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-6 px-2 text-xs hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="h-7 w-7 p-0"
              >
                <span className="sr-only">Previous page</span>
                <span className="text-sm">‹</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentPage + 1} / {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="h-7 w-7 p-0"
              >
                <span className="sr-only">Next page</span>
                <span className="text-sm">›</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
