'use client';

import { useQuery } from '@tanstack/react-query';
import { clientFetch } from '@/lib/http/client';
import type { PlaylistsApiResponse, PlaylistsListResponse, PlaylistSummary } from './types';

export type FetchPlaylistsParams = {
  status?: string;
  companyId?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  pageSize?: number;
};

export async function fetchPlaylists(
  params: FetchPlaylistsParams = {},
): Promise<PlaylistsListResponse> {
  const searchParams = new URLSearchParams();

  if (params.status) {
    searchParams.set('Status', params.status);
  }
  if (params.companyId != null) {
    searchParams.set('CompanyId', params.companyId.toString());
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
  if (params.page != null) {
    searchParams.set('Page', params.page.toString());
  }
  if (params.pageSize != null) {
    searchParams.set('PageSize', params.pageSize.toString());
  }

  const query = searchParams.toString();
  const url = query ? `/api/playlists?${query}` : '/api/playlists';

  const raw = await clientFetch<PlaylistsApiResponse>(url);

  if (!raw.succeeded) {
    throw new Error(raw.message || 'Failed to load playlists');
  }

  const mappedItems: PlaylistSummary[] = raw.data.items.map((p) => ({
    id: p.id,
    name: p.name,
    imageUrl: p.imageURL ?? null,
    dateOfCreation: p.dateOfCreation,
    duration: p.duration,
    numAssets: p.numberOfAssets,
    imageDuration: p.imageDuration,
    assetIds: p.assetIds,
    tags: p.tags,
    assets: (p.assets ?? []).map((a, idx) => ({
      id: a.id,
      name: a.name ?? null,
      imageUrl: a.imageUrl ?? null,
      order: idx,
    })),
  }));

  return {
    items: mappedItems,
    totalCount: raw.data.totalCount,
    pageSize: raw.data.pageSize,
    currentPage: raw.data.currentPage,
  };
}

export function usePlaylistsQuery(params: FetchPlaylistsParams = {}) {
  return useQuery({
    queryKey: ['playlists', params],
    queryFn: () => fetchPlaylists(params),
    staleTime: 60_000,
  });
}
