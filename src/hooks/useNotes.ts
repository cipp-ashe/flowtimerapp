import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export type TagColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink';

export interface Tag {
  name: string;
  color: TagColor;
}

export interface Note {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  tags: Tag[];
}

const STORAGE_KEY = 'notes';

const isValidTagColor = (color: string): color is TagColor => {
  return ['default', 'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'].includes(color);
};

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentContent, setCurrentContent] = useState('');

  // Load notes on mount and when storage changes
  useEffect(() => {
    const loadNotes = () => {
      const savedNotes = localStorage.getItem(STORAGE_KEY);
      if (savedNotes) {
        try {
          const parsedNotes = JSON.parse(savedNotes);
          const updatedNotes = parsedNotes.map((note: any) => ({
            ...note,
            tags: note.tags.map((tag: string | { name: string; color: string }) => {
              if (typeof tag === 'string') {
                return { name: tag, color: 'default' as TagColor };
              }
              return {
                name: tag.name,
                color: isValidTagColor(tag.color) ? tag.color : 'default'
              };
            })
          }));
          setNotes(updatedNotes);
        } catch (error) {
          console.error('Error loading notes:', error);
          setNotes([]);
        }
      }
    };

    loadNotes();

    // Listen for storage events (when other tabs modify localStorage)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadNotes();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notesUpdated', loadNotes);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notesUpdated', loadNotes);
    };
  }, []);

  const sanitizeContent = (content: string) => {
    // Remove control characters that can cause JSON parsing issues
    return content.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
  };

  const saveNotes = useCallback((updatedNotes: Note[]) => {
    // Sanitize content of all notes before saving
    const sanitizedNotes = updatedNotes.map(note => ({
      ...note,
      content: sanitizeContent(note.content)
    }));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedNotes));
      setNotes(sanitizedNotes);
      window.dispatchEvent(new Event('notesUpdated'));
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes. Please try again.');
    }
  }, []);

  const updateCurrentContent = useCallback((content: string) => {
    setCurrentContent(content);
  }, []);

  const addNote = useCallback(() => {
    if (!currentContent.trim()) return null;
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      content: sanitizeContent(currentContent.trim()),
      createdAt: new Date().toISOString(),
      tags: []
    };
    
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setCurrentContent('');
    return newNote;
  }, [currentContent, notes, saveNotes]);

  const deleteNote = useCallback((noteId: string) => {
    const newNotes = notes.filter(note => note.id !== noteId);
    saveNotes(newNotes);
    
    if (selectedNote?.id === noteId) {
      setSelectedNote(null);
      setCurrentContent('');
    }
  }, [notes, selectedNote, saveNotes]);

  const updateNote = useCallback((noteId: string, content: string) => {
    if (!content.trim()) return;
    const sanitizedContent = sanitizeContent(content.trim());

    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            content: sanitizedContent,
            updatedAt: new Date().toISOString()
          } 
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const addTagToNote = useCallback((noteId: string, tagName: string) => {
    if (!tagName.trim()) return;

    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { 
            ...note, 
            tags: [...note.tags, { name: tagName.trim(), color: 'default' as TagColor }]
          }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const updateTagColor = useCallback((noteId: string, tagName: string, color: TagColor) => {
    console.log('Updating tag color:', { noteId, tagName, color });
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? {
            ...note,
            tags: note.tags.map(tag => 
              tag.name === tagName ? { ...tag, color } : tag
            )
          }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const removeTagFromNote = useCallback((noteId: string, tagName: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, tags: note.tags.filter(tag => tag.name !== tagName) }
        : note
    );

    saveNotes(updatedNotes);
  }, [notes, saveNotes]);

  const selectNoteForEdit = useCallback((note: Note) => {
    if (!note) return;

    const currentNote = notes.find(n => n.id === note.id);
    if (!currentNote) return;

    setSelectedNote(currentNote);
    setCurrentContent(currentNote.content);
  }, [notes]);

  const clearSelectedNote = useCallback(() => {
    setSelectedNote(null);
    setCurrentContent('');
  }, []);

  return {
    notes,
    selectedNote,
    currentContent,
    updateCurrentContent,
    addNote,
    deleteNote,
    updateNote,
    addTagToNote,
    updateTagColor,
    removeTagFromNote,
    selectNoteForEdit,
    clearSelectedNote
  };
}
