'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Settings, Trash2, LayoutGrid, Rows3, MonitorSmartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useConfirm } from '@/providers/confirm-provider';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable, type ColumnDef } from '@/components/shared/data-table';

import { useDevicesQuery, useDeleteDeviceMutation } from './api.client';
import type { DeviceListItem } from './types';
import { DeviceStatus } from './types';
import { DevicesGridView } from './components/DevicesGridView';

const PAGE_SIZE = 10;

type ViewMode = 'grid' | 'table';

export default function DevicesContent() {
  const t = useTranslations('devices');
  const router = useRouter();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [sortBy] = useState<string | undefined>(undefined);
  const [sortDir] = useState<'asc' | 'desc' | undefined>(undefined);

  const { data, isLoading, isFetching } = useDevicesQuery({
    searchTerm: searchQuery || undefined,
    sortBy,
    sortDir,
    page,
    pageSize: PAGE_SIZE,
  });

  const deleteMutation = useDeleteDeviceMutation();

  const items: DeviceListItem[] = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const isBusy = isLoading || isFetching;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const handleCardClick = (device: DeviceListItem) => {
    router.push(`./devices/${device.id}`);
  };

  const handleEdit = (device: DeviceListItem) => {
    router.push(`./devices/${device.id}`);
  };

  const handleDelete = async (device: DeviceListItem) => {
    const ok = await confirm({
      title: t('delete.title'),
      description: t('delete.description', { name: device.name }),
      confirmText: t('delete.confirm'),
      cancelText: t('delete.cancel'),
      variant: 'destructive',
    });

    if (!ok) return;

    deleteMutation.mutate(device.id);
  };

  const handleRowClick = (row: DeviceListItem) => {
    router.push(`./devices/${row.id}`);
  };

  const columns: ColumnDef<DeviceListItem>[] = [
    {
      id: 'name',
      header: t('table.columns.name'),
      cell: (device) => <span className="font-medium">{device.name}</span>,
    },
    {
      id: 'type',
      header: t('table.columns.type'),
      cell: (device) => device.type,
    },
    {
      id: 'os',
      header: t('table.columns.os'),
      cell: (device) => <span className="text-muted-foreground">{device.os}</span>,
    },
    {
      id: 'date',
      header: t('table.columns.date'),
      cell: (device) => (
        <span className="text-muted-foreground">{device.registrationDateFormatted}</span>
      ),
    },
    {
      id: 'status',
      header: t('table.columns.status'),
      cell: (device) => (
        <span>
          <span
            className={
              device.status === DeviceStatus.Active
                ? 'inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500'
                : 'inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground'
            }
          >
            {device.status === DeviceStatus.Active ? t('status.active') : t('status.inactive')}
          </span>
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('table.columns.actions'),
      className: 'text-right',
      cell: (device) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button onClick={() => handleEdit(device)} variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={async () => {
              await handleDelete(device);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<MonitorSmartphone className="h-6 w-6" />}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{t('table.title')}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('table.subtitle', { count: totalCount })}
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <div className="relative w-full max-w-xs sm:max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('table.searchPlaceholder')}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="inline-flex items-center justify-end gap-1 rounded-md border bg-background p-1">
                <Button
                  type="button"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode('table')}
                >
                  <Rows3 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {viewMode === 'grid' ? (
            <DevicesGridView
              items={items}
              page={page}
              pageSize={PAGE_SIZE}
              totalCount={totalCount}
              isBusy={isBusy}
              t={t}
              onPageChange={setPage}
              onCardClick={handleCardClick}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <DataTable<DeviceListItem>
              columns={columns}
              data={items}
              page={page}
              pageSize={PAGE_SIZE}
              totalCount={totalCount}
              onPageChange={setPage}
              isLoading={isBusy}
              loadingLabel={t('table.loading')}
              emptyMessage={t('table.empty')}
              enableSelection
              selectedLabel={(count) => t('table.bulk.selected', { count })}
              bulkActionLabel={t('table.bulk.delete')}
              clearSelectionLabel={t('table.bulk.clearSelection')}
              onBulkAction={async (rows) => {
                const ok = await confirm({
                  title: t('table.bulk.confirmTitle'),
                  description: t('table.bulk.confirmDescription', {
                    count: rows.length,
                  }),
                  confirmText: t('table.bulk.confirm'),
                  cancelText: t('table.bulk.cancel'),
                  variant: 'destructive',
                });

                if (!ok) return;

                await Promise.all(rows.map((row) => deleteMutation.mutateAsync(row.id)));
              }}
              onRowClick={handleRowClick}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
