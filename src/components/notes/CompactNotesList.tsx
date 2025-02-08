import React, { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import type { Note, Tag } from '@/hooks/useNotes';
import { NoteCard } from './components/NoteCard';
import { NotesDialog } from './components/NotesDialog';
import { NotesPagination } from './components/NotesPagination';
import { ActionButton } from '@/components/ui/action-button';
import { downloadAllNotes } from '@/utils/downloadUtils';
import { toast } from 'sonner';

interface CompactNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  inExpandedView?: boolean;
}

const MAX_NOTES = 4;

export const CompactNotesList = ({ 
  notes,
  onEditNote,
  inExpandedView = false
}: CompactNotesListProps) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const totalPages = Math.ceil(notes.length / MAX_NOTES);
  const paginatedNotes = notes.slice(
    currentPage * MAX_NOTES,
    (currentPage + 1) * MAX_NOTES
  );

  const handleClearNotes = () => {
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
    toast.success("All notes cleared 🗑️");
  };

  const handleDeleteNote = (noteId: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const newNotes = currentNotes.filter(note => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(newNotes));
      window.dispatchEvent(new Event('notesUpdated'));
      toast.success("Note deleted 🗑️");
    }
  };

  const handleAddTag = (noteId: string, tagName: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const updatedNotes = currentNotes.map(note => {
        if (note.id === noteId) {
          const newTag: Tag = { name: tagName.trim(), color: 'default' };
          return { 
            ...note, 
            tags: [...note.tags.filter(t => t.name !== newTag.name), newTag]
          };
        }
        return note;
      });
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
    }
  };

  const handleRemoveTag = (noteId: string, tagName: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const updatedNotes = currentNotes.map(note => {
        if (note.id === noteId) {
          return { ...note, tags: note.tags.filter(t => t.name !== tagName) };
        }
        return note;
      });
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      window.dispatchEvent(new Event('notesUpdated'));
    }
  };

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted-foreground">Recent Notes</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <ActionButton
              icon={Download}
              onClick={() => downloadAllNotes(notes)}
              className="h-6 w-6 p-0"
            />
            <ActionButton
              icon={Trash2}
              onClick={() => setShowClearDialog(true)}
              className="h-6 w-6 p-0"
            />
          </div>
          <NotesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            compact
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        {paginatedNotes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEditNote}
            onDelete={handleDeleteNote}
            onAddTag={handleAddTag}
            onRemoveTag={handleRemoveTag}
            compact
          />
        ))}
      </div>

      {/* Clear Notes Dialog */}
      <NotesDialog
        open={showClearDialog}
        onOpenChange={setShowClearDialog}
        title="Clear all notes?"
        description="This action cannot be undone. All notes will be permanently deleted."
        actionText="Clear All"
        onAction={handleClearNotes}
        variant="destructive"
        inExpandedView={inExpandedView}
      />
    </div>
  );
};