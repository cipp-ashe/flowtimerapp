import React, { createContext, useContext, useState } from 'react';

interface NotesPanelContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const NotesPanelContext = createContext<NotesPanelContextType | undefined>(undefined);

export function NotesPanelProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(prev => !prev);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <NotesPanelContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </NotesPanelContext.Provider>
  );
}

export function useNotesPanel() {
  const context = useContext(NotesPanelContext);
  if (context === undefined) {
    throw new Error('useNotesPanel must be used within a NotesPanelProvider');
  }
  return context;
}
