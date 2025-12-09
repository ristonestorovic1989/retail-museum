'use client';

import { useTheme } from 'next-themes';
import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  const { theme } = useTheme();
  return (
    <SonnerToaster
      position="bottom-right"
      closeButton
      richColors
      theme={theme === 'system' ? 'system' : (theme as 'light' | 'dark')}
    />
  );
}
