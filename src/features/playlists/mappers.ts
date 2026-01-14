import type {
  PlaylistApiItem,
  PlaylistDetails,
  PlaylistDetailsApiItem,
  PlaylistSummary,
} from './types';

export function mapPlaylistSummary(p: PlaylistApiItem): PlaylistSummary {
  return {
    id: p.id,
    name: p.name,
    imageUrl: p.imageURL ?? null,
    creationDate: p.creationDate ?? null,
    dateOfCreation: p.dateOfCreation,
    duration: p.duration,
    numAssets: p.numberOfAssets,
    imageDuration: p.imageDuration,
    assetIds: p.assetIds ?? [],
    tags: p.tags ?? [],
    active: p.active,
    assets: (p.assets ?? []).map((a, idx) => ({
      id: a.id,
      name: a.name ?? null,
      imageUrl: a.imageUrl ?? null,
      order: idx,
    })),
  };
}

export function mapPlaylistDetails(p: PlaylistDetailsApiItem): PlaylistDetails {
  const orderById = new Map<number, number>();
  (p.assetIds ?? []).forEach((id, idx) => orderById.set(id, idx));

  const assets = (p.assets ?? [])
    .map((a) => ({
      id: a.id,
      name: a.name ?? null,
      imageUrl: a.imageUrl ?? null,
      order: orderById.get(a.id) ?? 9999,
    }))
    .sort((a, b) => a.order - b.order);

  return {
    id: p.id,
    name: p.name,
    imageUrl: p.imageURL ?? null,
    creationDate: p.creationDate,
    dateOfCreation: p.dateOfCreation,
    duration: p.duration,
    numAssets: p.numberOfAssets,
    imageDuration: p.imageDuration,
    assetIds: p.assetIds ?? [],
    tags: p.tags ?? [],
    assets,
    active: p.active,
    devices: (p.devices ?? []).map((d) => ({ id: d.id, name: d.name })),
  };
}
