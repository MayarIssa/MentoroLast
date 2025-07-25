'use client';

import React, { useState } from 'react';
import ChatbotPopup from './ChatbotPopup';

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 bg-primary dark:bg-accent text-primary-foreground dark:text-accent-foreground w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 dark:hover:bg-accent/90 transition-transform hover:scale-110 active:scale-95 animate-pulse"
        aria-label="Open chat"
      >
        🤖
      </button>
      {open && <ChatbotPopup onClose={() => setOpen(false)} />}
    </>
  );
}