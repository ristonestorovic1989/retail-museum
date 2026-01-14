'use client';

import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type Props = {
  value?: string;
  onChange?: (v: string) => void;
  onDebouncedChange?: (v: string) => void;

  delayMs?: number;
  placeholder?: string;
  disabled?: boolean;

  clearable?: boolean;
  autoFocus?: boolean;

  disableFocusStyles?: boolean;

  className?: string;
  inputClassName?: string;
};

export function SearchInput({
  value,
  onChange,
  onDebouncedChange,
  delayMs = 350,
  placeholder,
  disabled,
  clearable = true,
  autoFocus = false,
  disableFocusStyles = true,
  className,
  inputClassName,
}: Props) {
  const [internal, setInternal] = useState(value ?? '');

  useEffect(() => {
    if (value == null) return;
    setInternal(value);
  }, [value]);

  useEffect(() => {
    if (!onDebouncedChange) return;
    const id = window.setTimeout(() => onDebouncedChange(internal), delayMs);
    return () => window.clearTimeout(id);
  }, [internal, delayMs, onDebouncedChange]);

  const showClear = clearable && internal.length > 0 && !disabled;

  const setValue = (v: string) => {
    setInternal(v);
    onChange?.(v);
  };

  const focusCls = disableFocusStyles ? 'focus-visible:ring-0 focus-visible:ring-offset-0' : '';

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

      <Input
        value={internal}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
        className={cn('pl-9 pr-9', focusCls, inputClassName)}
      />

      {showClear && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setValue('')}
          className="absolute right-1 top-1 h-8 w-8 hover:text-accent hover:bg-neutral/50"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
