import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Download, 
  Trash2, 
  Sparkles, 
  Edit2, 
  X, 
  Tag as TagIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import type { Note, Tag } from '@/hooks/useNotes';
import { downloadNoteAsMarkdown } from '@/utils/downloadUtils';

interface ExpandedNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onAddTag: (noteId: string, tagName: string) => void;
  onRemoveTag: (noteId: string, tagName: string) => void;
}

const MAX_NOTES = 4;

export const ExpandedNotesList = ({ 
  notes,
  onEditNote,
  onDeleteNote,
  onAddTag,
  onRemoveTag
}: ExpandedNotesListProps) => {
  const [tagInput, setTagInput] = useState('');
  const [editingTagsForNote, setEditingTagsForNote] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const handleDownloadNote = async (note: Note) => {
    await downloadNoteAsMarkdown(note);
  };

  const handleClearNotes = () => {
    if (window.confirm('Are you sure you want to clear all notes? This cannot be undone.')) {
      localStorage.removeItem('notes');
      window.dispatchEvent(new Event('notesUpdated'));
      toast.success("All notes cleared 🗑️");
    }
  };

  const totalPages = Math.ceil(notes.length / MAX_NOTES);
  const paginatedNotes = notes.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Saved Notes</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearNotes}
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
          <p className="text-sm text-muted-foreground">No notes yet</p>
          <p className="text-xs text-muted-foreground/60">Start writing to create your first note</p>
        </div>
      ) : (
        <div className="grid gap-2">
          {paginatedNotes.map(note => (
            <div
              key={note.id}
              className="relative p-4 rounded-lg border border-primary/20 bg-card/50 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:bg-accent/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-foreground truncate">
                      {note.content}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {note.tags.map(tag => (
                        <Badge 
                          key={tag.name} 
                          variant="secondary" 
                          className="text-xs px-1.5 h-5 bg-primary/5 hover:bg-primary/10 text-primary/80 hover:text-primary transition-colors"
                        >
                          {tag.name}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer opacity-50 hover:opacity-100" 
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveTag(note.id, tag.name);
                            }}
                          />
                        </Badge>
                      ))}
                      {editingTagsForNote === note.id ? (
                        <div className="relative">
                          <Input
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                onAddTag(note.id, tagInput);
                                setTagInput('');
                                setEditingTagsForNote(null);
                              } else if (e.key === 'Escape') {
                                setEditingTagsForNote(null);
                                setTagInput('');
                              }
                            }}
                            placeholder="Add tag..."
                            className="h-5 w-16 text-xs px-1.5"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingTagsForNote(note.id)}
                          className="h-5 w-5 p-0 text-primary/50 hover:text-primary"
                        >
                          <TagIcon className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadNote(note)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  {onEditNote && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditNote(note)}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-primary"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteNote(note.id)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <time>{format(new Date(note.createdAt), 'MMM d, yyyy HH:mm')}</time>
                {note.updatedAt && (
                  <>
                    <span>•</span>
                    <time>Updated {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}</time>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="h-7 w-7 p-0 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="h-7 w-7 p-0 text-muted-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};