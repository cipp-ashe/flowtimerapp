import React, { useCallback } from 'react';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import type { Note } from '@/hooks/useNotes';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { ActionButton } from '@/components/ui/action-button';

interface NotesEditorProps {
  selectedNote?: Note | null;
  onNoteSaved?: () => void;
  content?: string;
  onChange?: (content: string) => void;
  isEditing?: boolean;
  onSave?: () => void;
}

export const NotesEditor = ({ 
  selectedNote,
  onNoteSaved,
  content: externalContent,
  onChange: externalOnChange,
  isEditing,
  onSave: externalOnSave
}: NotesEditorProps) => {
  const handleChange = (newContent: string | undefined) => {
    if (!newContent) return;
    if (externalOnChange) {
      externalOnChange(newContent);
    }
  };

  const handleSave = useCallback(() => {
    if (!externalContent?.trim()) return;

    try {
      // If external save handler provided, use it
      if (externalOnSave) {
        externalOnSave();
        return;
      }

      // Otherwise, handle internally
      const savedNotes = localStorage.getItem('notes');
      const currentNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];

      let updatedNotes: Note[];
      if (selectedNote) {
        // Update existing note
        updatedNotes = currentNotes.map(note =>
          note.id === selectedNote.id
            ? { 
                ...note, 
                content: externalContent.trim(),
                updatedAt: new Date().toISOString()
              }
            : note
        );
      } else {
        // Create new note
        const newNote: Note = {
          id: crypto.randomUUID(),
          content: externalContent.trim(),
          createdAt: new Date().toISOString(),
          tags: []
        };
        updatedNotes = [newNote, ...currentNotes];
      }

      // Save to localStorage
      localStorage.setItem('notes', JSON.stringify(updatedNotes));

      // Dispatch custom event for immediate update
      window.dispatchEvent(new Event('notesUpdated'));

      if (onNoteSaved) {
        onNoteSaved();
      }
      toast.success(selectedNote ? "Note updated ✨" : "Note saved ✨", {
        duration: 1500
      });
    } catch (error) {
      console.error('Error saving note:', error);
      toast.error('Failed to save note');
    }
  }, [externalContent, externalOnSave, onNoteSaved, selectedNote]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleBlur = useCallback(() => {
    if (externalContent?.trim() && (!selectedNote || selectedNote.content !== externalContent)) {
      handleSave();
    }
  }, [externalContent, handleSave, selectedNote]);

  return (
    <div className="flex flex-col gap-2 h-full notes-editor" onKeyDown={handleKeyDown}>
      <div className="flex justify-end mb-2">
        <ActionButton
          icon={Save}
          onClick={handleSave}
        >
          {isEditing ? 'Update' : 'Save'}
        </ActionButton>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden bg-background/50 rounded-lg border border-primary/10 shadow-inner">
        <MarkdownEditor
          value={externalContent || ''}
          onChange={handleChange}
          onBlur={handleBlur}
          className="h-full"
        />
      </div>
    </div>
  );
};
