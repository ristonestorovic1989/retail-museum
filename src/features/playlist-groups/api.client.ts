import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  AddPlaylistsToGroupBody,
  CreatePlaylistGroupBody,
  GetPlaylistGroupDetailsResponse,
  GetPlaylistGroupsResponse,
  MutateResponse,
  PlaylistGroupListQuery,
  RemovePlaylistsFromGroupBody,
  UpdatePlaylistGroupBody,
} from './types';
import { clientFetch } from '@/lib/http/client';

function toQueryParams(q: PlaylistGroupListQuery) {
  const p = new URLSearchParams();

  if (q.searchTerm) p.set('SearchTerm', q.searchTerm);
  if (q.sortBy) p.set('SortBy', q.sortBy);
  if (q.sortDir) p.set('SortDir', q.sortDir);
  if (typeof q.page === 'number') p.set('Page', String(q.page));
  if (typeof q.pageSize === 'number') p.set('PageSize', String(q.pageSize));

  return p.toString();
}

export const playlistGroupsApi = {
  fetchList: (q: PlaylistGroupListQuery) => {
    const qs = toQueryParams(q);
    return clientFetch<GetPlaylistGroupsResponse>(`/api/playlist-groups${qs ? `?${qs}` : ''}`);
  },

  fetchDetails: (id: number) => {
    return clientFetch<GetPlaylistGroupDetailsResponse>(`/api/playlist-groups/${id}`);
  },

  create: (body: CreatePlaylistGroupBody) => {
    return clientFetch<MutateResponse>(`/api/playlist-groups`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  update: (id: number, body: UpdatePlaylistGroupBody) => {
    return clientFetch<MutateResponse>(`/api/playlist-groups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  remove: (id: number) => {
    return clientFetch<MutateResponse>(`/api/playlist-groups/${id}`, { method: 'DELETE' });
  },

  addPlaylists: (id: number, body: AddPlaylistsToGroupBody) => {
    return clientFetch<MutateResponse>(`/api/playlist-groups/${id}/playlists`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  removePlaylists: (id: number, body: RemovePlaylistsFromGroupBody) => {
    return clientFetch<MutateResponse>(`/api/playlist-groups/${id}/playlists`, {
      method: 'DELETE',
      body: JSON.stringify(body),
    });
  },

  getExportExcelUrl: (id: number, groupName: string) =>
    `/api/playlist-groups/${id}/export/excel?groupName=${encodeURIComponent(groupName)}`,
};

export const playlistGroupKeys = {
  all: ['playlistGroups'] as const,

  list: (p: PlaylistGroupListQuery) =>
    [
      ...playlistGroupKeys.all,
      'list',
      p.searchTerm ?? '',
      p.page ?? 1,
      p.pageSize ?? 10,
      p.sortBy ?? '',
      p.sortDir ?? '',
    ] as const,

  details: (id: number) => [...playlistGroupKeys.all, 'details', id] as const,
};

export function usePlaylistGroupsQuery(q: PlaylistGroupListQuery) {
  return useQuery({
    queryKey: playlistGroupKeys.list(q),
    queryFn: () => playlistGroupsApi.fetchList(q),
    placeholderData: keepPreviousData,
  });
}

export function usePlaylistGroupDetailsQuery(id: number | null) {
  return useQuery({
    queryKey:
      typeof id === 'number'
        ? playlistGroupKeys.details(id)
        : [...playlistGroupKeys.all, 'details', 'null'],
    queryFn: () => playlistGroupsApi.fetchDetails(id as number),
    enabled: typeof id === 'number',
  });
}

export function useCreatePlaylistGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: playlistGroupsApi.create,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.all });
    },
  });
}

export function useUpdatePlaylistGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdatePlaylistGroupBody }) =>
      playlistGroupsApi.update(id, body),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.all });
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.details(vars.id) });
    },
  });
}

export function useDeletePlaylistGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: playlistGroupsApi.remove,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.all });
    },
  });
}

export function useAddPlaylistsToGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, playlistIds }: { id: number; playlistIds: number[] }) =>
      playlistGroupsApi.addPlaylists(id, { playlistIds }),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.all });
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.details(vars.id) });
    },
  });
}

export function useRemovePlaylistsFromGroupMutation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, playlistIds }: { id: number; playlistIds: number[] }) =>
      playlistGroupsApi.removePlaylists(id, { playlistIds }),
    onSuccess: async (_res, vars) => {
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.all });
      await qc.invalidateQueries({ queryKey: playlistGroupKeys.details(vars.id) });
    },
  });
}
