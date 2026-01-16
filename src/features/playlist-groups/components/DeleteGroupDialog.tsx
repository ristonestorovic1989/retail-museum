'use client';

import { AppDialog } from '@/components/shared/app-dialog';
import type { PlaylistGroup } from '../types';
import { useTranslations } from 'next-intl';

type Props = {
  group: PlaylistGroup | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isDeleting: boolean;
  onConfirm: () => void | Promise<void>;
};

export function DeleteGroupDialog({ group, open, onOpenChange, isDeleting, onConfirm }: Props) {
  const t = useTranslations('playlistGroups.dialogs.deleteGroup');

  const hasGroup = !!group;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t('title')}
      description={hasGroup ? t('description', { name: group.name }) : t('descriptionFallback')}
      cancelLabel={t('cancel')}
      primaryAction={{
        label: isDeleting ? t('deleting') : t('confirm'),
        variant: 'destructive',
        onClick: onConfirm,
        disabled: !hasGroup || isDeleting,
      }}
      children={undefined}
    />
  );
}
