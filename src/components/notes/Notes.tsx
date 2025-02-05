import React, { useState } from 'react';
import { NotesEditor } from './NotesEditor';
import { SavedNotes, Note } from './SavedNotes';

interface NotesProps {
  onOpenEmailModal?: () => void;
  hideNotes?: boolean;
}

export const Notes = ({ onOpenEmailModal, hideNotes }: NotesProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 min-h-0 mb-4">
        <NotesEditor />
      </div>

      {!hideNotes && (
        <SavedNotes
          onOpenEmailModal={onOpenEmailModal}
          onEditNote={handleEditNote}
        />
      )}
    </div>
  );
};
