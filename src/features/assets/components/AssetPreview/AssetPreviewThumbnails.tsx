'use client';

import { FileImage, Video } from 'lucide-react';
import type { AssetListItem } from '../../types';
import { getAssetUrl } from '@/lib/assets';
import { getAssetType } from '../../helpers';

interface AssetPreviewThumbnailsProps {
  assets: AssetListItem[];
  currentAssetId: number | null;
  onSelect: (asset: AssetListItem) => void;
}

export const AssetPreviewThumbnails = ({
  assets,
  currentAssetId,
  onSelect,
}: AssetPreviewThumbnailsProps) => {
  return (
    <div className="p-3 bg-black/50 backdrop-blur-sm">
      <div className="flex gap-2 justify-center overflow-x-auto">
        {assets.map((thumbAsset) => {
          const thumbUrl = getAssetUrl(thumbAsset, { thumbnail: true });
          const isCurrent = thumbAsset.id === currentAssetId;

          return (
            <button
              key={thumbAsset.id}
              onClick={() => onSelect(thumbAsset)}
              className={`shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                isCurrent
                  ? 'border-primary ring-2 ring-primary/50'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <div className="w-full h-full bg-muted flex items-center justify-center">
                {getAssetType(thumbAsset) === 'video' ? (
                  <Video className="h-6 w-6 text-muted-foreground" />
                ) : thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={thumbAsset.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FileImage className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
