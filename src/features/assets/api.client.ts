'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { clientFetch } from '@/lib/http/client';
import type {
  AssetDetails,
  AssetListItemApi,
  AssetListItem,
  AssetsApiResponse,
  AssetsQueryParams,
  AssetsResult,
  UploadAssets,
  UpdateAssetRequest,
} from './types';

function mapAsset(item: AssetListItemApi): AssetListItem {
  const uploadedDate = item.dateOfUploading ? new Date(item.dateOfUploading) : null;

  const dateOfUploadingFormatted = uploadedDate ? uploadedDate.toLocaleString() : '';

  return {
    ...item,
    dateOfUploadingFormatted,
  };
}

function buildAssetsQueryString(params: AssetsQueryParams): string {
  const searchParams = new URLSearchParams();

  if (params.includeArchived != null) {
    searchParams.set('includeArchived', String(params.includeArchived));
  }

  if (params.tag) {
    searchParams.set('tag', params.tag);
  }

  if (params.searchTerm) {
    searchParams.set('searchTerm', params.searchTerm);
  }

  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }

  if (params.sortDir) {
    searchParams.set('sortDir', params.sortDir);
  }

  if (params.page != null) {
    searchParams.set('page', String(params.page));
  }

  if (params.pageSize != null) {
    searchParams.set('pageSize', String(params.pageSize));
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export async function fetchAssets(params: AssetsQueryParams): Promise<AssetsResult> {
  const qs = buildAssetsQueryString(params);
  const res = await clientFetch<AssetsApiResponse>(`/api/assets${qs}`);

  const items = res.items.map(mapAsset);
  const totalPages = res.pageSize > 0 ? Math.max(1, Math.ceil(res.totalCount / res.pageSize)) : 1;

  return {
    items,
    totalCount: res.totalCount,
    pageSize: res.pageSize,
    currentPage: res.currentPage,
    totalPages,
  };
}

export async function fetchAssetDetails(id: number): Promise<AssetDetails> {
  const res = await clientFetch<AssetListItemApi>(`/api/assets/${id}`);
  return mapAsset(res);
}

export async function uploadAssets({ files }: UploadAssets) {
  if (!files.length) {
    throw new Error('No files selected');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const res = await fetch('/api/assets/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || 'Upload failed');
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function updateAsset(id: number, body: UpdateAssetRequest): Promise<void> {
  await clientFetch<void>(`/api/assets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function useAssetsQuery(params: AssetsQueryParams) {
  return useQuery({
    queryKey: ['assets', params],
    queryFn: () => fetchAssets(params),
  });
}

async function deleteAssets(ids: number[]): Promise<void> {
  if (!ids.length) return;

  if (ids.length === 1) {
    await clientFetch<void>(`/api/assets/${ids[0]}`, {
      method: 'DELETE',
    });
    return;
  }

  await clientFetch<void>('/api/assets/delete-bulk', {
    method: 'POST',
    body: JSON.stringify({ ids }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function useAssetDetailsQuery(id: number | null) {
  return useQuery({
    queryKey: ['assets', id],
    queryFn: () => {
      if (id == null) throw new Error('Asset id is required');
      return fetchAssetDetails(id);
    },
    enabled: id != null,
  });
}

export function useUploadAssetsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadAssets,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useDeleteAssetsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteAssets(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });
}

export function useUpdateAssetMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: { id: number; body: UpdateAssetRequest }) => updateAsset(vars.id, vars.body),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      queryClient.invalidateQueries({ queryKey: ['assets', vars.id] });
    },
  });
}
