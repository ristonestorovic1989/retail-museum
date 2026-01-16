'use client';

import { AppDialog } from '@/components/shared/app-dialog';
import { useTranslations } from 'next-intl';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;

  groupName: string | null;
  playlistName: string | null;

  isRemoving: boolean;
  onConfirm: () => void | Promise<void>;
};

export function RemovePlaylistFromGroupDialog({
  open,
  onOpenChange,
  groupName,
  playlistName,
  isRemoving,
  onConfirm,
}: Props) {
  const t = useTranslations('playlistGroups.dialogs.removePlaylist');

  const hasData = !!groupName && !!playlistName;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={
        hasData
          ? t('description', { playlist: playlistName, group: groupName })
          : t('descriptionFallback')
      }
      cancelLabel={t('cancel')}
      primaryAction={{
        label: isRemoving ? t('removing') : t('confirm'),
        variant: 'destructive',
        onClick: onConfirm,
        disabled: !hasData || isRemoving,
      }}
      children={undefined}
    />
  );
}
