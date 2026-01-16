'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import type { TFn } from '@/types/i18n';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { SearchInput } from '@/components/shared/search-input';

import { usePlaylistsQuery, usePlaylistQuery } from '@/features/playlists/api.client';
import type { PlaylistsQueryParams, PlaylistSummary } from '@/features/playlists/types';

import { PlaylistTile, type PlaylistTileModel } from './GroupCard/PlaylistTile';
import { PlaylistPreviewOverlay } from '@/features/devices/components/DevicePlaylistGroupsTab/PlaylistPreviewOverlay';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (v: boolean) => void;

  groupName: string;

  onConfirm: (playlistIds: number[]) => void | Promise<void>;
  isSubmitting?: boolean;

  alreadyAddedPlaylistIds?: number[];

  companyId?: number;
};

const PAGINATION_H = 48;

function toTileModel(pl: PlaylistSummary): PlaylistTileModel {
  const anyPl = pl as any;

  return {
    id: pl.id,
    name: pl.name,
    // mapiraj na ono što ti API stvarno vraća
    imageUrl: anyPl.thumbnailUrl ?? anyPl.imageUrl ?? anyPl.imageURL ?? null,
    duration: anyPl.duration ?? null,
    numAssets: anyPl.numAssets ?? anyPl.numberOfAssets ?? null,
    dateOfCreation: anyPl.dateOfCreation ?? null,
  };
}

