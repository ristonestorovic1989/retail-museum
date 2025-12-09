'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

import { AssetOrientation, type AssetListItem } from '../types';
import { getAssetType, parseBitrate, parseFps, parseQuality } from '../helpers';
import { AssetPreviewToolbar } from './AssetPreview/AssetPreviewToolbar';
import { AssetPreviewMainMedia } from './AssetPreview/AssetPreviewMainMedia';
import { AssetPreviewThumbnails } from './AssetPreview/AssetPreviewThumbnails';
import { AssetPreviewInfoPanel } from './AssetPreview/AssetPreviewInfoPanel';
import { THUMBNAIL_WINDOW_SIZE } from '../constants';
import { getAssetUrl } from '@/lib/assets';

type AssetPreviewProps = {
  asset: AssetListItem | null;
  assets: AssetListItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (asset: AssetListItem) => void;
  onDelete: (asset: AssetListItem) => void;
  onDownload: (asset: AssetListItem) => Promise<void> | void;
};

export const AssetPreview = ({
  asset,
  assets,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onDownload,
}: AssetPreviewProps) => {
  const t = useTranslations('assets');

  const [currentAsset, setCurrentAsset] = useState<AssetListItem | null>(asset);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const [thumbnailWindowStart, setThumbnailWindowStart] = useState(0);

  useEffect(() => {
    if (!asset) return;

    setCurrentAsset(asset);
    setZoom(100);
    setRotation(0);

    const index = assets.findIndex((a) => a.id === asset.id);
    if (index !== -1) {
      const half = Math.floor(THUMBNAIL_WINDOW_SIZE / 2);
      const maxStart = Math.max(assets.length - THUMBNAIL_WINDOW_SIZE, 0);
      const newStart = Math.min(Math.max(index - half, 0), maxStart);
      setThumbnailWindowStart(newStart);
    }
  }, [asset, assets]);

  const currentIndex =
    currentAsset && assets.length ? assets.findIndex((a) => a.id === currentAsset.id) : -1;

  const navigateToAsset = useCallback(
    (direction: 'prev' | 'next') => {
      if (!assets.length) return;

      const safeIndex = currentIndex === -1 ? 0 : currentIndex;
      const newIndex =
        direction === 'prev'
          ? (safeIndex - 1 + assets.length) % assets.length
          : (safeIndex + 1) % assets.length;

      const newAsset = assets[newIndex];
      setCurrentAsset(newAsset);
      setZoom(100);
      setRotation(0);

      const half = Math.floor(THUMBNAIL_WINDOW_SIZE / 2);
      const maxStart = Math.max(assets.length - THUMBNAIL_WINDOW_SIZE, 0);
      const newStart = Math.min(Math.max(newIndex - half, 0), maxStart);
      setThumbnailWindowStart(newStart);
    },
    [assets, currentIndex],
  );

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          navigateToAsset('prev');
          break;
        case 'ArrowRight':
          navigateToAsset('next');
          break;
        case 'Escape':
          if (isFullscreen) {
            setIsFullscreen(false);
          } else {
            onOpenChange(false);
          }
          break;
        case '+':
        case '=':
          setZoom((prev) => Math.min(prev + 25, 300));
          break;
        case '-':
          setZoom((prev) => Math.max(prev - 25, 25));
          break;
        case 'r':
          setRotation((prev) => (prev + 90) % 360);
          break;
        case ' ':
          if (currentAsset && getAssetType(currentAsset) === 'video') {
            e.preventDefault();
          }
          break;
        case 'i':
          setShowInfo((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, navigateToAsset, isFullscreen, onOpenChange, currentAsset]);

  if (!currentAsset) return null;

  const kind = getAssetType(currentAsset);

  const { width, height } = parseQuality(currentAsset.quality);
  const fps = parseFps(currentAsset.quality);
  const bitrate = parseBitrate(currentAsset.quality);

  let orientation: AssetOrientation = AssetOrientation.Unknown;

  if (width && height) {
    if (width > height) {
      orientation = AssetOrientation.Landscape;
    } else if (width < height) {
      orientation = AssetOrientation.Portrait;
    } else {
      orientation = AssetOrientation.Square;
    }
  }

  const isActive = currentAsset.active;

  const statusLabel = isActive
    ? t('table.status.active', { defaultValue: 'Active' })
    : t('table.status.inactive', { defaultValue: 'Inactive' });

  const statusBadgeClasses = isActive
    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
    : 'bg-destructive/10 text-destructive border-destructive/30';

  const archivedLabel = t('edit.fields.status.options.archived', {
    defaultValue: 'Archived',
  });

  const deletedLabel = t('preview.status.deleted', {
    defaultValue: 'Deleted',
  });

  const dimensionsLabel = width && height ? `${width} × ${height}` : 'N/A';

  const visibleThumbnails = assets.slice(
    thumbnailWindowStart,
    thumbnailWindowStart + THUMBNAIL_WINDOW_SIZE,
  );

  const currentPositionText =
    currentIndex >= 0 ? `${currentIndex + 1} / ${assets.length}` : `- / ${assets.length}`;

  const handleDownload = () => {
    if (!currentAsset) return;
    onDownload(currentAsset);
  };

  const handleShare = () => {
    if (!currentAsset) return;

    const url = getAssetUrl(currentAsset, { thumbnail: false });

    if (!url) {
      toast.error(t('preview.share.errorTitle', { defaultValue: 'Unable to copy link' }));
      return;
    }

    navigator.clipboard.writeText(url);

    toast.success(t('preview.share.successTitle', { defaultValue: 'Link copied' }), {
      description: t('preview.share.successDescription', {
        defaultValue: 'Asset link has been copied to clipboard.',
      }),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`p-0 gap-0 overflow-hidden ${
          isFullscreen
            ? 'w-screen! h-screen! max-w-none! rounded-none'
            : 'w-[95vw]! max-w-6xl! h-[85vh]! rounded-2xl'
        }`}
      >
        <DialogTitle className="sr-only">
          {t('preview.title', { defaultValue: 'Asset preview' })}
        </DialogTitle>

        <div className="flex h-full min-h-0 flex-col md:flex-row">
          <div className="flex-1 flex flex-col bg-black/95 relative min-w-0 min-h-0">
            <AssetPreviewToolbar
              asset={currentAsset}
              t={t}
              zoom={zoom}
              isFullscreen={isFullscreen}
              showInfo={showInfo}
              statusLabel={statusLabel}
              statusBadgeClasses={statusBadgeClasses}
              archivedLabel={archivedLabel}
              onClose={() => onOpenChange(false)}
              onZoomIn={() => setZoom((prev) => Math.min(prev + 25, 300))}
              onZoomOut={() => setZoom((prev) => Math.max(prev - 25, 25))}
              onRotate={() => setRotation((prev) => (prev + 90) % 360)}
              onToggleInfo={() => setShowInfo((prev) => !prev)}
              onToggleFullscreen={() => setIsFullscreen((prev) => !prev)}
            />

            <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-0">
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => navigateToAsset('prev')}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-10 h-12 w-12 rounded-full bg-black/50 text-white hover:bg-black/70"
                onClick={() => navigateToAsset('next')}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>

              <AssetPreviewMainMedia
                asset={currentAsset}
                kind={kind}
                zoom={zoom}
                rotation={rotation}
                fps={fps}
                bitrate={bitrate}
                currentPositionText={currentPositionText}
              />
            </div>

            <AssetPreviewThumbnails
              assets={visibleThumbnails}
              currentAssetId={currentAsset?.id ?? null}
              onSelect={(selected) => setCurrentAsset(selected)}
            />
          </div>

          {showInfo && (
            <AssetPreviewInfoPanel
              asset={currentAsset}
              t={t}
              statusLabel={statusLabel}
              statusBadgeClasses={statusBadgeClasses}
              archivedLabel={archivedLabel}
              deletedLabel={deletedLabel}
              onEdit={onEdit}
              onDelete={onDelete}
              onDownload={handleDownload}
              onShare={handleShare}
              dimensionsLabel={dimensionsLabel}
              orientation={orientation}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
