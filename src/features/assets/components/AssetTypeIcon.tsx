'use client';

import { ImageIcon, Video, Music2, FileText } from 'lucide-react';
import type { AssetType } from '../types';

type Props = {
  type: AssetType;
  className?: string;
};

export const getAssetTypeFromId = (assetTypeId: number): AssetType => {
  switch (assetTypeId) {
    case 1:
      return 'audio';
    case 2:
      return 'video';
    case 3:
      return 'image';
    case 4:
      return 'document';
    default:
      return 'image';
  }
};

export function AssetTypeIcon({ type, className }: Props) {
  const common = `inline-block ${className ?? 'h-3 w-3'}`;

  switch (type) {
    case 'image':
      return <ImageIcon className={common} />;
    case 'video':
      return <Video className={common} />;
    case 'audio':
      return <Music2 className={common} />;
    case 'document':
      return <FileText className={common} />;
    default:
      return <ImageIcon className={common} />;
  }
}
