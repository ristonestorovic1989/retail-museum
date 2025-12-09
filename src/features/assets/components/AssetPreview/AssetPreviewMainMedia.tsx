'use client';

import { FileImage } from 'lucide-react';
import { getAssetUrl } from '@/lib/assets';
import type { AssetListItem } from '../../types';
import type { AssetKind } from '../../helpers';

interface AssetPreviewMainMediaProps {
  asset: AssetListItem;
  kind: AssetKind;
  zoom: number;
  rotation: number;
  fps?: number | null;
  bitrate?: string | null;
  currentPositionText: string;
}

export const AssetPreviewMainMedia = ({
  asset,
  kind,
  zoom,
  rotation,
  fps,
  bitrate,
  currentPositionText,
}: AssetPreviewMainMediaProps) => {
  const isImage = kind === 'image';
  const isVideo = kind === 'video';

  const imageUrl = isImage ? getAssetUrl(asset, { thumbnail: false }) : '';
  const videoUrl = isVideo ? getAssetUrl(asset, { thumbnail: false }) : '';

  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {isImage && (
        <div className="flex items-center justify-center max-h-full max-w-full px-2 md:px-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={asset.name}
              className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full rounded-md object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            />
          ) : (
            <div
              className="w-96 h-72 bg-linear-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center border border-white/10"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              }}
            >
              <FileImage className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>
      )}

      {isVideo && (
        <div className="relative w-full max-w-3xl px-2 md:px-4">
          <video
            src={videoUrl}
            controls
            playsInline
            className="aspect-video w-full rounded-lg bg-black object-contain border border-white/10"
            onError={(e) => {
              console.error('VIDEO ERROR:', e.currentTarget.error);
            }}
          >
            Your browser does not support the video tag.
          </video>

          {(fps || bitrate) && (
            <p className="text-xs text-white/60 mt-2 text-center">
              {fps && `${fps} FPS`}
              {fps && bitrate && ' · '}
              {bitrate && bitrate}
            </p>
          )}
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full text-white text-sm">
        {currentPositionText}
      </div>
    </div>
  );
};
