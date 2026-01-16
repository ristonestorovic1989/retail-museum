'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Download,
  MoreVertical,
  Plus,
  Trash2,
  Edit,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import type { PlaylistGroup } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { PlaylistTileModel } from './GroupCard/PlaylistTile';
import { PlaylistsMiniGrid } from './GroupCard/PlaylistsMiniGrid';

import {
  usePlaylistGroupDetailsQuery,
  useAddPlaylistsToGroupMutation,
  useRemovePlaylistsFromGroupMutation,
} from '../api.client';
import { usePlaylistsByIdsQuery, usePlaylistQuery } from '@/features/playlists/api.client';

import { PlaylistPreviewOverlay } from '@/features/devices/components/DevicePlaylistGroupsTab/PlaylistPreviewOverlay';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { AddPlaylistsDialog } from './AddPlaylistsDialog';
import { RemovePlaylistFromGroupDialog } from './PlaylistDeleteDialog';

type Props = {
  group: PlaylistGroup;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onExportExcel: () => void;
  t: (k: string, opts?: any) => string;
};

function toPlaylistTileModel(p: any): PlaylistTileModel {
  return {
    id: p.id,
    name: p.name,
    imageUrl: p.imageUrl ?? p.imageURL ?? null,
    duration: p.duration ?? null,
    numAssets: p.numAssets ?? p.numberOfAssets ?? p.assets?.length ?? null,
    dateOfCreation: p.dateOfCreation ?? null,
  };
}

function stopPropagation(fn: () => void) {
  return (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };
}

