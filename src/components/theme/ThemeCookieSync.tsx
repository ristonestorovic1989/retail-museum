'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeCookieSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;
    document.cookie = `theme=${resolvedTheme}; Max-Age=31536000; Path=/; SameSite=Lax`;
  }, [resolvedTheme]);

  return null;
}
