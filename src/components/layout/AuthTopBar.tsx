'use client';

import ThemeToggle from '@/components/theme/ThemeToggle';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export default function AuthTopBar() {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      <ThemeToggle />
      <LocaleSwitcher />
    </div>
  );
}
