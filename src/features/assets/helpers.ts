import { AssetListItem } from './types';
import { AssetTypeId } from './types';

export type AssetKind = 'image' | 'video' | 'other';

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv', 'wmv'];
const IMAGE_EXTENSIONS = ['jpg', 'JPG', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'mjpeg'];

export const getAssetType = (asset: AssetListItem): AssetKind => {
  const source = asset.path || asset.name || '';
  const ext = source.split('.').pop()?.toLowerCase() ?? '';

  if (VIDEO_EXTENSIONS.includes(ext)) {
    return 'video';
  }

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return 'image';
  }

  switch (asset.assetTypeId) {
    case AssetTypeId.Video:
      return 'video';
    case AssetTypeId.Image:
      return 'image';
    default:
      return 'other';
  }
};

export const parseQuality = (quality?: string) => {
  const match = quality?.match?.(/(\d+)x(\d+)/);
  if (match) {
    return { width: parseInt(match[1], 10), height: parseInt(match[2], 10) };
  }
  return { width: null as number | null, height: null as number | null };
};

export const parseFps = (quality?: string) => {
  const match = quality?.match?.(/(\d+)\s*FPS/i);
  return match ? parseInt(match[1], 10) : null;
};

export const parseBitrate = (quality?: string) => {
  const match = quality?.match?.(/(\d+)\s*kb\/s/i);
  return match ? `${match[1]} kb/s` : null;
};
