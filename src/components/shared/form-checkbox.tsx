'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type FormCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  valueLabel?: string;
};

export function FormCheckbox({
  id,
  label,
  checked,
  onChange,
  disabled,
  valueLabel,
}: FormCheckboxProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          disabled={disabled}
          onCheckedChange={(val) => onChange(val === true)}
        />

        {valueLabel ? (
          <span className="text-sm text-muted-foreground select-none">{valueLabel}</span>
        ) : null}
      </div>
    </div>
  );
}
