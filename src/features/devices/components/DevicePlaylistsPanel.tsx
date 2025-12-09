'use client';

import { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { PlaylistSummary } from '../types';

type Props = {
  availablePlaylists: PlaylistSummary[];
  selectedPlaylistIds: number[];
  onChangeSelected: (next: number[]) => void;
};

export function DevicePlaylistsPanel({
  availablePlaylists,
  selectedPlaylistIds,
  onChangeSelected,
}: Props) {
  const t = useTranslations('devices.playlists');

  const selectedSet = useMemo(() => new Set(selectedPlaylistIds), [selectedPlaylistIds]);

  const toggle = (id: number) => {
    const next = new Set(selectedSet);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChangeSelected(Array.from(next));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">{t('availableTitle')}</h3>
              <p className="text-sm text-muted-foreground mb-4">{t('availableDescription')}</p>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto border rounded-md p-2">
              {availablePlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-2 py-2 px-2 hover:bg-muted/50 rounded-md"
                >
                  <Checkbox
                    id={`playlist-${playlist.id}`}
                    checked={selectedSet.has(playlist.id)}
                    onCheckedChange={() => toggle(playlist.id)}
                  />
                  <Label
                    htmlFor={`playlist-${playlist.id}`}
                    className="text-sm flex-1 cursor-pointer"
                  >
                    {playlist.name}
                  </Label>
                </div>
              ))}

              {availablePlaylists.length === 0 && (
                <div className="text-sm text-muted-foreground px-1 py-2">{t('empty')}</div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('previewTitle')}</h3>
            <div className="border rounded-lg overflow-hidden bg-muted/20 aspect-video flex items-center justify-center">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                <p className="text-white text-sm">{t('previewPlaceholder')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
