export const ASSET_TYPES = ['image', 'video', 'audio', 'document'] as const;
export type AssetType = (typeof ASSET_TYPES)[number];

export const ASSET_CATEGORIES = ['Marketing', 'Product', 'Branding', 'Info'] as const;
export type AssetCategory = (typeof ASSET_CATEGORIES)[number];

export const ASSET_STATUSES = ['Active', 'Inactive', 'Archived'] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const ASSET_STATUS_TRANSLATION_KEYS: Record<Lowercase<AssetStatus>, string> = {
  active: 'fields.status.options.active',
  inactive: 'fields.status.options.inactive',
  archived: 'fields.status.options.archived',
};

export const ASSET_TYPE_TRANSLATION_KEYS: Record<AssetType, string> = {
  image: 'fields.type.options.image',
  video: 'fields.type.options.video',
  audio: 'fields.type.options.audio',
  document: 'fields.type.options.document',
};

export const ASSET_CATEGORY_TRANSLATION_KEYS: Record<Lowercase<AssetCategory>, string> = {
  marketing: 'fields.category.options.marketing',
  product: 'fields.category.options.product',
  branding: 'fields.category.options.branding',
  info: 'fields.category.options.info',
};

export const LANGUAGE_OPTIONS = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'sr', flag: '🇷🇸' },
  { code: 'de', flag: '🇩🇪' },
  { code: 'fr', flag: '🇫🇷' },
  { code: 'es', flag: '🇪🇸' },
  { code: 'it', flag: '🇮🇹' },
  { code: 'ru', flag: '🇷🇺' },
  { code: 'zh', flag: '🇨🇳' },
] as const;

export type LanguageCode = (typeof LANGUAGE_OPTIONS)[number]['code'];

export const THUMBNAIL_WINDOW_SIZE = 10;
export const DEFAULT_VIDEO_DURATION = 180;
