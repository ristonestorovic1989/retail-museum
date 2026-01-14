'use client';

import { useCallback, useMemo, useState } from 'react';
import { Calendar, Clock, Monitor } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { TFn } from '@/types/i18n';
import { usePlaylistQuery, useUpdatePlaylistAssetsMutation } from '../api.client';

import { PlaylistEditDialog } from './PlaylistEditDialog';
import { PlaylistDeleteDialog } from './PlaylistDeleteDialog';
import { PlaylistAddAssetsDialog } from './PlaylistAddAssetsDialog';
import { PlaylistDetailsHeader } from './PlaylistDetails/PlaylistDetailsHeader';
import { InfoBlock } from './PlaylistDetails/InfoBlock';
import { PlaylistAssetsSection } from './PlaylistDetails/PlaylistAssetsSection';
import { CenteredSpinner } from '@/components/shared/centered-spiner';

type Props = {
  t: TFn;
  companyId: number;
  selectedId: number | null;
  onDeleted: () => void;
};

export function PlaylistDetailsPanel({ t, companyId, selectedId, onDeleted }: Props) {
  const { data, isLoading, isError, error } = usePlaylistQuery(selectedId ?? '');
  const updateAssets = useUpdatePlaylistAssetsMutation();

  console.log(data, 'data in details panel');

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addAssetsOpen, setAddAssetsOpen] = useState(false);

  const playlistName = useMemo(
    () => (data?.name ? data.name : t('playlists.details.untitled')),
    [data?.name, t],
  );

  const deviceNames = useMemo(() => {
    if (!data) return '';
    if (!data.devices?.length) return t('playlists.details.noDevices');
    return data.devices.map((d) => d.name).join(', ');
  }, [data, t]);

  const openEdit = useCallback(() => setEditOpen(true), []);
  const openDelete = useCallback(() => setDeleteOpen(true), []);
  const openAddAssets = useCallback(() => setAddAssetsOpen(true), []);

  const handleDeleteCompleted = useCallback(() => {
    setDeleteOpen(false);
    onDeleted();
  }, [onDeleted]);

  const handleSaveOrder = useCallback(
    async (assetIds: number[]) => {
      if (!data) return;

      await updateAssets.mutateAsync({
        playlistId: data.id,
        assetIds,
        replace: true,
      });
    },
    [data, updateAssets],
  );

  const handleAddAssetsConfirm = useCallback(
    async (assetIds: number[]) => {
      if (!data) return;

      await updateAssets.mutateAsync({
        playlistId: data.id,
        assetIds,
        replace: false,
      });
    },
    [data, updateAssets],
  );

  return (
    <Card className="lg:col-span-2 h-full min-h-0 flex flex-col overflow-hidden">
      <CardContent className="flex-1 pt-6 min-h-0 flex flex-col overflow-hidden">
        {selectedId == null && (
          <div className="text-sm text-muted-foreground">{t('playlists.details.selectHint')}</div>
        )}

        {selectedId != null && isLoading && (
          <CenteredSpinner label={t('playlists.details.loading')} />
        )}

        {selectedId != null && isError && (
          <div className="text-sm text-destructive">
            {error instanceof Error ? error.message : t('playlists.errors.loadDetails')}
          </div>
        )}

        {selectedId != null && data && (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <div className="shrink-0 space-y-6">
              <PlaylistDetailsHeader
                t={t}
                playlist={data}
                onEdit={openEdit}
                onDelete={openDelete}
              />

              <div className="grid grid-cols-2 gap-4">
                <InfoBlock
                  icon={<Clock className="h-4 w-4" />}
                  label={t('playlists.details.imageDuration')}
                  value={t('playlists.details.imageDurationValue', { seconds: data.imageDuration })}
                />
                <InfoBlock
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('playlists.details.created')}
                  value={data.dateOfCreation}
                />
                <InfoBlock
                  icon={<Monitor className="h-4 w-4" />}
                  label={t('playlists.details.devices')}
                  value={deviceNames}
                  full
                />
              </div>

              <Separator />
            </div>

            <PlaylistAssetsSection
              t={t}
              playlist={data}
              onAddAssets={openAddAssets}
              isSaving={updateAssets.isPending}
              onSaveOrder={handleSaveOrder}
            />

            <PlaylistAddAssetsDialog
              t={t}
              open={addAssetsOpen}
              onOpenChange={setAddAssetsOpen}
              playlistName={playlistName}
              alreadyAddedAssetIds={data.assetIds ?? []}
              onConfirm={handleAddAssetsConfirm}
              isSubmitting={updateAssets.isPending}
            />

            <PlaylistEditDialog
              t={t}
              open={editOpen}
              onOpenChange={setEditOpen}
              companyId={companyId}
              playlist={data}
            />

            <PlaylistDeleteDialog
              t={t}
              open={deleteOpen}
              onOpenChange={setDeleteOpen}
              playlistId={data.id}
              playlistName={data.name}
              onDeleted={handleDeleteCompleted}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
