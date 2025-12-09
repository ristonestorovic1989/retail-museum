'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { PlaylistAssetPreview } from '../types';
import { getAssetUrl } from '@/lib/assets';

type Props = {
  assets: PlaylistAssetPreview[];
  intervalMs?: number;
  autoPlay?: boolean;
  showControls?: boolean;
};

export function PlaylistPreview({
  assets,
  intervalMs = 10000,
  autoPlay = true,
  showControls = true,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    if (!autoPlay || assets.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % assets.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [assets.length, autoPlay, intervalMs]);

  if (!assets || assets.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground px-4 text-center bg-muted/20">
        No assets in this playlist.
      </div>
    );
  }

  const current = assets[currentIndex];
  const imageSrc = getAssetUrl(current.imageUrl ?? null);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + assets.length) % assets.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % assets.length);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden rounded-md">
      {/* Slika / asset */}
      <div className="relative w-full h-full">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={current.name || 'Playlist asset'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-white/70 bg-black/60">
            {current.name || 'Asset'}
          </div>
        )}
      </div>

      {/* Info overlay dole */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 py-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-white/80 truncate">{current.name || 'Untitled asset'}</p>
          <p className="text-[11px] text-white/60">
            {current.order != null && (
              <span>
                {current.order + 1} / {assets.length}
              </span>
            )}
          </p>
        </div>

        {showControls && assets.length > 1 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 border border-white/20"
            >
              <ChevronLeft className="h-4 w-4 text-white" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 hover:bg-black/80 border border-white/20"
            >
              <ChevronRight className="h-4 w-4 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
