'use client';

import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import {
  DeviceDetails,
  DeviceListItem,
  DevicePlaylistsResponse,
  DevicesApiResponse,
  DevicesResult,
  UpdateDevicePayload,
  DeviceStatus,
  DevicesQueryParams,
  DeviceDetailsApiResponse,
  PlaylistGroupSummary,
  PlaylistAssetPreview,
} from './types';
import { clientFetch } from '@/lib/http/client';
import { PlaylistSummary } from '../playlists/types';

const DEVICES_QK = ['devices'];
const DEVICE_QK = (id: number | string) => ['devices', id];
const DEVICE_PLAYLISTS_QK = (id: number | string) => ['devices', id, 'playlists'];

function mapDeviceDetails(res: DeviceDetailsApiResponse): DeviceDetails {
  const playlistGroups: PlaylistGroupSummary[] =
    res.playlistGroups?.map((g) => ({
      id: g.id,
      name: g.name,
      description: g.description,
      imageUrl: g.imageUrl,
      backgroundUrl: g.backgroundUrl,
      duration: g.duration,
      numberOfPlaylists: g.numberOfPlaylists,
      playlistIds: g.playlistIds,
      selected: g.selected,
    })) ?? [];

  const playlists: PlaylistSummary[] = Array.isArray(res.assignedPlaylist)
    ? res.assignedPlaylist.map((p: any) => ({
        id: p.id,
        name: p.name,
        duration: p.duration,
        imageDuration: p.imageDuration,
        tags: p.tags ?? [],
        dateOfCreation: p.dateOfCreation,
        numAssets: p.numberOfAssets,
        active: true,
        assetIds: p.assetIds ?? [],
        imageUrl: p.imageUrl ?? p.imageURL ?? null,
        backgroundUrl: p.backgroundUrl ?? p.backgroundURL ?? null,
      }))
    : [];

  const playlistAssetsById: Record<number, PlaylistAssetPreview[]> = {};

  return {
    id: res.id,
    name: res.name,
    description: res.description,
    type: res.deviceTypeName,
    availableTypes: res.deviceTypes ?? [],
    operatingSystem: res.os ?? '',
    screenResolution: '',
    screenOrientation: null,
    active: res.active,
    playlists,
    playlistGroups,
    playlistAssetsById,
  };
}

export async function fetchDevices(params: DevicesQueryParams): Promise<DevicesResult> {
  const searchParams = new URLSearchParams();

  if (params.page != null) {
    searchParams.set('Page', String(params.page));
  }
  if (params.pageSize != null) {
    searchParams.set('PageSize', String(params.pageSize));
  }
  if (params.searchTerm) {
    searchParams.set('SearchTerm', params.searchTerm);
  }
  if (params.sortBy) {
    searchParams.set('SortBy', params.sortBy);
  }
  if (params.sortDir) {
    searchParams.set('SortDir', params.sortDir);
  }

  const qs = searchParams.toString();
  const url = qs ? `/api/devices?${qs}` : '/api/devices';
  const res = await clientFetch<DevicesApiResponse>(url);

  const items: DeviceListItem[] = res.items.map((d) => ({
    id: d.id,
    name: d.name,
    type: d.deviceTypeName,
    os: d.os,
    status: d.active ? DeviceStatus.Active : DeviceStatus.Inactive,
    registrationDate: d.registrationDate,
    registrationDateFormatted: d.registrationDateFormatted,
  }));

  const totalPages = res.pageSize > 0 ? Math.ceil(res.totalCount / res.pageSize) : 1;

  return {
    items,
    totalCount: res.totalCount,
    pageSize: res.pageSize,
    currentPage: res.currentPage,
    totalPages,
  };
}

export async function fetchDeviceById(id: number | string): Promise<DeviceDetails> {
  const res = await clientFetch<DeviceDetailsApiResponse>(`/api/devices/${id}`);
  return mapDeviceDetails(res);
}

export async function fetchDevicePlaylists(id: number | string): Promise<DevicePlaylistsResponse> {
  return clientFetch<DevicePlaylistsResponse>(`/api/devices/${id}/playlists`);
}

export async function updateDevice(
  id: number | string,
  payload: UpdateDevicePayload,
): Promise<void> {
  await clientFetch<void>(`/api/devices/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteDevice(id: number | string): Promise<void> {
  await clientFetch(`/api/devices/${id}`, { method: 'DELETE' });
}

export function useDevicesQuery(params: DevicesQueryParams) {
  return useQuery<DevicesResult>({
    queryKey: [...DEVICES_QK, params],
    queryFn: () => fetchDevices(params),
    placeholderData: keepPreviousData,
  });
}

export function useDeviceQuery(id: number | string) {
  return useQuery<DeviceDetails>({
    queryKey: DEVICE_QK(id),
    queryFn: () => fetchDeviceById(id),
    enabled: !!id,
  });
}

export function useDevicePlaylistsQuery(id: number | string) {
  return useQuery<DevicePlaylistsResponse>({
    queryKey: DEVICE_PLAYLISTS_QK(id),
    queryFn: () => fetchDevicePlaylists(id),
    enabled: !!id,
  });
}

export function useUpdateDeviceMutation(id: number | string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDevicePayload) => updateDevice(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEVICE_QK(id) });
      queryClient.invalidateQueries({ queryKey: DEVICE_PLAYLISTS_QK(id) });
    },
  });
}

export function useDeleteDeviceMutation() {
  const client = useQueryClient();

  return useMutation<void, Error, number | string>({
    mutationFn: (id) => deleteDevice(id),
    onSuccess: (_, id) => {
      client.removeQueries({ queryKey: DEVICE_QK(id) });

      client.setQueriesData<DevicesResult>({ queryKey: DEVICES_QK }, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.filter((d) => d.id !== id),
          totalCount: Math.max(0, old.totalCount - 1),
        };
      });

      client.invalidateQueries({ queryKey: DEVICES_QK });
    },
  });
}
