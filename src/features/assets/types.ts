export enum AssetTypeId {
  Video = 1,
  Audio = 2,
  Image = 3,
  Document = 4,
}

export type AssetListItemApi = {
  id: number;
  guid: string;
  name: string;
  description: string | null;
  isDescriptionVisible: boolean;
  path: string;
  thumbnailPath: string;
  size: number;
  quality: string;
  format: string;
  uploadedBy: string;
  updatedBy: string | null;
  dateOfUploading: string;
  dateOfUpdate: string;
  active: boolean;
  archived: boolean;
  isDeleted: boolean;
  assetTypeId: AssetTypeId;
  companyId: number;
  tags: string[];
};

export type AssetListItem = {
  id: number;
  guid: string;
  name: string;
  description: string | null;
  isDescriptionVisible: boolean;
  path: string;
  thumbnailPath: string;
  size: number;
  quality: string;
  format: string;
  uploadedBy: string;
  updatedBy: string | null;
  dateOfUploading: string;
  dateOfUploadingFormatted: string;
  dateOfUpdate: string;
  active: boolean;
  archived: boolean;
  isDeleted: boolean;
  assetTypeId: AssetTypeId;
  companyId: number;
  tags: string[];
};

export type AssetsApiResponse = {
  items: AssetListItemApi[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export type AssetsQueryParams = {
  includeArchived?: boolean;
  tag?: string;
  searchTerm?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export type AssetsResult = {
  items: AssetListItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type AssetDetails = AssetListItem;

export type UploadAssets = {
  files: File[];
};

export type AssetStatus = 'Active' | 'Inactive' | 'Archived';
export type AssetType = 'image' | 'video' | 'audio' | 'document';

export type EditableAsset = AssetDetails & {
  status: AssetStatus;
  type: AssetType;
  category: string;
  favorite: boolean;
};

export type UpdateAssetRequest = {
  name: string;
  description: string;
  isDescriptionVisible: boolean;
  archived: boolean;
  active: boolean;
  tagsCsv: string;
};

export function mapAssetDetailsToEditable(asset: AssetDetails): EditableAsset {
  const status: AssetStatus = asset.archived ? 'Archived' : asset.active ? 'Active' : 'Inactive';

  let type: AssetType = 'image';
  switch (asset.assetTypeId) {
    case AssetTypeId.Image:
      type = 'image';
      break;
    case AssetTypeId.Video:
      type = 'video';
      break;
    case AssetTypeId.Audio:
      type = 'audio';
      break;
    case AssetTypeId.Document:
      type = 'document';
      break;
    default:
      type = 'image';
  }

  return {
    ...asset,
    status,
    type,
    category: 'Marketing',
    favorite: false,
  };
}

export function mapEditableToUpdateRequest(
  asset: EditableAsset,
  mainDescription: string,
): UpdateAssetRequest {
  const desc = mainDescription || asset.description || '';

  return {
    name: asset.name,
    description: desc,
    isDescriptionVisible: !!desc.trim(),
    archived: asset.status === 'Archived',
    active: asset.status === 'Active',
    tagsCsv: asset.tags.join(','),
  };
}

export type AssetEditViewModel = {
  id: number;
  name: string;
  format: string;
  size: number;
  dateOfUploadingFormatted: string;
  tags: string[];
  previewUrl: string | null;
  status: AssetStatus;
  type: AssetType;
};

export enum AssetOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
  Square = 'square',
  Unknown = 'unknown',
}
