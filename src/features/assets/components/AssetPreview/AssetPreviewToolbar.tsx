'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Info, Maximize, Minimize, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { AssetListItem } from '../../types';
import { getAssetType } from '../../helpers';
import { TFn } from '@/types/i18n';

interface AssetPreviewToolbarProps {
  asset: AssetListItem;
  t: TFn;
  zoom: number;
  isFullscreen: boolean;
  showInfo: boolean;
  statusLabel: string;
  statusBadgeClasses: string;
  archivedLabel: string;
  onClose: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotate: () => void;
  onToggleInfo: () => void;
  onToggleFullscreen: () => void;
}

export const AssetPreviewToolbar = ({
  asset,
  t,
  zoom,
  isFullscreen,
  showInfo,
  statusLabel,
  statusBadgeClasses,
  archivedLabel,
  onClose,
  onZoomIn,
  onZoomOut,
  onRotate,
  onToggleInfo,
  onToggleFullscreen,
}: AssetPreviewToolbarProps) => {
  const kind = getAssetType(asset);
  const isImage = kind === 'image';

  return (
    <div className="flex items-center justify-between p-3 bg-black/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        <span className="text-white font-medium truncate max-w-[220px]">{asset.name}</span>
        <Badge variant="outline" className="text-white border-white/30">
          {asset.format.toUpperCase()}
        </Badge>
        <Badge className={`border px-2 py-0.5 text-xs ${statusBadgeClasses}`}>{statusLabel}</Badge>
        {asset.archived && (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
            {archivedLabel}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isImage && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 bg-white/20 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={onRotate}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleInfo}
          className={`hover:bg-accent/10 ${
            showInfo ? 'text-accent hover:bg-white/50' : 'text-white hover:bg-white/50'
          }`}
        >
          <Info className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={onToggleFullscreen}
        >
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
