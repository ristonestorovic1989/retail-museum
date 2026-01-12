'use client';

import type { TFn } from '@/types/i18n';
import { useDeletePlaylistMutation } from '../api.client';
import { AppDialog } from '@/components/shared/app-dialog';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playlistId: number;
  playlistName: string;
  onDeleted: () => void;
};

export function PlaylistDeleteDialog({
  t,
  open,
  onOpenChange,
  playlistId,
  playlistName,
  onDeleted,
}: Props) {
  const mutation = useDeletePlaylistMutation(t);

  const onConfirm = async () => {
    await mutation.mutateAsync(playlistId);
    onDeleted();
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('playlists.delete.title', { defaultValue: 'Delete playlist' })}
      description={t('playlists.delete.description', {
        defaultValue: 'This will permanently delete "{name}".',
        name: playlistName,
      })}
      isBusy={mutation.isPending}
      cancelLabel={t('playlists.common.cancel', { defaultValue: 'Cancel' })}
      primaryAction={{
        label: mutation.isPending
          ? t('playlists.common.deleting', { defaultValue: 'Deleting…' })
          : t('playlists.delete.confirm', { defaultValue: 'Delete' }),
        onClick: onConfirm,
        disabled: mutation.isPending,
        variant: 'destructive',
      }}
      onRequestClose={() => {
        if (mutation.isPending) return;
      }}
      children={undefined}
    />
  );
}
