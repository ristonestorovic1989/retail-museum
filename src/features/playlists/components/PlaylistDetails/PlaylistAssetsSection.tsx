import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { TFn } from '@/types/i18n';
import { PlaylistDetails } from '../../types';

type Props = {
  t: TFn;
  playlist: PlaylistDetails;
  onAddAssets: () => void;
};

export function PlaylistAssetsSection({ t, playlist, onAddAssets }: Props) {
  const assets = playlist.assets ?? [];

  return (
    <div className="flex-1 min-h-0 pt-6 flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{t('playlists.details.assetsTitle')}</h3>
          <Badge variant="outline">{assets.length}</Badge>
        </div>

        <Button size="sm" variant="outline" className="gap-2" onClick={onAddAssets}>
          <Plus className="h-4 w-4" />
          {t('playlists.details.addAsset')}
        </Button>
      </div>

      {assets.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full rounded-xl border-2 border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('playlists.details.noAssets')}</p>
            <Button className="gap-2" onClick={onAddAssets}>
              <Plus className="h-4 w-4" />
              {t('playlists.details.addFirstAsset')}
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-2 pb-2">
            {assets.map((a) => (
              <div key={a.id} className="border rounded-xl p-3 flex gap-3">
                <div className="h-12 w-16 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                  {t('playlists.details.noImage')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">
                    {a.name || t('playlists.details.untitled')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('playlists.details.order', { order: a.order + 1 })}
                  </div>
                </div>
                <Badge variant="secondary">#{a.order + 1}</Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
