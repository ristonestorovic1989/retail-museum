'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlaylistTile, type PlaylistTileModel } from './PlaylistTile';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { TFn } from '@/types/i18n';

type Props = {
  items: PlaylistTileModel[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onPreview?: (id: number) => void;
  onRemove?: (id: number) => void;
  isLoading?: boolean;
  error?: string | null;
  t: TFn;
  maxHeightPx?: number;
  className?: string;
};

export function PlaylistsMiniGrid({
  items,
  activeId,
  onSelect,
  onPreview,
  onRemove,
  isLoading,
  error,
  t,
  maxHeightPx = 240,
  className,
}: Props) {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentH, setContentH] = useState(0);

  useLayoutEffect(() => {
    const el = contentRef.current;

    if (!el || isLoading || error || items.length === 0) {
      setContentH(0);
      return;
    }

    const ro = new ResizeObserver(() => setContentH(el.scrollHeight));
    ro.observe(el);

    setContentH(el.scrollHeight);

    return () => ro.disconnect();
  }, [items.length, isLoading, error]);

  const needsScroll = contentH > maxHeightPx;

  const containerStyle = useMemo(
    () => (needsScroll ? { height: `${maxHeightPx}px` } : undefined),
    [needsScroll, maxHeightPx],
  );

  if (isLoading) {
    return (
      <div className={cn('flex min-h-30 items-center justify-center', className)}>
        <CenteredSpinner label={t('playlistGroups.groupCard.loadingPlaylists')} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('text-xs text-destructive', className)}>
        {t('playlistGroups.groupCard.failedToLoadPlaylists')} {error}
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className={cn('text-xs text-muted-foreground', className)}>
        {t('playlistGroups.groupCard.noPlaylistsFound')}
      </div>
    );
  }

  const grid = (
    <div ref={contentRef} className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 pb-1">
      {items.map((pl) => (
        <PlaylistTile
          key={pl.id}
          playlist={pl}
          active={activeId === pl.id}
          onClick={onSelect}
          onPreview={onPreview}
          onRemove={onRemove}
          t={t}
        />
      ))}
    </div>
  );

  return (
    <div className={cn('mt-2', className)}>
      {needsScroll ? (
        <ScrollArea className="pr-1" style={containerStyle}>
          {grid}
        </ScrollArea>
      ) : (
        grid
      )}
    </div>
  );
}
