import { LanguageCode } from '../assets/constants';

export type ApiEnvelope<T> = {
  succeeded: boolean;
  message: string;
  data: T;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export type SortDir = 'asc' | 'desc';

export type PlaylistGroupListQuery = {
  searchTerm?: string;
  sortBy?: string;
  sortDir?: SortDir;
  page?: number;
  pageSize?: number;
};

export type PlaylistGroup = {
  id: number;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  backgroundUrl?: string | null;
  duration?: string | null;
  numberOfPlaylists: number;
  playlistIds: number[];
  selected: boolean;
};

export type GetPlaylistGroupsResponse = ApiEnvelope<PagedResult<PlaylistGroup>>;
export type GetPlaylistGroupDetailsResponse = ApiEnvelope<PlaylistGroup>;

export type PlaylistGroupTranslations = Partial<Record<LanguageCode, string>>;

export type CreatePlaylistGroupBody = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  backgroundUrl?: string | null;
  playlistIds: number[];
  descriptionTranslations?: PlaylistGroupTranslations;
};

export type UpdatePlaylistGroupBody = {
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  backgroundUrl?: string | null;
  playlistIds: number[];
  descriptionTranslations?: PlaylistGroupTranslations;
};

export type AddPlaylistsToGroupBody = {
  playlistIds: number[];
};

export type RemovePlaylistsFromGroupBody = {
  playlistIds: number[];
};

export type MutateResponse = ApiEnvelope<string>;
