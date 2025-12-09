'use client';
import { useState } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';

import { makeQueryClient } from '@/lib/react-query';

export default function TRQProvider({ children }: { children: React.ReactNode }) {
  const [qc] = useState(() => makeQueryClient());
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}
