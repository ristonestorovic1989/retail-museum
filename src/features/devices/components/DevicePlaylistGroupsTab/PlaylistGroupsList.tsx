'use client';

import { useTranslations } from 'next-intl';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { PlaylistGroupSummary } from '../../types';
import { ListMusic } from 'lucide-react';

type Props = {
  groups: PlaylistGroupSummary[];
  selectedGroupId: number | null;
  isEditing: boolean;
  onSelect: (groupId: number) => void;
};

export function PlaylistGroupsList({ groups, selectedGroupId, isEditing, onSelect }: Props) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <ListMusic className="h-4 w-4 text-cyan-600" />
        <h3 className="text-sm font-medium">{t('devices.playlistGroups.title')}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{t('devices.playlistGroups.description')}</p>

      <ScrollArea className="max-h-175 overflow-x-hidden rounded-md border">
        <div className="py-1">
          {groups.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">{t('empty')}</div>
          )}

          {groups.map((group) => {
            const isSelected = selectedGroupId === group.id;

            return (
              <div
                key={group.id}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-2 px-3 py-2 text-left text-sm hover:bg-muted/60',
                  'transition-colors',
                  isSelected && 'bg-muted',
                )}
                onClick={() => onSelect(group.id)}
              >
                <Checkbox
                  checked={isSelected}
                  disabled={!isEditing}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onCheckedChange={() => {
                    if (!isEditing) return;
                    onSelect(group.id);
                  }}
                  className={cn(!isEditing && 'cursor-default')}
                />

                <div className="flex min-w-0 flex-col">
                  <span className="wrap-break-word font-medium">{group.name}</span>
                  <span className="wrap-break-word text-xs text-muted-foreground">
                    {t('devices.playlistGroups.meta.duration', { duration: group.duration })}
                    {' · '}
                    {t('devices.playlistGroups.meta.numPlaylists', {
                      count: group.numberOfPlaylists,
                    })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
