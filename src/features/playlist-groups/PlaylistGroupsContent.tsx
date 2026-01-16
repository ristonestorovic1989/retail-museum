'use client';

import { useCallback, useMemo, useState } from 'react';
import { ListTree, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { TablePagination } from '@/components/shared/table-pagination';
import { SearchInput } from '@/components/shared/search-input';

import { PlaylistGroup } from './types';
import {
  playlistGroupsApi,
  useCreatePlaylistGroupMutation,
  useDeletePlaylistGroupMutation,
  usePlaylistGroupsQuery,
  useUpdatePlaylistGroupMutation,
} from './api.client';

import { GroupList } from './components/GroupList';
import { CreateGroupDialog } from './components/CreateGroupDialog';
import { EditGroupDialog } from './components/EditGroupDialog';
import { DeleteGroupDialog } from './components/DeleteGroupDialog';
import { PageHeader } from '@/components/layout/PageHeader';

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function PlaylistGroupsContent() {
  const t = useTranslations();

  const [searchTerm, setSearchTerm] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [expandedIds, setExpandedIds] = useState<number[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PlaylistGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<PlaylistGroup | null>(null);

  const listQuery = usePlaylistGroupsQuery({
    searchTerm: searchTerm || undefined,
    page,
    pageSize,
    sortBy: 'Name',
    sortDir: 'asc',
  });

  const groups = listQuery.data?.data.items ?? [];
  const totalCount = listQuery.data?.data.totalCount ?? 0;

  const totalPlaylistsOnPage = useMemo(() => {
    return groups.reduce((acc, g) => acc + (g.numberOfPlaylists ?? g.playlistIds?.length ?? 0), 0);
  }, [groups]);

  const createMut = useCreatePlaylistGroupMutation();
  const updateMut = useUpdatePlaylistGroupMutation();
  const deleteMut = useDeletePlaylistGroupMutation();

  function resetExpandedAndGoToFirstPage() {
    setExpandedIds([]);
    setPage(1);
  }

  function toggleExpanded(groupId: number) {
    setExpandedIds((prev) =>
      prev.includes(groupId) ? prev.filter((x) => x !== groupId) : [...prev, groupId],
    );
  }

  const handleSearchDebounced = useCallback(
    (value: string) => {
      const normalized = value.trim();

      if (normalized === searchTerm) return;

      setSearchTerm(normalized);
      resetExpandedAndGoToFirstPage();
    },
    [searchTerm],
  );

  function handlePageChange(newPage: number) {
    setExpandedIds([]);
    setPage(newPage);
  }

  function handlePageSizeChange(newPageSize: number) {
    setExpandedIds([]);
    setPageSize(newPageSize);
    setPage(1);
  }

  async function handleCreateSubmit(values: {
    name: string;
    description: string;
    descriptionTranslations: Partial<
      Record<'en' | 'sr' | 'de' | 'fr' | 'es' | 'it' | 'ru' | 'zh', string>
    >;
    imageUrl: string;
    backgroundUrl: string;
    playlistIds: number[];
  }) {
    const hasTranslations = Object.keys(values.descriptionTranslations).length > 0;

    await createMut.mutateAsync({
      name: values.name,
      description: values.description || null,
      ...(hasTranslations ? { descriptionTranslations: values.descriptionTranslations } : {}),
      imageUrl: values.imageUrl || null,
      backgroundUrl: values.backgroundUrl || null,
      playlistIds: values.playlistIds,
    });
  }

  async function handleEditSubmit(values: {
    name: string;
    description: string;
    imageUrl: string;
    backgroundUrl: string;
    playlistIds: number[];
  }) {
    if (!editingGroup) return;

    try {
      await updateMut.mutateAsync({
        id: editingGroup.id,
        body: {
          name: values.name,
          description: values.description || null,
          imageUrl: values.imageUrl || null,
          backgroundUrl: values.backgroundUrl || null,
          playlistIds: values.playlistIds,
        },
      });

      toast.success(t('playlistGroups.toasts.groupUpdated.title'), {
        description: t('playlistGroups.toasts.groupUpdated.desc'),
      });

      setEditingGroup(null);
    } catch (e) {
      toast.error(t('toasts.updateFailed.title'), {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingGroup) return;

    try {
      await deleteMut.mutateAsync(deletingGroup.id);

      toast.success(t('playlistGroups.toasts.groupDeleted.title'), {
        description: t('playlistGroups.toasts.groupDeleted.desc', { name: deletingGroup.name }),
      });

      setDeletingGroup(null);
      setExpandedIds([]);
      setPage((p) => Math.max(1, p - (groups.length === 1 ? 1 : 0)));
    } catch (e) {
      toast.error(t('toasts.deleteFailed.title'), {
        description: e instanceof Error ? e.message : String(e),
      });
    }
  }

  const handleExportExcel = useCallback(
    (group: PlaylistGroup) => {
      const url = playlistGroupsApi.getExportExcelUrl(group.id, group.name);

      console.log('EXPORT URL', url);

      const a = document.createElement('a');
      a.href = url;
      a.download = '';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();

      toast.success(t('playlistGroups.toasts.export.title'), {
        description: t('playlistGroups.toasts.export.desc', { name: group.name }),
      });
    },
    [t],
  );

  function handleAddPlaylist(group: PlaylistGroup) {}

  function handleEditOpenChange(open: boolean) {
    if (!open) setEditingGroup(null);
  }

  function handleDeleteOpenChange(open: boolean) {
    if (!open) setDeletingGroup(null);
  }

  const listError = listQuery.error ? String(listQuery.error) : null;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<ListTree className="h-6 w-6" />}
        title={t('playlistGroups.title')}
        subtitle={t('playlistGroups.subtitle')}
        rightSlot={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            {t('playlistGroups.groupCard.actions.create')}
          </Button>
        }
      />

      <SearchInput
        value={searchTerm}
        onDebouncedChange={handleSearchDebounced}
        placeholder={t('playlistGroups.searchPlaceholder')}
        clearable
      />

      <GroupList
        groups={groups}
        expandedIds={expandedIds}
        isLoading={listQuery.isLoading}
        error={listError}
        onToggleExpanded={toggleExpanded}
        onEditGroup={setEditingGroup}
        onDeleteGroup={setDeletingGroup}
        onExportExcel={handleExportExcel}
        onAddPlaylist={handleAddPlaylist}
        t={t}
      />

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={handlePageSizeChange}
        onPageChange={handlePageChange}
      />

      <CreateGroupDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        isSaving={createMut.isPending}
        onSubmit={handleCreateSubmit}
      />

      <EditGroupDialog
        group={editingGroup}
        open={!!editingGroup}
        onOpenChange={handleEditOpenChange}
        isSaving={updateMut.isPending}
        onSubmit={handleEditSubmit}
      />

      <DeleteGroupDialog
        group={deletingGroup}
        open={!!deletingGroup}
        onOpenChange={handleDeleteOpenChange}
        isDeleting={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
