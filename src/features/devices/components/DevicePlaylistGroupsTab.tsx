'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { PlaylistGroupSummary, PlaylistAssetPreview } from '../types';
import { PlaylistSummary } from '@/features/playlists/types';
import { PlaylistGroupsList } from './DevicePlaylistGroupsTab/PlaylistGroupsList';
import { PlaylistGroupPreviewPanel } from './DevicePlaylistGroupsTab/PlaylistGroupPreviewPanel';

type Props = {
  groups: PlaylistGroupSummary[];
  playlists: PlaylistSummary[];
  playlistAssetsById?: Record<number, PlaylistAssetPreview[]>;
  selectedGroupId: number | null;
  onSelect: (groupId: number) => void;
  isEditing: boolean;
};

export function DevicePlaylistGroupsTab({
  groups,
  playlists,
  playlistAssetsById = {},
  selectedGroupId,
  onSelect,
  isEditing,
}: Props) {
  const t = useTranslations('devices.playlistGroups');

  const selectedGroup =
    selectedGroupId != null ? (groups.find((g) => g.id === selectedGroupId) ?? null) : null;

  const selectedPlaylists: PlaylistSummary[] = useMemo(() => {
    if (!selectedGroup) return [];

    const rawIds = selectedGroup.playlistIds ?? [];
    if (!rawIds || rawIds.length === 0) return [];

    const ids = rawIds.map((id) => Number(id)).filter((id) => !Number.isNaN(id));
    if (ids.length === 0) return [];

    const idSet = new Set(ids);
    return playlists.filter((p) => idSet.has(Number(p.id)));
  }, [selectedGroup, playlists]);

  const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!selectedGroup || selectedPlaylists.length === 0) {
      setActivePlaylistId(null);
      setIsPreviewOpen(false);
      return;
    }

    setActivePlaylistId((prev) => {
      const stillExists = selectedPlaylists.some((p) => p.id === prev);
      return stillExists ? prev : selectedPlaylists[0].id;
    });
  }, [selectedGroup, selectedPlaylists]);

  const handlePlaylistClick = (playlistId: number) => {
    setActivePlaylistId(playlistId);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PlaylistGroupsList
            groups={groups}
            selectedGroupId={selectedGroupId}
            isEditing={isEditing}
            onSelect={onSelect}
          />

          <PlaylistGroupPreviewPanel
            group={selectedGroup}
            selectedPlaylists={selectedPlaylists}
            playlistAssetsById={playlistAssetsById}
            activePlaylistId={activePlaylistId}
            isPreviewOpen={isPreviewOpen}
            onPlaylistClick={handlePlaylistClick}
            onClosePreview={handleClosePreview}
            t={t}
          />
        </div>
      </CardContent>
    </Card>
  );
}
