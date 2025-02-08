import React from 'react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ActionButton } from '@/components/ui/action-button';
import { ChevronDown, ChevronUp, Download, Trash2 } from 'lucide-react';
import type { Note, Tag } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { NotesDialog } from './NotesDialog';
import { downloadAllNotes } from '@/utils/downloadUtils';

interface CollapsibleNotesListProps {
  notes: Note[];
  onEditNote?: (note: Note) => void;
  inExpandedView?: boolean;
}

export const CollapsibleNotesList = ({
  notes,
  onEditNote,
  inExpandedView = false
}: CollapsibleNotesListProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showClearDialog, setShowClearDialog] = React.useState(false);

  const handleClearNotes = () => {
    localStorage.removeItem('notes');
    window.dispatchEvent(new Event('notesUpdated'));
  };

  const handleDeleteNote = (noteId: string) => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const currentNotes: Note[] = JSON.parse(savedNotes);
      const newNotes = currentNotes.filter(note => note.id !== noteId);
      localStorage.setItem('notes', JSON.stringify(newNotes));
      window.dispatchEvent(new Event('notesUpdated'));
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
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <CollapsibleTrigger className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-primary">
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          Recent Notes ({notes.length})
        </CollapsibleTrigger>
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
      </div>

      <CollapsibleContent className="space-y-2">
        {notes.map(note => (
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
      </CollapsibleContent>

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
    </Collapsible>
  );
};