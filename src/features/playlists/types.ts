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
};

export type PlaylistsApiResponse = {
  succeeded: boolean;
  message: string | null;
  data: {
    items: PlaylistApiItem[];
    totalCount: number;
    pageSize: number;
    currentPage: number;
  };
};

export type PlaylistSummary = {
  id: number;
  name: string;
  imageUrl: string | null;
  dateOfCreation: string;
  duration: string;
  numAssets: number;
  imageDuration: number;
  assetIds: number[];
  assets?: PlaylistAssetPreview[];
  tags: string[];
};

export type PlaylistsListResponse = {
  items: PlaylistSummary[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export type PlaylistAssetApiItem = {
  id: number;
  name: string | null;
  imageUrl: string | null;
};

export type PlaylistAssetPreview = {
  id: number;
  name: string | null;
  imageUrl: string | null;
  order?: number | null;
};
