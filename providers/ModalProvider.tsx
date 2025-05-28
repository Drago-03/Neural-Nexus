'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { EventFormModal } from '@/components/modals/EventFormModal';

type ModalContextType = {
  isEventFormOpen: boolean;
  openEventForm: () => void;
  closeEventForm: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  const openEventForm = () => setIsEventFormOpen(true);
  const closeEventForm = () => setIsEventFormOpen(false);

  return (
    <ModalContext.Provider value={{ isEventFormOpen, openEventForm, closeEventForm }}>
      {children}
      <EventFormModal />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used inside a ModalProvider');
  }
  return context;
} 