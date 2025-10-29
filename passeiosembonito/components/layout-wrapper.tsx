'use client'; 

import React, { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';

const ContactModal = dynamic(() => import('@/components/contact-modal').then(mod => mod.ContactModal), { ssr: false });

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  // O estado (useState) agora está seguro aqui
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      {/* O modal é injetado aqui */}
      <ContactModal isOpen={isContactModalOpen} setIsOpen={setIsContactModalOpen} />
    </ThemeProvider>
  );
}