export function AddPlaylistsDialog({
  t,
  open,
  onOpenChange,
  groupName,
  onConfirm,
  isSubmitting = false,
  alreadyAddedPlaylistIds = [],
  companyId,
}: Props) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  // ✅ Preview overlay state
  const tp = useTranslations('devices.playlistGroups');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPlaylistId, setPreviewPlaylistId] = useState<number | null>(null);

  const pageSize = 30;

  useEffect(() => setPage(1), [debouncedSearch]);

  const alreadySet = useMemo(() => new Set(alreadyAddedPlaylistIds), [alreadyAddedPlaylistIds]);

  const params: PlaylistsQueryParams = useMemo(
    () => ({
      companyId,
      searchTerm: debouncedSearch.trim() || undefined,
      page,
      pageSize,
    }),
    [companyId, debouncedSearch, page],
  );

  const { data, isLoading, isError, error, isFetching } = usePlaylistsQuery(params);

  const items: PlaylistSummary[] = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const selectedNew = useMemo(
    () => selected.filter((id) => !alreadySet.has(id)),
    [selected, alreadySet],
  );

  useEffect(() => {
    setSelected((prev) => prev.filter((id) => !alreadySet.has(id)));
  }, [alreadySet]);

  const setChecked = (id: number, next: boolean) => {
    if (alreadySet.has(id)) return;
    if (isSubmitting) return;

    setSelected((prev) => {
      const has = prev.includes(id);
      if (next && !has) return [...prev, id];
      if (!next && has) return prev.filter((x) => x !== id);
      return prev;
    });
  };

  const reset = () => {
    setSearch('');
    setDebouncedSearch('');
    setSelected([]);
    setPage(1);
    setPreviewOpen(false);
    setPreviewPlaylistId(null);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const showPager = totalPages > 1;

  const openPreview = useCallback((id: number) => {
    setPreviewPlaylistId(id);
    setPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => setPreviewOpen(false), []);

  useEffect(() => {
    if (!previewOpen) setPreviewPlaylistId(null);
  }, [previewOpen]);

  const previewQuery = usePlaylistQuery(previewPlaylistId ? String(previewPlaylistId) : '');
  const previewPlaylist = previewPlaylistId ? (previewQuery.data ?? null) : null;
  const previewAssets = (previewPlaylist as any)?.assets ?? [];
  const showPreviewLoading = previewOpen && !!previewPlaylistId && previewQuery.isLoading;

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          onOpenChange(v);
          if (!v) reset();
        }}
      >
        <DialogContent
          className="
            max-w-none!
            w-[calc(100vw-2rem)]!
            sm:w-[calc(100vw-5rem)]!
            lg:w-[calc(100vw-8rem)]!
            xl:w-[calc(100vw-12rem)]!
            2xl:w-337.5!
            max-h-[92vh]
            overflow-hidden
            flex flex-col
            min-h-none!
          "
        >
          <DialogHeader className="shrink-0">
            <DialogTitle>{t('playlistGroups.addPlaylists.title')}</DialogTitle>
            <DialogDescription>
              {t('playlistGroups.addPlaylists.desc', { name: groupName })}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="shrink-0">
              <SearchInput
                value={search}
                onChange={setSearch}
                onDebouncedChange={setDebouncedSearch}
                delayMs={350}
                disabled={isSubmitting}
                placeholder={t('playlistGroups.addPlaylists.searchPlaceholder')}
                autoFocus={false}
                disableFocusStyles
                clearable
              />
            </div>

            {selectedNew.length > 0 && (
              <div className="shrink-0 flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                <span className="text-sm font-medium">
                  {t('playlistGroups.addPlaylists.selectedCount', { count: selectedNew.length })}
                </span>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelected([])}
                  disabled={isSubmitting}
                >
                  {t('playlistGroups.addPlaylists.clearSelection')}
                </Button>
              </div>
            )}

            <div className="relative h-[62vh] max-h-155 min-h-105 overflow-hidden rounded-lg border">
              <div
                className="h-full overflow-y-auto pr-2"
                style={{ paddingBottom: showPager ? PAGINATION_H + 12 : 12 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 px-2 py-2">
                  {items.map((pl) => {
                    const checked = selected.includes(pl.id);
                    const disabled = alreadySet.has(pl.id) || isSubmitting;

                    return (
                      <div key={pl.id} className="relative">
                        <PlaylistTile
                          playlist={toTileModel(pl)}
                          selectMode
                          checked={checked}
                          disabled={disabled}
                          onCheckedChange={(id, next) => setChecked(id, next)}
                          onPreview={(id) => openPreview(id)}
                          t={t}
                          className="rounded-xl"
                        />

                        {alreadySet.has(pl.id) ? (
                          <div className="absolute inset-0 z-30 rounded-xl bg-background/60 flex items-center justify-center px-2 pointer-events-none">
                            <span className="text-[11px] text-muted-foreground text-center">
                              {t('playlistGroups.addPlaylists.alreadyInGroup')}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {!isLoading && !isError && items.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    {t('playlistGroups.addPlaylists.empty')}
                  </div>
                )}
              </div>

              {showPager && (
                <div className="absolute bottom-0 left-0 right-0 h-12 px-3 flex items-center justify-between border-t bg-background/95 backdrop-blur">
                  <div className="text-xs text-muted-foreground">
                    {t('playlistGroups.pagination.page', { page, pages: totalPages })}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrev}
                      disabled={isSubmitting || page <= 1}
                    >
                      {t('playlistGroups.pagination.previous')}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNext}
                      disabled={isSubmitting || page >= totalPages}
                    >
                      {t('playlistGroups.pagination.next')}
                    </Button>
                  </div>
                </div>
              )}

              {(isLoading || isFetching) && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                  <CenteredSpinner label={t('playlists.list.loading')} />
                </div>
              )}

              {isError && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 p-6">
                  <div className="text-sm text-destructive text-center max-w-lg">
                    {error instanceof Error ? error.message : t('playlists.errors.loadList')}
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="shrink-0">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              {t('playlists.common.cancel')}
            </Button>

            <Button
              disabled={selectedNew.length === 0 || isSubmitting}
              onClick={async () => {
                await onConfirm(selectedNew);
                onOpenChange(false);
                reset();
              }}
            >
              {isSubmitting
                ? t('playlists.common.saving')
                : t('playlistGroups.addPlaylists.confirm', { count: selectedNew.length })}
            </Button>
          </DialogFooter>

          {previewOpen ? (
            <>
              {showPreviewLoading ? (
                <div className="absolute inset-0 z-50">
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-xl border border-white/10 bg-black/80 p-6">
                      <CenteredSpinner label={t('playlistGroups.groupCard.preview.loading')} />
                    </div>
                  </div>
                </div>
              ) : null}

              <PlaylistPreviewOverlay
                isOpen={previewOpen && !!previewPlaylist}
                playlist={(previewPlaylist as any) ?? null}
                assets={previewAssets}
                onClose={closePreview}
                t={tp}
              />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
