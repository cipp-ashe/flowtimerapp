import React, { useState, useEffect } from 'react';
import { NotesTabsView } from './NotesTabsView';
import { toast } from 'sonner';
import { ChevronRight } from 'lucide-react';

interface NotesEditorProps {
  onSave?: (content: string) => void;
}

interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export const NotesEditor = ({ onSave }: NotesEditorProps) => {
  const [currentContent, setCurrentContent] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [showNotes, setShowNotes] = useState(false);

  // Load saved notes on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const handleSave = () => {
    if (!currentContent.trim()) return;

    if (onSave) {
      onSave(currentContent);
    } else {
      // Default behavior if no onSave provided
      const newNote = {
        id: crypto.randomUUID(),
        content: currentContent,
        createdAt: new Date().toISOString(),
      };
      
      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem('notes', JSON.stringify(updatedNotes));
      setShowNotes(true);
    }

    setCurrentContent('');
    toast.success("Note saved ✨");
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex-1 min-h-0 overflow-hidden bg-background/50 rounded-lg border border-primary/10 shadow-inner">
        <NotesTabsView
          content={currentContent}
          onChange={setCurrentContent}
          onSave={handleSave}
          isEditing={false}
        />
      </div>

      {/* Saved Notes */}
      {notes.length > 0 && (
        <div>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className={`h-4 w-4 transition-transform ${showNotes ? 'rotate-90' : ''}`} />
            Session Notes ({notes.length})
          </button>
          {showNotes && (
            <div className="mt-2 space-y-2 max-h-[120px] overflow-y-auto">
              {notes.map(note => (
                <button
                  key={note.id}
                  onClick={() => {
                    setCurrentContent(note.content);
                  }}
                  className="w-full p-2 rounded-lg border border-primary/10 bg-background/50 text-sm line-clamp-2 text-left hover:bg-background/80 transition-colors"
                >
                  {note.content}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
