'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PlaylistGroupSummary, PlaylistSummary, PlaylistAssetPreview } from '../types';
import { getAssetUrl } from '@/lib/assets';
import { PlaylistPreview } from './PlaylistPreview';
import { X } from 'lucide-react';

type Props = {
  groups: PlaylistGroupSummary[];
  playlists: PlaylistSummary[];
  playlistAssetsById?: Record<number, PlaylistAssetPreview[]>;
  selectedGroupId: number | null;
  onSelect: (groupId: number) => void;
  isEditing: boolean;
};

export function DevicePlaylistGroupsPanel({
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

  const bgImageSrc = getAssetUrl(selectedGroup?.backgroundUrl);
  const frontImageSrc = getAssetUrl(selectedGroup?.imageUrl);

  const selectedPlaylists: PlaylistSummary[] = useMemo(
    () => (selectedGroup ? playlists : []),
    [selectedGroup, playlists],
  );

  const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    if (!selectedGroup || playlists.length === 0) {
      setActivePlaylistId(null);
      setIsPreviewOpen(false);
      return;
    }

    setActivePlaylistId((prev) => {
      const stillExists = playlists.some((p) => p.id === prev);
      return stillExists ? prev : playlists[0].id;
    });
  }, [selectedGroup, playlists]);

  const activePlaylist = useMemo(
    () =>
      activePlaylistId != null ? (playlists.find((p) => p.id === activePlaylistId) ?? null) : null,
    [activePlaylistId, playlists],
  );

  const activeAssets: PlaylistAssetPreview[] =
    activePlaylistId != null ? (playlistAssetsById[activePlaylistId] ?? []) : [];

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium">{t('title')}</h3>
              <p className="text-sm text-muted-foreground">{t('description')}</p>
            </div>

            <ScrollArea className="max-h-[500px] border rounded-md overflow-x-hidden">
              <div className="py-1">
                {groups.length === 0 && (
                  <div className="px-3 py-2 text-sm text-muted-foreground">{t('empty')}</div>
                )}

                {groups.map((group) => {
                  const isSelected = selectedGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      className={cn(
                        'w-full flex items-start gap-2 px-3 py-2 text-left text-sm cursor-pointer hover:bg-muted/60',
                        'transition-colors',
                        isSelected && 'bg-muted',
                      )}
                      onClick={() => isEditing && onSelect(group.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={!isEditing}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        onCheckedChange={() => onSelect(group.id)}
                        className="cursor-pointer"
                      />

                      <div className="flex flex-col min-w-0">
                        <span className="font-medium wrap-break-word">{group.name}</span>
                        <span className="text-xs text-muted-foreground wrap-break-word">
                          {t('meta.duration', { duration: group.duration })}
                          {' · '}
                          {t('meta.numPlaylists', { count: group.numberOfPlaylists })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">{t('previewTitle')}</h3>

            <div className="border rounded-lg overflow-hidden relative min-h-[260px]">
              {selectedGroup ? (
                <>
                  {bgImageSrc ? (
                    <>
                      <Image
                        src={bgImageSrc}
                        alt={selectedGroup.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          33vw"
                      />
                      <div className="absolute inset-0 bg-black/65" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground px-4 text-center bg-muted/20">
                      {t('previewPlaceholder')}
                    </div>
                  )}

                  <div className="relative z-10 p-5 flex gap-6 text-white">
                    <div className="flex-1 flex flex-col gap-3 min-w-0">
                      <h4 className="text-lg font-semibold wrap-break-word">
                        {selectedGroup.name}
                      </h4>

                      {frontImageSrc && (
                        <div className="relative w-60 h-40 rounded-md overflow-hidden border border-white/30 bg-black/40">
                          <Image
                            src={frontImageSrc}
                            alt={selectedGroup.name}
                            fill
                            className="object-cover"
                            sizes="240px"
                          />
                        </div>
                      )}

                      <p className="text-xs leading-relaxed text-white/90 overflow-auto wrap-break-word pr-1">
                        {selectedGroup.description}
                      </p>
                    </div>

                    <div className="w-72 flex flex-col gap-3">
                      <div className="bg-black/70 rounded-md p-3 shadow-lg flex flex-col">
                        <div className="space-y-1 mb-3">
                          <p className="text-xs font-semibold">
                            {t('playlistsTitle', {
                              count: selectedPlaylists.length,
                            })}
                          </p>
                          <p className="text-[11px] text-white/80">
                            {t('meta.duration', { duration: selectedGroup.duration })}
                          </p>
                        </div>

                        {selectedPlaylists.length > 0 ? (
                          <div className="space-y-2">
                            {selectedPlaylists.map((playlist) => {
                              const isActive = playlist.id === activePlaylistId;
                              const thumbnailSrc = getAssetUrl(playlist.imageUrl ?? null);

                              return (
                                <button
                                  key={playlist.id}
                                  type="button"
                                  onClick={() => handlePlaylistClick(playlist.id)}
                                  className={cn(
                                    'w-full border border-white/10 rounded-md px-2 py-1.5 text-[11px]',
                                    'bg-black/40 flex items-center gap-2 text-left',
                                    'hover:border-white/40 transition-colors cursor-pointer',
                                    isActive && 'border-cyan-400 bg-cyan-500/20',
                                  )}
                                >
                                  <div className="relative w-10 h-8 rounded-sm overflow-hidden bg-black/60 flex-shrink-0">
                                    {thumbnailSrc ? (
                                      <Image
                                        src={thumbnailSrc}
                                        alt={playlist.name}
                                        fill
                                        className="object-cover"
                                        sizes="40px"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[9px] text-white/60">
                                        PL
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between gap-2">
                                      <span className="font-semibold truncate">
                                        {playlist.name}
                                      </span>
                                      <span className="text-white/70 whitespace-nowrap">
                                        {t('playlistMeta.duration', {
                                          duration: playlist.duration,
                                        })}
                                      </span>
                                    </div>

                                    <div className="flex justify-between gap-2 text-white/70">
                                      <span>
                                        {t('playlistMeta.assets', {
                                          count: playlist.numAssets,
                                        })}
                                      </span>
                                      <span className="opacity-75 whitespace-nowrap">
                                        {playlist.dateOfCreation}
                                      </span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-[11px] text-white/60 mt-3">
                            {t('noPlaylistsInGroupHint')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isPreviewOpen && activePlaylist && (
                    <div className="absolute inset-0 z-20 bg-black/90 flex flex-col">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                        <span className="text-sm font-medium truncate">{activePlaylist.name}</span>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="text-white hover:bg-white/10"
                          onClick={handleClosePreview}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex-1 p-4">
                        <div className="w-full h-full">
                          <PlaylistPreview
                            assets={activeAssets}
                            intervalMs={10000}
                            autoPlay
                            showControls
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground px-4 text-center bg-muted/20">
                  {t('previewPlaceholder')}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
