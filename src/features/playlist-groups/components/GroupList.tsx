'use client';

import { TFn } from '@/types/i18n';
import type { PlaylistGroup } from '../types';
import { GroupCard } from './GroupCard';
import { CenteredSpinner } from '@/components/shared/centered-spiner';

type Props = {
  groups: PlaylistGroup[];
  expandedIds: number[];
  isLoading: boolean;
  error: string | null;
  onToggleExpanded: (groupId: number) => void;
  onEditGroup: (group: PlaylistGroup) => void;
  onDeleteGroup: (group: PlaylistGroup) => void;
  onExportExcel: (group: PlaylistGroup) => void;
  onAddPlaylist: (group: PlaylistGroup) => void;
  t: TFn;
};

export function GroupList({
  groups,
  expandedIds,
  isLoading,
  error,
  onToggleExpanded,
  onEditGroup,
  onDeleteGroup,
  onExportExcel,
  onAddPlaylist,
  t,
}: Props) {
  if (isLoading) {
    return <CenteredSpinner label={t('playlistGroups.list.loading')} />;
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-destructive/10 p-6 text-sm text-destructive">
        {t('playlistGroups.list.loadFailed')} {error}
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="rounded-lg border bg-muted/20 p-6 text-sm text-muted-foreground">
        {t('playlistGroups.list.empty')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <GroupCard
          key={group.id}
          group={group}
          isExpanded={expandedIds.includes(group.id)}
          onToggle={() => onToggleExpanded(group.id)}
          onEdit={() => onEditGroup(group)}
          onDelete={() => onDeleteGroup(group)}
          onExportExcel={() => onExportExcel(group)}
          t={t}
        />
      ))}
    </div>
  );
}
