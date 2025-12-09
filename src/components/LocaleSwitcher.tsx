'use client';

import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const current = pathname?.startsWith('/sr') ? 'sr' : pathname?.startsWith('/en') ? 'en' : 'en';

  function switchTo(next: 'en' | 'sr') {
    if (next === current) return;
    document.cookie = `NEXT_LOCALE=${next}; Max-Age=31536000; Path=/; SameSite=Lax`;
    const nextPath = pathname?.replace(/^\/(en|sr)(?=\/|$)/, `/${next}`) ?? `/${next}`;
    router.push(nextPath);
    router.refresh();
  }

  const baseBtn =
    'inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.99] ' +
    'border border-border cursor-pointer';

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        aria-pressed={current === 'en'}
        onClick={() => switchTo('en')}
        className={cn(
          baseBtn,
          current === 'en'
            ? 'bg-accent text-accent-foreground'
            : 'bg-transparent text-foreground/80 hover:bg-accent/60 hover:text-accent-foreground',
        )}
      >
        EN
      </button>

      <button
        type="button"
        aria-pressed={current === 'sr'}
        onClick={() => switchTo('sr')}
        className={cn(
          baseBtn,
          current === 'sr'
            ? 'bg-accent text-accent-foreground'
            : 'bg-transparent text-foreground/80 hover:bg-accent/60 hover:text-accent-foreground',
        )}
      >
        SR
      </button>
    </div>
  );
}
