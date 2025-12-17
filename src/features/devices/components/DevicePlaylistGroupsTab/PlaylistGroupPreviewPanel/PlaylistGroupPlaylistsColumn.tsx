'use client';

import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getAssetUrl } from '@/lib/assets';
import type { PlaylistSummary } from '@/features/playlists/types';
import type { TFn } from '@/types/i18n';
import { PlaylistGroupSummary } from '@/features/devices/types';

type Props = {
  group: PlaylistGroupSummary;
  selectedPlaylists: PlaylistSummary[];
  activePlaylistId: number | null;
  onPlaylistClick: (playlistId: number) => void;
  t: TFn;
};

export function PlaylistGroupPlaylistsColumn({
  group,
  selectedPlaylists,
  activePlaylistId,
  onPlaylistClick,
  t,
}: Props) {
  const hasPlaylists = selectedPlaylists.length > 0;

  return (
    <div className="flex w-72 flex-col">
      <div className="flex h-full flex-col rounded-md bg-black/70 p-3 shadow-lg">
        <div className="mb-3 space-y-1 shrink-0">
          <p className="text-xs font-semibold wrap-break-word">
            {t('playlistsTitle', {
              count: selectedPlaylists.length,
            })}
          </p>
          <p className="text-[11px] text-white/80">
            {t('meta.duration', { duration: group.duration })}
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full pr-1">
            {hasPlaylists ? (
              <div className="space-y-2 pb-1">
                {selectedPlaylists.map((playlist) => {
                  const isActive = playlist.id === activePlaylistId;
                  const thumbnailSrc = getAssetUrl(playlist.imageUrl ?? null);

                  return (
                    <button
                      key={playlist.id}
                      type="button"
                      onClick={() => onPlaylistClick(playlist.id)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1.5 text-left text-[11px]',
                        'cursor-pointer transition-colors hover:border-white/40',
                        isActive && 'border-cyan-400 bg-cyan-500/20',
                      )}
                    >
                      <div className="relative h-8 w-10 shrink-0 overflow-hidden rounded-sm bg-black/60">
                        {thumbnailSrc ? (
                          <Image
                            src={thumbnailSrc}
                            alt={playlist.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[9px] text-white/60">
                            PL
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between gap-2">
                          <span className="line-clamp-2 wrap-break-word font-semibold">
                            {playlist.name}
                          </span>
                          <span className="whitespace-nowrap text-white/70">
                            {t('playlistMeta.duration', {
                              duration: playlist.duration,
                            })}
                          </span>
                        </div>

                        <div className="mt-0.5 flex justify-between gap-2 text-white/70">
                          <span>
                            {t('playlistMeta.assets', {
                              count: playlist.numAssets,
                            })}
                          </span>
                          <span className="whitespace-nowrap opacity-75">
                            {playlist.dateOfCreation}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-3 text-[11px] text-white/60">{t('noPlaylistsInGroupHint')}</p>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
