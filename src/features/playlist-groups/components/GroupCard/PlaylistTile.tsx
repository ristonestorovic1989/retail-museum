'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { Images, Eye, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';
import { getAssetUrl } from '@/lib/assets';
import { TFn } from '@/types/i18n';

export type PlaylistTileModel = {
  id: number;
  name: string;
  imageUrl?: string | null;
  duration?: string | null;
  numAssets?: number | null;
  dateOfCreation?: string | null;
};

type Props = {
  playlist: PlaylistTileModel;
  active?: boolean;
  onClick?: (id: number) => void;
  onPreview?: (id: number) => void;
  onRemove?: (id: number) => void;
  selectMode?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onCheckedChange?: (id: number, next: boolean) => void;

  t: TFn;
  className?: string;
};

export function PlaylistTile({
  playlist,
  active,
  onClick,
  onPreview,
  onRemove,
  selectMode = false,
  checked = false,
  disabled = false,
  onCheckedChange,
  t,
  className,
}: Props) {
  const thumbnailSrc = getAssetUrl(playlist.imageUrl ?? null);
  const durationLabel = playlist.duration ?? t('playlistGroups.groupCard.preview.unknownDuration');

  const assetsCount =
    typeof playlist.numAssets === 'number'
      ? playlist.numAssets
      : t('playlistGroups.groupCard.preview.unknownAssets');

  const toggleChecked = useCallback(() => {
    if (disabled) return;
    onCheckedChange?.(playlist.id, !checked);
  }, [checked, disabled, onCheckedChange, playlist.id]);

  const handleActivate = useCallback(() => {
    if (disabled) return;

    if (selectMode) {
      toggleChecked();
      return;
    }

    onClick?.(playlist.id);
  }, [disabled, selectMode, toggleChecked, onClick, playlist.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleActivate();
      }
    },
    [disabled, handleActivate],
  );

  const handleRemoveClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onRemove?.(playlist.id);
    },
    [disabled, onRemove, playlist.id],
  );

  const handlePreviewClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      onPreview?.(playlist.id);
    },
    [disabled, onPreview, playlist.id],
  );

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      toggleChecked();
    },
    [disabled, toggleChecked],
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      className={cn(
        'group relative w-full overflow-hidden rounded-lg border text-left transition',
        'border-border bg-transparent',
        !disabled && 'hover:bg-muted/20',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        active && !selectMode && 'border-accent bg-accent/10',
        selectMode && checked && !disabled ? 'ring-2 ring-primary' : '',
        className,
      )}
      title={playlist.name}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted/10">
        {thumbnailSrc ? (
          <Image
            src={thumbnailSrc}
            alt={playlist.name}
            fill
            sizes="(max-width: 640px) 50vw, 160px"
            className="object-cover"
            quality={90}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
            {t('playlistGroups.groupCard.noThumbnail')}
          </div>
        )}

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />

        {!selectMode && onRemove ? (
          <button
            type="button"
            onClick={handleRemoveClick}
            className={cn(
              'absolute right-2 top-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-md',
              'border border-white/15 bg-black/45 shadow-sm',
              'text-white/85',
              'opacity-0 scale-95 transition',
              'group-hover:opacity-100 group-hover:scale-100',
              'hover:bg-destructive/80 hover:border-destructive/70 hover:text-white',
              'focus-visible:opacity-100 focus-visible:scale-100 focus-visible:ring-2 focus-visible:ring-destructive',
              disabled ? 'pointer-events-none opacity-0' : 'cursor-pointer',
            )}
            aria-label={t('playlistGroups.groupCard.actions.removeFromGroup')}
            title={t('playlistGroups.groupCard.actions.removeFromGroup')}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        ) : null}

        {selectMode ? (
          <div
            className={cn('absolute left-2 top-2 z-20', disabled ? '' : 'cursor-pointer')}
            onClick={handleCheckboxClick}
          >
            <Checkbox checked={!!checked} disabled={disabled} />
          </div>
        ) : null}

        <div
          onClick={handlePreviewClick}
          className={cn(
            'absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2',
            'inline-flex h-12 w-12 items-center justify-center rounded-full',
            'border border-white/20 bg-black/55 text-white/95 shadow-sm',
            'opacity-0 scale-95 transition',
            'group-hover:opacity-100 group-hover:scale-100',
            disabled ? 'pointer-events-none opacity-0' : 'cursor-pointer',
            'hover:bg-accent/25 hover:text-accent hover:border-accent/60',
            'focus-visible:opacity-100 focus-visible:scale-100 focus-visible:ring-2 focus-visible:ring-accent',
          )}
          aria-label={t('playlistGroups.groupCard.preview.open')}
          title={t('playlistGroups.groupCard.preview.open')}
          role="button"
          tabIndex={-1}
        >
          <Eye className="h-6 w-6" />
        </div>

        <div className="absolute bottom-1.5 right-1.5 rounded bg-background/85 px-1.5 py-0.5 text-[9px] text-foreground shadow-sm">
          {durationLabel}
        </div>
      </div>

      <div className="px-2 py-1.5">
        <div className="line-clamp-2 text-sm font-semibold leading-snug">{playlist.name}</div>

        <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Images className="h-3 w-3 opacity-80" />
            {t('playlistGroups.groupCard.preview.assetsCountShort', { count: assetsCount })}
          </span>
          <span className="opacity-70">#{playlist.id}</span>
        </div>
      </div>

      {active && !selectMode ? (
        <div className="pointer-events-none absolute inset-0 ring-2 ring-accent/25" />
      ) : null}
    </div>
  );
}
