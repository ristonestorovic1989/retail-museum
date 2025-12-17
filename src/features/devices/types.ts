import { PlaylistSummary } from '../playlists/types';

export enum DeviceStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export type DeviceListItemApi = {
  id: number;
  name: string;
  deviceTypeName: string;
  os: string;
  active: boolean;
  registrationDate: string;
  registrationDateFormatted: string;
};

export type DeviceListItem = {
  id: number;
  name: string;
  type: string;
  os: string;
  status: DeviceStatus;
  registrationDate: string;
  registrationDateFormatted: string;
};

export type DevicesApiResponse = {
  items: DeviceListItemApi[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
};

export type DevicesQueryParams = {
  searchTerm?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
};

export type DevicesResult = {
  items: DeviceListItem[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type DeviceDetailsApiResponse = {
  id: number;
  name: string;
  description: string | null;
  os: string | null;
  deviceTypeName: string;
  active: boolean;
  registrationDate: string;
  assignedPlaylist: PlaylistSummary[];
  playlistDetails: {
    id: number;
    name: string | null;
    description: string | null;
    imageURL: string | null;
    backgroundURL: string | null;
    playlists: unknown[];
  };
  deviceTypes: string[];
  playlistGroups: {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
    backgroundUrl: string | null;
    duration: string;
    numberOfPlaylists: number;
    playlistIds: number[];
    selected: boolean;
  }[];
};

export type PlaylistAssetPreview = {
  id: number;
  name: string | null;
  imageUrl: string | null;
};

export type PlaylistGroupSummary = {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
  backgroundUrl: string | null;
  duration: string;
  numberOfPlaylists: number;
  playlistIds: number[];
  selected: boolean;
};

export type DeviceDetails = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  availableTypes: string[];
  operatingSystem: string;
  screenResolution: string;
  screenOrientation: string | null;
  active: boolean;
  playlists: PlaylistSummary[];
  playlistGroups: PlaylistGroupSummary[];
  playlistAssetsById?: Record<number, PlaylistAssetPreview[]>;
};

export type DevicePlaylistsResponse = {
  availablePlaylists: PlaylistSummary[];
  selectedPlaylistIds: number[];
};

export type UpdateDevicePayload = {
  name: string;
  description: string | null;
  deviceTypeName: string;
  active: boolean;
  playlistGroupId: number;
};
