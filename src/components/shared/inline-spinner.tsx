'use client';

import { cn } from '@/lib/utils';

type InlineSpinnerProps = {
  label?: string;
  className?: string;
};

export function InlineSpinner({ label, className }: InlineSpinnerProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border bg-card/80 backdrop-blur-sm px-3 py-1.5',
        className,
      )}
      aria-live="polite"
    >
      <div className="h-3.5 w-3.5 rounded-full border-2 border-muted border-t-primary animate-spin" />
      {label ? <span className="text-xs text-muted-foreground">{label}</span> : null}
    </div>
  );
}
