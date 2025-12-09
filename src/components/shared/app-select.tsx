'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption<T extends string = string> = {
  value: T;
  label: React.ReactNode;
};

type AppSelectProps<T extends string = string> = {
  id?: string;
  label?: string;
  placeholder?: string;
  value?: T;
  onChange?: (value: T) => void;
  options: SelectOption<T>[];

  disabled?: boolean;
  required?: boolean;

  helperText?: string;
  error?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
};

export function AppSelect<T extends string = string>({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled,
  required,
  helperText,
  error,
  className,
  triggerClassName,
  contentClassName,
}: AppSelectProps<T>) {
  const selectId = id ?? React.useId();
  const describedById = helperText || error ? `${selectId}-description` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={selectId} className={cn(error && 'text-destructive')}>
          {label}
          {required ? <span className="text-destructive ml-0.5">*</span> : null}
        </Label>
      )}

      <RadixSelect value={value} onValueChange={(v) => onChange?.(v as T)} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          aria-describedby={describedById}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className={contentClassName}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </RadixSelect>

      {(helperText || error) && (
        <p
          id={describedById}
          className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}
