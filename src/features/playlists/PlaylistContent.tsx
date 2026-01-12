'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, TabletSmartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';

import { usePlaylistsQuery } from './api.client';
import { PlaylistsList } from './components/PlaylistList';
import { PlaylistDetailsPanel } from './components/PlaylistDetails';
import { PlaylistCreateDialog } from './components/PlaylistCreateDialog';

function getCompanyIdFallback() {
  return 1;
}

export default function PlaylistsContent() {
  const t = useTranslations();

  const [companyId] = useState<number>(() => getCompanyIdFallback());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingCreatedId, setPendingCreatedId] = useState<number | null>(null);

  const { data, isLoading, isError, error } = usePlaylistsQuery({
    companyId,
    searchTerm: searchTerm || undefined,
    page: 1,
    pageSize: 100,
  });

  const items = data?.items ?? [];

  const effectiveSelectedId = useMemo(() => {
    if (selectedId != null) return selectedId;
    return items.length ? items[0]!.id : null;
  }, [items, selectedId]);

  useEffect(() => {
    if (pendingCreatedId == null) return;
    const exists = items.some((x) => Number(x.id) === pendingCreatedId);
    if (exists) setPendingCreatedId(null);
  }, [items, pendingCreatedId]);

  useEffect(() => {
    if (selectedId == null) return;

    const exists = items.some((x) => Number(x.id) === selectedId);

    if (!exists && pendingCreatedId === selectedId) return;

    if (!exists) setSelectedId(items.length ? Number(items[0]!.id) : null);
  }, [items, selectedId, pendingCreatedId]);

  return (
    <div className="space-y-6 w-full min-w-0 overflow-x-hidden">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          icon={<TabletSmartphone className="h-6 w-6" />}
          title={t('playlists.title')}
          subtitle={t('playlists.subtitle')}
        />

        <Button className="gap-2" onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          {t('playlists.actions.create')}
        </Button>
      </div>

      <div
        className="
          grid grid-cols-1 gap-6
          lg:grid-cols-3 lg:items-stretch
          lg:h-[calc(100dvh-160px)] lg:min-h-0
          xl:h-[calc(100dvh-140px)]
          2xl:h-[calc(100dvh-120px)]
        "
      >
        <PlaylistsList
          t={t as any}
          items={items}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          selectedId={effectiveSelectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setPendingCreatedId(null);
          }}
          isLoading={isLoading}
          error={
            isError
              ? error instanceof Error
                ? error.message
                : t('playlists.errors.loadList')
              : null
          }
        />

        <PlaylistDetailsPanel
          t={t as any}
          companyId={companyId}
          selectedId={effectiveSelectedId}
          onDeleted={() => setSelectedId(null)}
        />
      </div>

      <PlaylistCreateDialog
        t={t as any}
        open={createOpen}
        onOpenChange={setCreateOpen}
        companyId={companyId}
        onCreated={(newId) => {
          setSelectedId(newId);
          setPendingCreatedId(newId);
        }}
      />
    </div>
  );
}
