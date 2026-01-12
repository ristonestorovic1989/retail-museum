import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import type { TFn } from '@/types/i18n';
import { PlaylistDetails } from '../../types';

type Props = {
  t: TFn;
  playlist: PlaylistDetails;
  onEdit: () => void;
  onDelete: () => void;
};

export function PlaylistDetailsHeader({ t, playlist, onEdit, onDelete }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-2xl font-bold truncate">
          {playlist.name || t('playlists.details.untitled')}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t('playlists.details.meta', {
            assets: playlist.numAssets,
            duration: playlist.duration,
          })}
        </p>
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
