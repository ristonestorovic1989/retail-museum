'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type FormTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  disabled?: boolean;
};

export function FormTextarea({
  id,
  label,
  value,
  onChange,
  rows = 4,
  disabled,
}: FormTextareaProps) {
  return (
    <div className="space-y-2 w-full">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        rows={rows}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
