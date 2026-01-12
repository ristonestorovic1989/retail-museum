'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '@/components/shared/app-dialog';
import { FormInput } from '@/components/shared/form-input';
import { FormCheckbox } from '@/components/shared/form-checkbox';
import { FormTagsInput } from '@/components/shared/form-tags-input';

import type { TFn } from '@/types/i18n';
import type { CreatePlaylistPayload } from '../types';
import { useCreatePlaylistMutation } from '../api.client';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  onCreated?: (newId: number) => void;
};

export function PlaylistCreateDialog({ t, open, onOpenChange, companyId, onCreated }: Props) {
  const mutation = useCreatePlaylistMutation(t);

  const [name, setName] = useState('');
  const [transitionName, setTransitionName] = useState('none');
  const [tags, setTags] = useState<string[]>([]);
  const [imageDurationText, setImageDurationText] = useState('15');
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!open) return;

    setName('');
    setTransitionName('none');
    setTags([]);
    setImageDurationText('15');
    setActive(true);
  }, [open]);

  const imageDuration = useMemo(() => {
    const n = Number(imageDurationText);
    if (!Number.isFinite(n) || n < 1) return 15;
    return Math.floor(n);
  }, [imageDurationText]);

  const canSave = name.trim().length > 0 && !mutation.isPending;

  const onCreate = async () => {
    const payload: CreatePlaylistPayload = {
      name: name.trim(),
      imageUrl: '',
      transitionName: transitionName?.trim() ?? 'none',
      tags,
      imageDuration,
      active,
      companyId,
      assetIds: [],
    };

    const newId = await mutation.mutateAsync(payload);
    onOpenChange(false);
    onCreated?.(newId);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('playlists.create.title', { defaultValue: 'Create playlist' })}
      description={t('playlists.create.description', { defaultValue: 'Create a new playlist.' })}
      isBusy={mutation.isPending}
      cancelLabel={t('playlists.common.cancel', { defaultValue: 'Cancel' })}
      primaryAction={{
        label: mutation.isPending
          ? t('playlists.common.creating', { defaultValue: 'Creating…' })
          : t('playlists.common.create', { defaultValue: 'Create' }),
        onClick: onCreate,
        disabled: !canSave,
      }}
      onRequestClose={() => {
        if (mutation.isPending) return;
      }}
    >
      <div className="space-y-4">
        <FormInput
          id="pl-create-name"
          label={t('playlists.fields.name', { defaultValue: 'Name' })}
          value={name}
          onChange={setName}
          disabled={mutation.isPending}
        />

        <FormTagsInput
          id="pl-create-tags"
          label={t('playlists.fields.tags', { defaultValue: 'Tags' })}
          value={tags}
          onChange={setTags}
          disabled={mutation.isPending}
          placeholder={t('playlists.fields.tagsPlaceholder', {
            defaultValue: 'Type a tag and press Enter…',
          })}
          hint={t('playlists.fields.tagsHint', {
            defaultValue: 'Press Enter or comma to add a tag. Backspace removes the last tag.',
          })}
        />

        <FormInput
          id="pl-create-imgdur"
          label={t('playlists.fields.imageDuration', { defaultValue: 'Image duration (seconds)' })}
          value={imageDurationText}
          onChange={setImageDurationText}
          disabled={mutation.isPending}
        />

        <FormCheckbox
          id="pl-create-active"
          label={t('playlists.fields.status', { defaultValue: 'Status' })}
          checked={active}
          onChange={setActive}
          disabled={mutation.isPending}
          valueLabel={
            active
              ? t('playlists.common.active', { defaultValue: 'Active' })
              : t('playlists.common.inactive', { defaultValue: 'Inactive' })
          }
        />
      </div>
    </AppDialog>
  );
}
