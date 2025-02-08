import React, { useEffect } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes } from './SavedNotes';
import { useNotes, type Note, type TagColor } from '@/hooks/useNotes';
import { toast } from 'sonner';
import { NotesDialog } from './components/NotesDialog';

interface NotesProps {
  hideNotes?: boolean;
}

export const Notes = ({ hideNotes }: NotesProps) => {
  const { 
    notes,
    updateNote, 
    selectNoteForEdit, 
    selectedNote, 
    clearSelectedNote,
    addNote,
    currentContent,
    updateCurrentContent
  } = useNotes();

  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);
  const [pendingAction, setPendingAction] = React.useState<{
    type: 'edit' | 'navigate';
    note?: Note;
  } | null>(null);

  // Handle browser navigation/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentContent.trim() && (!selectedNote || selectedNote.content !== currentContent)) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentContent, selectedNote]);

  const hasUnsavedChanges = () => {
    return currentContent.trim() && (!selectedNote || selectedNote.content !== currentContent);
  };

  const handleEditNote = (note: Note) => {
    if (hasUnsavedChanges()) {
      setPendingAction({ type: 'edit', note });
      setShowUnsavedDialog(true);
    } else {
      selectNoteForEdit(note);
    }
  };

  const handleSave = () => {
    if (!currentContent.trim()) return;

    try {
      if (selectedNote) {
        updateNote(selectedNote.id, currentContent);
        clearSelectedNote();
        toast.success("Note updated ✨");
      } else {
        const newNote = addNote();
        if (newNote) {
          toast.success("Note saved ✨");
          clearSelectedNote();
        }
      }
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error("Failed to save note ⚠️");
    }
  };

  const handleUnsavedDialogAction = (shouldSave: boolean) => {
    if (shouldSave) {
      handleSave();
    }
    
    if (pendingAction?.type === 'edit' && pendingAction.note) {
      selectNoteForEdit(pendingAction.note);
    }
    
    setShowUnsavedDialog(false);
    setPendingAction(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <NotesEditor 
          key={selectedNote?.id || 'new'} // Force remount when note changes
          selectedNote={selectedNote}
          content={currentContent}
          onChange={updateCurrentContent}
          onSave={handleSave}
          isEditing={!!selectedNote}
        />
      </div>

      {!hideNotes && (
        <SavedNotes
          onEditNote={handleEditNote}
        />
      )}

      <NotesDialog
        open={showUnsavedDialog}
        onOpenChange={setShowUnsavedDialog}
        title="Save changes?"
        description="You have unsaved changes. Would you like to save them before continuing?"
        actionText="Save"
        cancelText="Don't Save"
        onAction={() => handleUnsavedDialogAction(true)}
        onCancel={() => handleUnsavedDialogAction(false)}
        variant="default"
      />
    </div>
  );
};
