'use client';

import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Option = {
  value: string;
  label: ReactNode;
};

type FormSelectProps = {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: ReactNode;
  className?: string;
  disabled?: boolean;
};

export function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  className,
  disabled,
}: FormSelectProps) {
  return (
    <div className={className ?? 'space-y-2 w-full'}>
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger id={id} className="w-full" disabled={disabled}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
