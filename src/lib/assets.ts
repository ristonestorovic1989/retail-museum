import type { AssetListItem } from '@/features/assets/types';

type AssetLike = Pick<AssetListItem, 'path' | 'thumbnailPath'>;

export function getAssetUrl(
  assetOrPath: AssetLike | string | null | undefined,
  options?: { thumbnail?: boolean },
): string {
  if (!assetOrPath) return '';

  const rawPath =
    typeof assetOrPath === 'string'
      ? assetOrPath
      : options?.thumbnail
        ? assetOrPath.thumbnailPath
        : assetOrPath.path;

  if (!rawPath) return '';

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }

  const base = process.env.NEXT_PUBLIC_ASSETS_BASE_URL;
  if (base) {
    return `${base}${rawPath}`;
  }

  return rawPath;
}
