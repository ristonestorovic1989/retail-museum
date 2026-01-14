export type ApiResponse<T> = {
  succeeded: boolean;
  message: string | null;
  data: T;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export type PlaylistAssetApiItem = {
  id: number;
  name: string | null;
  imageUrl: string | null;
};

export type PlaylistApiItem = {
  id: number;
  name: string;
  imageURL: string | null;
  creationDate: string;
  dateOfCreation: string;
  duration: string;
  numberOfAssets: number;
  imageDuration: number;
  assetIds: number[];
  assets?: PlaylistAssetApiItem[];
  tags: string[];
  devices?: unknown[];
  active: boolean;
};

export type PlaylistDeviceApiItem = {
  id: number;
  name: string;
};

export type PlaylistDetailsApiItem = {
  id: number;
  name: string;
  imageURL: string | null;
  creationDate: string;
  dateOfCreation: string;
  duration: string;
  numberOfAssets: number;
  imageDuration: number;
  assetIds: number[];
  tags: string[];
  assets?: PlaylistAssetApiItem[];
  devices: PlaylistDeviceApiItem[];
  active: boolean;
};

export type PlaylistsApiResponse = ApiResponse<PagedResult<PlaylistApiItem>>;
export type PlaylistDetailsApiResponse = ApiResponse<PlaylistDetailsApiItem>;

export type PlaylistAssetPreview = {
  id: number;
  name: string | null;
  imageUrl: string | null;
  order: number;
};

export type PlaylistSummary = {
  id: number;
  name: string;
  imageUrl: string | null;
  creationDate: string | null;
  dateOfCreation: string;
  duration: string;
  numAssets: number;
  imageDuration: number;
  assetIds: number[];
  tags: string[];
  assets?: PlaylistAssetPreview[];
  active: boolean;
};

export type PlaylistDevice = {
  id: number;
  name: string;
};

export type PlaylistDetails = {
  id: number;
  name: string;
  imageUrl: string | null;
  creationDate: string;
  dateOfCreation: string;
  duration: string;
  numAssets: number;
  imageDuration: number;
  assetIds: number[];
  tags: string[];
  assets: PlaylistAssetPreview[];
  devices: PlaylistDevice[];
  active: boolean;
};

export type PlaylistsListResponse = {
  items: PlaylistSummary[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type PlaylistsQueryParams = {
  status?: string;
  companyId?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc' | string;
  page?: number;
  pageSize?: number;
};

export type UpdatePlaylistPayload = {
  name: string;
  imageUrl: string;
  transitionName: string;
  tags: string[];
  imageDuration: number;
  companyId: number;
};

export type UpdatePlaylistApiResponse = ApiResponse<string>;
export type DeletePlaylistApiResponse = ApiResponse<string>;

export type CreatePlaylistPayload = {
  name: string;
  imageUrl: string;
  transitionName: string;
  tags: string[];
  imageDuration: number;
  active: boolean;
  companyId: number;
  assetIds: number[];
};

export type CreatePlaylistApiResponse = {
  succeeded: boolean;
  message: string | null;
  data: number;
};

export type UpdatePlaylistAssetsRequest = {
  assetIds: number[];
  replace: boolean;
};

export type UpdatePlaylistAssetsResponse = {
  succeeded: boolean;
  message: string;
  data: string;
};
