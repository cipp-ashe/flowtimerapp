import React from 'react';
import { Notes } from '@/components/notes/Notes';
import { Button } from '@/components/ui/button';
import { EmailSummaryModal } from '@/components/EmailSummaryModal';
import { useState } from 'react';
import { Mail, ArrowLeft, Moon, Sun } from 'lucide-react';
import { useTheme } from "@/hooks/useTheme";
import { Link } from 'react-router-dom';
import { sendNotesSummaryEmail } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Note } from '@/components/notes/Notes';

export default function NotesPage() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme(true);

  const handleSendSummary = async (email: string, clearNotes?: boolean) => {
    try {
      const savedNotes = localStorage.getItem('notes');
      const allNotes: Note[] = savedNotes ? JSON.parse(savedNotes) : [];
      
      // Sort notes by creation date, newest first
      const sortedNotes = [...allNotes].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      await sendNotesSummaryEmail(email, sortedNotes, clearNotes);

      if (clearNotes) {
        localStorage.removeItem('notes');
        localStorage.removeItem('noteTags');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error sending summary:', error);
      toast.error('Failed to send summary email 📧❌');
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            to="/"
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
            title="Back to Timer"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
            Notes
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/20"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button onClick={() => setIsEmailModalOpen(true)}>
              <Mail className="w-4 h-4 mr-2" />
              Send Summary
            </Button>
          </div>
        </div>

        <div className="bg-card/90 backdrop-blur-md shadow-lg rounded-lg border border-primary/20 p-6">
          <Notes />
        </div>

        <EmailSummaryModal
          isOpen={isEmailModalOpen}
          onClose={() => setIsEmailModalOpen(false)}
          onSubmit={handleSendSummary}
          type="notes"
        />
      </div>
    </div>
  );
}
