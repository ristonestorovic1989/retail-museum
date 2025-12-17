'use client';

import Image from 'next/image';
import { Settings } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getAssetUrl } from '@/lib/assets';

import type { PlaylistGroupSummary, PlaylistAssetPreview } from '../../types';
import type { PlaylistSummary } from '@/features/playlists/types';

import { TFn } from '@/types/i18n';
import { PlaylistGroupInfoColumn } from './PlaylistGroupPreviewPanel/PlaylistGroupInfoColumn';
import { PlaylistGroupPlaylistsColumn } from './PlaylistGroupPreviewPanel/PlaylistGroupPlaylistsColumn';
import { PlaylistPreviewOverlay } from './PlaylistPreviewOverlay';

type Props = {
  group: PlaylistGroupSummary | null;
  selectedPlaylists: PlaylistSummary[];
  playlistAssetsById: Record<number, PlaylistAssetPreview[]>;
  activePlaylistId: number | null;
  isPreviewOpen: boolean;
  onPlaylistClick: (playlistId: number) => void;
  onClosePreview: () => void;
  t: TFn;
};

export function PlaylistGroupPreviewPanel({
  group,
  selectedPlaylists,
  playlistAssetsById,
  activePlaylistId,
  isPreviewOpen,
  onPlaylistClick,
  onClosePreview,
  t,
}: Props) {
  const bgImageSrc = getAssetUrl(group?.backgroundUrl);

  const activePlaylist =
    activePlaylistId != null
      ? (selectedPlaylists.find((p) => p.id === activePlaylistId) ?? null)
      : null;

  const activeAssets = activePlaylist?.assets ?? [];

  const previewPlaceholder = (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/20 px-4 text-center text-sm text-muted-foreground">
      {t('previewPlaceholder')}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-cyan-600" />
        <h3 className="text-sm font-medium">{t('previewTitle')}</h3>
      </div>

      <div className="relative h-[430px] md:h-[480px] lg:h-[520px] overflow-hidden rounded-lg border">
        {!group && previewPlaceholder}

        {group && (
          <>
            {bgImageSrc ? (
              <>
                <Image
                  src={bgImageSrc}
                  alt={group.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw,
                    (max-width: 1024px) 50vw,
                    33vw"
                />
                <div className="absolute inset-0 bg-black/65" />
              </>
            ) : (
              <div className="absolute inset-0 bg-muted/20" />
            )}

            <div className="relative z-10 flex h-full gap-6 p-5 text-white">
              <PlaylistGroupInfoColumn group={group} />

              <PlaylistGroupPlaylistsColumn
                group={group}
                selectedPlaylists={selectedPlaylists}
                activePlaylistId={activePlaylistId}
                onPlaylistClick={onPlaylistClick}
                t={t}
              />
            </div>

            <PlaylistPreviewOverlay
              isOpen={isPreviewOpen}
              playlist={activePlaylist}
              assets={activeAssets}
              onClose={onClosePreview}
              t={t}
            />
          </>
        )}
      </div>
    </div>
  );
}