export function GroupCard({
  group,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onExportExcel,
  t,
}: Props) {
  const [activePlaylistId, setActivePlaylistId] = useState<number | null>(null);

  const tp = useTranslations('devices.playlistGroups');

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewPlaylistId, setPreviewPlaylistId] = useState<number | null>(null);

  const [addPlaylistsOpen, setAddPlaylistsOpen] = useState(false);
  const addPlaylistsMutation = useAddPlaylistsToGroupMutation();

  // ✅ Remove confirmation dialog state
  const [removeOpen, setRemoveOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState<number | null>(null);

  const removePlaylistsMutation = useRemovePlaylistsFromGroupMutation();

  const playlistCount = group.numberOfPlaylists ?? group.playlistIds?.length ?? 0;

  const detailsQuery = usePlaylistGroupDetailsQuery(
    isExpanded || addPlaylistsOpen ? group.id : null,
  );
  const details = detailsQuery.data?.data ?? null;
  const playlistIds = details?.playlistIds ?? group.playlistIds ?? [];

  const playlistsQuery = usePlaylistsByIdsQuery(playlistIds, isExpanded && playlistIds.length > 0);

  const playlistItems: PlaylistTileModel[] = useMemo(() => {
    const items = playlistsQuery.items ?? [];
    return items.map(toPlaylistTileModel);
  }, [playlistsQuery.items]);

  const pendingPlaylistName = useMemo(() => {
    if (!pendingRemoveId) return null;
    return playlistItems.find((p) => p.id === pendingRemoveId)?.name ?? null;
  }, [pendingRemoveId, playlistItems]);

  const icon = isExpanded ? (
    <ChevronDown className="h-5 w-5 text-muted-foreground" />
  ) : (
    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  );

  const handlePlaylistSelect = useCallback((id: number) => setActivePlaylistId(id), []);

  const handlePreview = useCallback((id: number) => {
    setPreviewPlaylistId(id);
    setPreviewOpen(true);
  }, []);

  const handleClosePreview = useCallback(() => setPreviewOpen(false), []);

  // ✅ Remove request (opens dialog only)
  const handleRemoveFromGroup = useCallback((playlistId: number) => {
    setPendingRemoveId(playlistId);
    setRemoveOpen(true);
  }, []);

  const handleRemoveOpenChange = useCallback((open: boolean) => {
    setRemoveOpen(open);
    if (!open) setPendingRemoveId(null);
  }, []);

  // ✅ Confirm remove (calls API)
  const handleConfirmRemove = useCallback(async () => {
    if (!pendingRemoveId) return;

    try {
      await removePlaylistsMutation.mutateAsync({
        id: group.id,
        playlistIds: [pendingRemoveId],
      });

      setActivePlaylistId((curr) => (curr === pendingRemoveId ? null : curr));

      toast.success(t('playlistGroups.toasts.playlistRemoved.title'), {
        description: t('playlistGroups.toasts.playlistRemoved.desc'),
      });

      setRemoveOpen(false);
      setPendingRemoveId(null);
    } catch (e) {
      toast.error(t('playlistGroups.toasts.removeFailed.title'), {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }, [pendingRemoveId, removePlaylistsMutation, group.id, t]);

  useEffect(() => {
    if (!previewOpen) setPreviewPlaylistId(null);
  }, [previewOpen]);

  const previewQuery = usePlaylistQuery(previewPlaylistId ? String(previewPlaylistId) : '');
  const previewPlaylist = previewPlaylistId ? (previewQuery.data ?? null) : null;
  const previewAssets = (previewPlaylist as any)?.assets ?? [];

  const detailsError = detailsQuery.error ? String(detailsQuery.error) : null;
  const playlistsError =
    playlistsQuery.error instanceof Error
      ? playlistsQuery.error.message
      : playlistsQuery.error
        ? String(playlistsQuery.error)
        : null;

  const isBusy =
    detailsQuery.isLoading ||
    playlistsQuery.isLoading ||
    playlistsQuery.isFetching ||
    removePlaylistsMutation.isPending;

  const combinedError = detailsError
    ? `${t('playlistGroups.groupCard.failedToLoadGroupDetails')} ${detailsError}`
    : playlistsError;

  const showPreviewLoading = previewOpen && !!previewPlaylistId && previewQuery.isLoading;

  const menuItemClass = 'cursor-pointer focus:bg-muted data-[highlighted]:bg-muted';

  const menuActions = useMemo(
    () => [
      {
        key: 'edit',
        label: t('playlistGroups.groupCard.actions.edit'),
        icon: <Edit className="mr-2 h-4 w-4" />,
        onClick: onEdit,
      },
      {
        key: 'add',
        label: t('playlistGroups.groupCard.actions.add'),
        icon: <Plus className="mr-2 h-4 w-4" />,
        onClick: () => setAddPlaylistsOpen(true),
      },
      {
        key: 'export',
        label: t('playlistGroups.groupCard.actions.export'),
        icon: <Download className="mr-2 h-4 w-4" />,
        onClick: onExportExcel,
      },
      { key: 'sep', separator: true as const },
      {
        key: 'delete',
        label: t('playlistGroups.groupCard.actions.delete'),
        icon: <Trash2 className="mr-2 h-4 w-4" />,
        onClick: onDelete,
        destructive: true,
      },
    ],
    [t, onEdit, onExportExcel, onDelete],
  );

  const handleConfirmAddPlaylists = useCallback(
    async (newPlaylistIds: number[]) => {
      await addPlaylistsMutation.mutateAsync({
        id: group.id,
        playlistIds: newPlaylistIds,
      });
    },
    [addPlaylistsMutation, group.id],
  );

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader
          className="cursor-pointer transition-colors hover:bg-muted/40"
          onClick={onToggle}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="pt-0.5">{icon}</div>

              <div className="min-w-0">
                <CardTitle className="truncate text-lg">{group.name}</CardTitle>

                <p
                  className={[
                    'mt-0.5 text-sm text-muted-foreground whitespace-pre-line',
                    isExpanded ? '' : 'line-clamp-2',
                  ].join(' ')}
                >
                  {group.description || t('playlistGroups.groupCard.noDescription')}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {t('playlistGroups.groupCard.playlistsCount', { count: playlistCount })}
                  </Badge>

                  {group.duration ? <Badge variant="outline">{group.duration}</Badge> : null}

                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {t('playlistGroups.groupCard.idLabel', { id: group.id })}
                  </span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="z-50 w-56 border bg-popover shadow-lg">
                {menuActions.map((a) => {
                  if ('separator' in a) return <DropdownMenuSeparator key={a.key} />;

                  return (
                    <DropdownMenuItem
                      key={a.key}
                      className={[
                        menuItemClass,
                        a.destructive ? 'text-destructive focus:text-destructive' : '',
                      ].join(' ')}
                      onClick={stopPropagation(a.onClick)}
                    >
                      {a.icon}
                      {a.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        {isExpanded ? (
          <CardContent className="relative pb-4 pt-0">
            <div className="space-y-3 border-t pt-4">
              <div className="text-sm text-muted-foreground">
                {t('playlistGroups.groupCard.playlistsInGroup')}
              </div>

              <PlaylistsMiniGrid
                items={playlistItems}
                activeId={activePlaylistId}
                onSelect={handlePlaylistSelect}
                onPreview={handlePreview}
                onRemove={handleRemoveFromGroup}
                isLoading={isBusy}
                error={combinedError}
                t={t}
              />
            </div>

            {previewOpen ? (
              <>
                {showPreviewLoading ? (
                  <div className="absolute inset-0 z-30">
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
                  onClose={handleClosePreview}
                  t={tp}
                />
              </>
            ) : null}
          </CardContent>
        ) : null}
      </Card>

      <AddPlaylistsDialog
        t={t}
        open={addPlaylistsOpen}
        onOpenChange={setAddPlaylistsOpen}
        groupName={group.name}
        alreadyAddedPlaylistIds={playlistIds}
        isSubmitting={addPlaylistsMutation.isPending}
        onConfirm={handleConfirmAddPlaylists}
      />

      <RemovePlaylistFromGroupDialog
        open={removeOpen}
        onOpenChange={handleRemoveOpenChange}
        groupName={group.name ?? null}
        playlistName={pendingPlaylistName}
        isRemoving={removePlaylistsMutation.isPending}
        onConfirm={handleConfirmRemove}
      />
    </>
  );
}
