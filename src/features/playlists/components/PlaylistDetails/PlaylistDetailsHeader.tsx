import { Edit, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import type { TFn } from '@/types/i18n';
import type { PlaylistDetails } from '../../types';

type Props = {
  t: TFn;
  playlist: PlaylistDetails;
  onEdit: () => void;
  onDelete: () => void;
};

export function PlaylistDetailsHeader({ t, playlist, onEdit, onDelete }: Props) {
  const statusLabel = playlist.active
    ? t('playlists.list.statusActive')
    : t('playlists.list.statusInactive');

  const tags = playlist.tags ?? [];

  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-2xl font-bold truncate">
            {playlist.name || t('playlists.details.untitled')}
          </h2>

          <Badge
            className={cn(
              'shrink-0 h-6',
              playlist.active
                ? 'bg-success/10 text-success hover:bg-success/20'
                : 'bg-muted text-muted-foreground border border-border',
            )}
          >
            {statusLabel}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {t('playlists.details.meta', {
            assets: playlist.numAssets,
            duration: playlist.duration,
          })}
        </p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="default" className="text-xs font-normal cursor-default">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t('playlists.actions.edit')}
        </Button>

        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          {t('playlists.actions.delete')}
        </Button>
      </div>
    </div>
  );
}
