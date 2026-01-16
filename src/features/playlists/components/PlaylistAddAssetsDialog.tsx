'use client';

import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

import type { TFn } from '@/types/i18n';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { SearchInput } from '@/components/shared/search-input';

import { useAssetsQuery } from '@/features/assets/api.client';
import type { AssetListItem } from '@/features/assets/types';
import { getAssetUrl } from '@/lib/assets';

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  playlistName: string;
  onConfirm: (assetIds: number[]) => void | Promise<void>;
  isSubmitting?: boolean;
  alreadyAddedAssetIds?: number[];
};

const PAGINATION_H = 48;

export function PlaylistAddAssetsDialog({
  t,
  open,
  onOpenChange,
  playlistName,
  onConfirm,
  isSubmitting = false,
  alreadyAddedAssetIds = [],
}: Props) {
  const [assetSearch, setAssetSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const pageSize = 30;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const params = useMemo(
    () => ({
      includeArchived: false,
      searchTerm: debouncedSearch.trim() || undefined,
      page,
      pageSize,
    }),
    [debouncedSearch, page],
  );

  const { data, isLoading, isError, error, isFetching } = useAssetsQuery(params);

  const items: AssetListItem[] = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  const alreadySet = useMemo(() => new Set(alreadyAddedAssetIds), [alreadyAddedAssetIds]);

  const selectedNewAssets = useMemo(
    () => selectedAssets.filter((id) => !alreadySet.has(id)),
    [selectedAssets, alreadySet],
  );

  useEffect(() => {
    setSelectedAssets((prev) => prev.filter((id) => !alreadySet.has(id)));
  }, [alreadySet]);

  const toggleAssetSelection = (assetId: number) => {
    if (alreadySet.has(assetId)) return;
    if (isSubmitting) return;

    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId],
    );
  };

  const reset = () => {
    setAssetSearch('');
    setDebouncedSearch('');
    setSelectedAssets([]);
    setPage(1);
  };

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  const showPager = totalPages > 1;

  return (
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
        "
      >
        <DialogHeader className="shrink-0">
          <DialogTitle>{t('playlists.addAssets.title')}</DialogTitle>
          <DialogDescription>
            {t('playlists.addAssets.description', { name: playlistName })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="shrink-0">
            <SearchInput
              value={assetSearch}
              onChange={setAssetSearch}
              onDebouncedChange={setDebouncedSearch}
              delayMs={350}
              disabled={isSubmitting}
              placeholder={t('playlists.addAssets.searchPlaceholder')}
              autoFocus={false}
              disableFocusStyles
              clearable
            />
          </div>

          {selectedNewAssets.length > 0 && (
            <div className="shrink-0 flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {t('playlists.addAssets.selectedCount', { count: selectedNewAssets.length })}
              </span>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedAssets([])}
                disabled={isSubmitting}
              >
                {t('playlists.addAssets.clearSelection')}
              </Button>
            </div>
          )}

          <div className="relative h-[62vh] max-h-155 min-h-105 overflow-hidden rounded-lg border">
            <div
              className="h-full overflow-y-auto pr-2"
              style={{
                paddingBottom: showPager ? PAGINATION_H + 12 : 12,
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-2 py-2">
                {items.map((asset) => {
                  const checked = selectedAssets.includes(asset.id);
                  const disabled = alreadySet.has(asset.id) || isSubmitting;

                  const thumbUrl = getAssetUrl(asset, { thumbnail: true });
                  const fullUrl = getAssetUrl(asset);

                  return (
                    <Card
                      key={asset.id}
                      className={[
                        'transition-all',
                        disabled
                          ? 'opacity-60 cursor-not-allowed'
                          : 'cursor-pointer hover:shadow-md',
                        checked && !disabled ? 'ring-2 ring-primary' : '',
                      ].join(' ')}
                      onClick={() => {
                        if (disabled) return;
                        toggleAssetSelection(asset.id);
                      }}
                    >
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            {thumbUrl || fullUrl ? (
                              <img
                                src={thumbUrl || fullUrl}
                                alt={asset.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                                No preview
                              </div>
                            )}

                            {checked && !disabled && (
                              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                <div className="bg-primary rounded-full p-2">
                                  <X className="h-4 w-4 text-primary-foreground" />
                                </div>
                              </div>
                            )}

                            {alreadySet.has(asset.id) && (
                              <div className="absolute inset-0 bg-background/60 flex items-center justify-center px-2">
                                <span className="text-[11px] text-muted-foreground text-center">
                                  {t('playlists.addAssets.alreadyInPlaylist')}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <div className="text-sm font-medium line-clamp-1">{asset.name}</div>
                                {asset.description ? (
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {asset.description}
                                  </div>
                                ) : null}
                              </div>

                              <Checkbox
                                checked={checked}
                                disabled={disabled}
                                onCheckedChange={() => {
                                  if (disabled) return;
                                  toggleAssetSelection(asset.id);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              {asset.format ? <span>{asset.format}</span> : null}
                              {asset.quality ? (
                                <>
                                  <span>•</span>
                                  <span className="line-clamp-1">{asset.quality}</span>
                                </>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {!isLoading && !isError && items.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {t('playlists.addAssets.empty')}
                </div>
              )}
            </div>

            {showPager && (
              <div className="absolute bottom-0 left-0 right-0 h-12 px-3 flex items-center justify-between border-t bg-background/95 backdrop-blur">
                <div className="text-xs text-muted-foreground">
                  {t('assets.pagination', { page, totalPages })}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrev}
                    disabled={isSubmitting || page <= 1}
                  >
                    {t('common.prev')}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={isSubmitting || page >= totalPages}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              </div>
            )}

            {(isLoading || isFetching) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
                <CenteredSpinner label={t('assets.loading')} />
              </div>
            )}

            {isError && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 p-6">
                <div className="text-sm text-destructive text-center max-w-lg">
                  {error instanceof Error ? error.message : t('assets.errors.load')}
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
            disabled={selectedNewAssets.length === 0 || isSubmitting}
            onClick={async () => {
              await onConfirm(selectedNewAssets);
              onOpenChange(false);
              reset();
            }}
          >
            {isSubmitting
              ? t('playlists.common.saving')
              : t('playlists.addAssets.confirm', { count: selectedNewAssets.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
