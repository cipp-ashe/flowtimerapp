import React, { useState } from 'react';
import { toast } from 'sonner';
import { Download, Trash2 } from 'lucide-react';
import { NoteCard } from './components/NoteCard';
import { NotesDialog } from './components/NotesDialog';
import { NotesPagination } from './components/NotesPagination';
import { ActionButton } from '@/components/ui/action-button';
import { downloadAllNotes } from '@/utils/downloadUtils';
import { useNotes, type Note, type TagColor } from '@/hooks/useNotes';

interface SavedNotesProps {
  onEditNote?: (note: Note) => void;
  onUpdateTagColor?: (noteId: string, tagName: string, color: TagColor) => void;
}

const MAX_NOTES = 4;

export const SavedNotes = ({ onEditNote, onUpdateTagColor }: SavedNotesProps) => {
  const { 
    notes,
    deleteNote,
    addTagToNote,
    removeTagFromNote
  } = useNotes();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleDeleteNote = (noteId: string) => {
    deleteNote(noteId);
    toast.success("Note deleted 🗑️");
  };

  const handleAddTag = (noteId: string, tagName: string) => {
    if (!tagName.trim()) return;
    addTagToNote(noteId, tagName);
  };

  const handleRemoveTag = (noteId: string, tagName: string) => {
    removeTagFromNote(noteId, tagName);
  };

  const handleClearNotes = () => {
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
    toast.success("All notes cleared 🗑️");
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ActionButton
              icon={Download}
              onClick={() => downloadAllNotes(notes)}
              className="h-7 w-7 p-0"
            />
            <ActionButton
              icon={Trash2}
              onClick={() => setShowClearDialog(true)}
              className="h-7 w-7 p-0"
            />
          </div>
          <NotesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
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
            <NoteCard
              key={note.id}
              note={note}
              onEdit={onEditNote}
              onDelete={handleDeleteNote}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              onUpdateTagColor={onUpdateTagColor}
            />
          ))}
        </div>
      )}

      {/* Clear Notes Dialog */}
      <NotesDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear all notes?"
        description="This action cannot be undone. All notes will be permanently deleted."
        actionText="Clear All"
        onAction={handleClearNotes}
        variant="destructive"
      />
    </div>
  );
};
