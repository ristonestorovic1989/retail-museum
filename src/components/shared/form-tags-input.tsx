'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Props = {
  id: string;
  label: string;
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  hint?: string;
  maxTags?: number;
  maxTagLength?: number;
  allowDuplicates?: boolean;
};

function normalizeTag(raw: string) {
  return raw.trim().replace(/\s+/g, ' ');
}

export function FormTagsInput({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder = 'Type and press Enter…',
  hint,
  maxTags = 50,
  maxTagLength = 40,
  allowDuplicates = false,
}: Props) {
  const [draft, setDraft] = useState('');

  const tags = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  useEffect(() => {}, [tags]);

  const addTag = (raw: string) => {
    if (disabled) return;

    const t = normalizeTag(raw);
    if (!t) return;

    const trimmed = t.slice(0, maxTagLength);

    if (!allowDuplicates) {
      const exists = tags.some((x) => x.toLowerCase() === trimmed.toLowerCase());
      if (exists) return;
    }

    if (tags.length >= maxTags) return;

    onChange([...tags, trimmed]);
  };

  const removeTag = (tag: string) => {
    if (disabled) return;
    onChange(tags.filter((t) => t !== tag));
  };

  const clearDraft = () => setDraft('');

  const commitDraft = () => {
    addTag(draft);
    clearDraft();
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commitDraft();
      return;
    }

    if (e.key === 'Backspace' && !draft && tags.length > 0) {
      e.preventDefault();
      onChange(tags.slice(0, -1));
      return;
    }
  };

  const onPaste: React.ClipboardEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;

    const text = e.clipboardData.getData('text');
    const parts = text
      .split(/[,|\n]/g)
      .map((x) => normalizeTag(x))
      .filter(Boolean);
    if (parts.length <= 1) return;

    e.preventDefault();

    const next = [...tags];
    for (const p of parts) {
      if (next.length >= maxTags) break;
      const tag = p.slice(0, maxTagLength);
      if (!allowDuplicates && next.some((x) => x.toLowerCase() === tag.toLowerCase())) continue;
      next.push(tag);
    }
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className={cn('rounded-md border bg-background px-2 py-2', disabled && 'opacity-70')}>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1">
              <span className="max-w-[220px] truncate">{t}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => removeTag(t)}
                disabled={disabled}
                aria-label={`Remove tag ${t}`}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </Badge>
          ))}

          <Input
            id={id}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            disabled={disabled}
            placeholder={placeholder}
            className="h-8 w-[220px] border-0 px-0 shadow-none focus-visible:ring-0"
          />
        </div>
      </div>

      {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
