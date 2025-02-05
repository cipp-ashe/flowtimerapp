import React, { useState } from 'react';
import { EmailSummaryModal } from './EmailSummaryModal';
import { sendNotesSummaryEmail } from '@/lib/supabase';
import { toast } from 'sonner';
import { Note } from './notes/SavedNotes';
import { cn } from '@/lib/utils';
import { Notes } from './notes/Notes';
import { ArrowLeft } from 'lucide-react';
import { useNotesPanel } from '@/hooks/useNotesPanel';
import { TitleBar } from './TitleBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { isOpen: isNotesOpen, close: handleCloseNotes } = useNotesPanel();

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

      toast.success('Notes summary sent 📧✨');
    } catch (error) {
      console.error('Error sending summary:', error);
      toast.error('Failed to send summary email 📧❌');
      throw error;
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Only show TitleBar in electron */}
      {window.electron && <TitleBar />}
      <div className="flex-1 flex relative">
        {/* Mobile Backdrop */}
        <div
          className={cn(
            "fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden z-40",
            isNotesOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={handleCloseNotes}
        />

        {/* Main Content */}
        <div
          className={cn(
            "w-full transition-all duration-300 ease-in-out",
            isNotesOpen && "lg:w-1/2"
          )}
        >
          {children}
        </div>

        {/* Notes Panel */}
        <div
          className={cn(
            "fixed top-0 right-0 h-screen w-full lg:w-1/2 bg-background border-l border-border transition-transform duration-300 ease-in-out z-50 flex flex-col",
            isNotesOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-none px-4 py-7">
              <div className="flex items-center gap-4 mb-4 sm:mb-7">
                <button 
                  onClick={handleCloseNotes}
                  className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                  Focus Notes
                </h1>
              </div>
            </div>

            <div className="flex-1 px-4 pb-7 overflow-hidden">
              <div className="relative bg-card/90 backdrop-blur-md shadow-lg rounded-lg p-6 h-full before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-primary/20 before:via-purple-500/20 before:to-primary/20 before:-z-10 after:absolute after:inset-[1px] after:rounded-[7px] after:bg-card/90 after:-z-10">
                <Notes onOpenEmailModal={() => setIsEmailModalOpen(true)} />
              </div>
            </div>
          </div>
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
};
