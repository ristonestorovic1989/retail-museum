'use client';

import { useEffect, useMemo, useState } from 'react';

import { AppDialog } from '@/components/shared/app-dialog';
import { FormInput } from '@/components/shared/form-input';
import { FormCheckbox } from '@/components/shared/form-checkbox';
import { FormTagsInput } from '@/components/shared/form-tags-input';

import type { TFn } from '@/types/i18n';
import type { PlaylistDetails, UpdatePlaylistPayload } from '../types';
import { useUpdatePlaylistMutation } from '../api.client';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: number;
  playlist: PlaylistDetails;
};

function getPlaylistImageUrl(p: PlaylistDetails): string {
  const anyP = p as any;
  return String(anyP.imageUrl ?? anyP.imageURL ?? '');
}

export function PlaylistEditDialog({ t, open, onOpenChange, companyId, playlist }: Props) {
  const mutation = useUpdatePlaylistMutation(playlist.id, t);

  const [name, setName] = useState<string>(playlist.name ?? '');

  const [tags, setTags] = useState<string[]>(
    ((playlist as PlaylistDetails).tags ?? []) as string[],
  );

  const [imageDurationText, setImageDurationText] = useState<string>(
    String(
      (playlist as any).imageDurationSeconds ?? (playlist as PlaylistDetails).imageDuration ?? 15,
    ),
  );
  const [active, setActive] = useState<boolean>((playlist as PlaylistDetails).active ?? true);

  useEffect(() => {
    if (!open) return;

    setName(playlist.name ?? '');
    setTags(((playlist as PlaylistDetails).tags ?? []) as string[]);
    setImageDurationText(
      String(
        (playlist as PlaylistDetails).imageDuration ??
          (playlist as PlaylistDetails).imageDuration ??
          15,
      ),
    );
    setActive((playlist as PlaylistDetails).active ?? true);
  }, [open, playlist.id]);

  const imageDuration = useMemo(() => {
    const n = Number(imageDurationText);
    if (!Number.isFinite(n) || n < 1) return 15;
    return Math.floor(n);
  }, [imageDurationText]);

  const canSave = name.trim().length > 0 && !mutation.isPending;

  const onSave = async () => {
    const payload: UpdatePlaylistPayload = {
      name: name.trim(),
      imageUrl: getPlaylistImageUrl(playlist),
      tags,
      imageDuration,
      companyId,
      active,
    } as any;

    await mutation.mutateAsync(payload);
    onOpenChange(false);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('playlists.edit.title', { defaultValue: 'Edit playlist' })}
      description={t('playlists.edit.description', { defaultValue: 'Update playlist settings.' })}
      isBusy={mutation.isPending}
      cancelLabel={t('playlists.common.cancel', { defaultValue: 'Cancel' })}
      primaryAction={{
        label: mutation.isPending
          ? t('playlists.common.saving', { defaultValue: 'Saving…' })
          : t('playlists.common.save', { defaultValue: 'Save' }),
        onClick: onSave,
        disabled: !canSave,
      }}
      onRequestClose={() => {
        if (mutation.isPending) return;
      }}
    >
      <div className="space-y-4">
        <FormInput
          id="pl-name"
          label={t('playlists.fields.name', { defaultValue: 'Name' })}
          value={name}
          onChange={setName}
          disabled={mutation.isPending}
        />

        <FormTagsInput
          id="pl-tags"
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
          id="pl-imgdur"
          label={t('playlists.fields.imageDuration', { defaultValue: 'Image duration (seconds)' })}
          value={imageDurationText}
          onChange={setImageDurationText}
          disabled={mutation.isPending}
        />

        <FormCheckbox
          id="pl-active"
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
