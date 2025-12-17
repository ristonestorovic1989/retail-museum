'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, X } from 'lucide-react';

import { PlaylistPreview } from './PlaylistPreview';
import type { PlaylistAssetPreview } from '../../types';
import type { PlaylistSummary } from '@/features/playlists/types';
import type { TFn } from '@/types/i18n';

type Props = {
  isOpen: boolean;
  playlist: PlaylistSummary | null;
  assets: PlaylistAssetPreview[];
  onClose: () => void;
  t: TFn;
};

export function PlaylistPreviewOverlay({ isOpen, playlist, assets, onClose, t }: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const intervalMs = playlist ? playlist.imageDuration * 1000 : 8000;

  useEffect(() => {
    if (!isOpen) setIsFullscreen(false);
  }, [isOpen, playlist?.id]);

  useEffect(() => {
    if (!isOpen || !isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen, isFullscreen]);

  if (!isOpen || !playlist) return null;

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-20'}>
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close preview backdrop"
      />

      <div
        className={
          isFullscreen ? 'absolute inset-0 flex' : 'absolute inset-3 sm:inset-4 lg:inset-5 flex'
        }
      >
        <div
          className="
            relative h-full w-full
            overflow-hidden rounded-xl border border-white/10
            bg-black/90 text-white shadow-2xl
          "
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
            <div className="min-w-0">
              <span className="block truncate text-sm font-medium">{playlist.name}</span>
              <span className="text-[11px] text-white/70">
                {t('playlistMeta.assets', { count: assets.length })}
                {' · '}
                {t('playlistMeta.duration', { duration: playlist.duration })}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="
                  text-white/80
                  hover:text-accent hover:bg-accent/30
                  focus-visible:ring-2 focus-visible:ring-accent
                "
                onClick={() => setIsFullscreen((v) => !v)}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>

              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="
                  text-white/80
                  hover:text-accent hover:bg-accent/30
                  focus-visible:ring-2 focus-visible:ring-accent
                "
                onClick={onClose}
                aria-label="Close preview"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            className={
              isFullscreen ? 'h-[calc(100%-44px)] p-2 sm:p-3' : 'h-[calc(100%-44px)] p-3 sm:p-4'
            }
          >
            <PlaylistPreview assets={assets} intervalMs={intervalMs} autoPlay onClose={onClose} />
          </div>
        </div>
      </div>
    </div>
  );
}
