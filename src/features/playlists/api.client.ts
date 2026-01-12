'use client';

import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { clientFetch } from '@/lib/http/client';
import type {
  CreatePlaylistApiResponse,
  CreatePlaylistPayload,
  DeletePlaylistApiResponse,
  PlaylistDetails,
  PlaylistDetailsApiResponse,
  PlaylistsApiResponse,
  PlaylistsListResponse,
  PlaylistsQueryParams,
  UpdatePlaylistApiResponse,
  UpdatePlaylistPayload,
} from './types';
import { mapPlaylistDetails, mapPlaylistSummary } from './mappers';

export const PLAYLISTS_QK = ['playlists'];
export const PLAYLIST_QK = (id: number | string) => ['playlists', id];

function buildSearchParams(params: PlaylistsQueryParams) {
  const sp = new URLSearchParams();
  if (params.status) sp.set('Status', params.status);
  if (params.companyId != null) sp.set('CompanyId', String(params.companyId));
  if (params.searchTerm) sp.set('SearchTerm', params.searchTerm);
  if (params.sortBy) sp.set('SortBy', params.sortBy);
  if (params.sortDir) sp.set('SortDir', params.sortDir);
  if (params.page != null) sp.set('Page', String(params.page));
  if (params.pageSize != null) sp.set('PageSize', String(params.pageSize));
  return sp;
}

function makeParamsKey(params: PlaylistsQueryParams) {
  const sp = buildSearchParams(params);
  const entries = Array.from(sp.entries()).sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([k, v]) => `${k}=${v}`).join('&');
}

export async function fetchPlaylists(params: PlaylistsQueryParams): Promise<PlaylistsListResponse> {
  const sp = buildSearchParams(params);
  const qs = sp.toString();
  const url = qs ? `/api/playlists?${qs}` : '/api/playlists';

  const res = await clientFetch<PlaylistsApiResponse>(url);

  console.log('Fetched playlists:', res);

  if (!res.succeeded) throw new Error(res.message || 'Failed to load playlists');

  const items = res.data.items.map(mapPlaylistSummary);
  const totalPages = res.data.pageSize > 0 ? Math.ceil(res.data.totalCount / res.data.pageSize) : 1;

  return {
    items,
    totalCount: res.data.totalCount,
    pageSize: res.data.pageSize,
    currentPage: res.data.currentPage,
    totalPages,
  };
}

export async function fetchPlaylistById(id: number | string): Promise<PlaylistDetails> {
  const res = await clientFetch<PlaylistDetailsApiResponse>(`/api/playlists/${id}`);
  if (!res.succeeded) throw new Error(res.message || 'Failed to load playlist details');
  return mapPlaylistDetails(res.data);
}

export async function updatePlaylist(
  id: number | string,
  payload: UpdatePlaylistPayload,
): Promise<string> {
  const res = await clientFetch<UpdatePlaylistApiResponse>(`/api/playlists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.succeeded) throw new Error(res.message || 'Failed to update playlist');
  return res.data;
}

export async function deletePlaylist(id: number | string): Promise<string> {
  const res = await clientFetch<DeletePlaylistApiResponse>(`/api/playlists/${id}`, {
    method: 'DELETE',
  });

  if (!res.succeeded) throw new Error(res.message || 'Failed to delete playlist');
  return res.data;
}

export async function createPlaylist(payload: CreatePlaylistPayload): Promise<number> {
  const res = await clientFetch<CreatePlaylistApiResponse>(`/api/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.succeeded) throw new Error(res.message || 'Failed to create playlist');
  return res.data;
}

export function usePlaylistsQuery(params: PlaylistsQueryParams) {
  const key = makeParamsKey(params);

  return useQuery<PlaylistsListResponse>({
    queryKey: [...PLAYLISTS_QK, key],
    queryFn: () => fetchPlaylists(params),
    placeholderData: keepPreviousData,
  });
}

export function usePlaylistQuery(id: number | string) {
  return useQuery<PlaylistDetails>({
    queryKey: PLAYLIST_QK(id),
    queryFn: () => fetchPlaylistById(id),
    enabled: !!id,
  });
}

export function useUpdatePlaylistMutation(
  id: number | string,
  t?: (k: string, opts?: any) => string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePlaylistPayload) => updatePlaylist(id, payload),
    onSuccess: () => {
      toast.success(t?.('playlists.toasts.updatedTitle') ?? 'Playlist updated', {
        description: t?.('playlists.toasts.updatedDesc') ?? 'Changes saved successfully.',
      });
      qc.invalidateQueries({ queryKey: PLAYLIST_QK(id) });
      qc.invalidateQueries({ queryKey: PLAYLISTS_QK });
    },
    onError: (err) => {
      toast.error(t?.('playlists.toasts.updateFailedTitle') ?? 'Update failed', {
        description:
          err instanceof Error
            ? err.message
            : (t?.('playlists.toasts.genericError') ?? 'Something went wrong.'),
      });
    },
  });
}

export function useDeletePlaylistMutation(t?: (k: string, opts?: any) => string) {
  const qc = useQueryClient();

  return useMutation<string, Error, number | string>({
    mutationFn: (id) => deletePlaylist(id),
    onSuccess: (_msg, id) => {
      toast.success(t?.('playlists.toasts.deletedTitle') ?? 'Playlist deleted', {
        description: t?.('playlists.toasts.deletedDesc') ?? 'The playlist was removed.',
      });

      qc.removeQueries({ queryKey: PLAYLIST_QK(id) });

      qc.setQueriesData<PlaylistsListResponse>({ queryKey: PLAYLISTS_QK }, (old) => {
        if (!old || !Array.isArray(old.items)) return old;

        return {
          ...old,
          items: old.items.filter((p) => String(p.id) !== String(id)),
          totalCount: Math.max(0, old.totalCount - 1),
        };
      });

      qc.invalidateQueries({ queryKey: PLAYLISTS_QK });
    },
    onError: (err) => {
      toast.error(t?.('playlists.toasts.deleteFailedTitle') ?? 'Delete failed', {
        description:
          err instanceof Error
            ? err.message
            : (t?.('playlists.toasts.genericError') ?? 'Something went wrong.'),
      });
    },
  });
}

export function useCreatePlaylistMutation(t?: (k: string, opts?: any) => string) {
  const qc = useQueryClient();

  return useMutation<number, Error, CreatePlaylistPayload>({
    mutationFn: (payload) => createPlaylist(payload),
    onSuccess: (newId) => {
      toast.success(t?.('playlists.toasts.createdTitle') ?? 'Playlist created', {
        description: t?.('playlists.toasts.createdDesc') ?? 'Playlist created successfully.',
      });

      qc.invalidateQueries({ queryKey: PLAYLISTS_QK });

      qc.invalidateQueries({ queryKey: PLAYLIST_QK(newId) });
    },
    onError: (err) => {
      toast.error(t?.('playlists.toasts.createFailedTitle') ?? 'Create failed', {
        description: err instanceof Error ? err.message : 'Something went wrong.',
      });
    },
  });
}
