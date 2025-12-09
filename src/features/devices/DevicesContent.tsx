'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Monitor, Search, Settings, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useConfirm } from '@/providers/confirm-provider';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useDevicesQuery, useDeleteDeviceMutation } from './api.client';
import { DeviceListItem, DeviceStatus } from './types';

import { DataTable, ColumnDef } from '@/components/shared/data-table';
import { PageHeader } from '@/components/layout/PageHeader';

export default function DevicesContent() {
  const t = useTranslations('devices');
  const router = useRouter();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const [sortBy] = useState<string | undefined>(undefined);
  const [sortDir] = useState<'asc' | 'desc' | undefined>(undefined);

  const pageSize = 10;

  const { data, isLoading, isFetching } = useDevicesQuery({
    searchTerm: searchQuery || undefined,
    sortBy,
    sortDir,
    page,
    pageSize,
  });

  const deleteMutation = useDeleteDeviceMutation();

  const items: DeviceListItem[] = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

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
        <Badge className="bg-success/10 text-success hover:bg-success/20">
          {device.status === DeviceStatus.Active ? t('status.active') : t('status.inactive')}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: t('table.columns.actions'),
      className: 'text-right',
      cell: (device) => (
        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button onClick={() => router.push(`./devices/${device.id}`)} variant="ghost" size="sm">
            <Settings className="h-4 w-4 " />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={async () => {
              const ok = await confirm({
                title: t('delete.title'),
                description: t('delete.description', { name: device.name }),
                confirmText: t('delete.confirm'),
                cancelText: t('delete.cancel'),
                variant: 'destructive',
              });

              if (!ok) return;

              deleteMutation.mutate(device.id);
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
        icon={<Monitor className="h-6 w-6" />}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>{t('table.title')}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {t('table.subtitle', { count: totalCount })}
              </p>
            </div>

            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('table.searchPlaceholder')}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable<DeviceListItem>
            columns={columns}
            data={items}
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            isLoading={isLoading || isFetching}
            loadingLabel={t('table.loading')}
            emptyMessage={t('table.empty')}
            enableSelection
            selectedLabel={(count) => t('table.bulk.selected', { count })}
            bulkActionLabel={t('table.bulk.delete')}
            clearSelectionLabel={t('table.bulk.clearSelection')}
            onBulkAction={async (rows) => {
              const ok = await confirm({
                title: t('table.bulk.confirmTitle'),
                description: t('table.bulk.confirmDescription', { count: rows.length }),
                confirmText: t('table.bulk.confirm'),
                cancelText: t('table.bulk.cancel'),
                variant: 'destructive',
              });

              if (!ok) return;

              await Promise.all(rows.map((row) => deleteMutation.mutateAsync(row.id)));
            }}
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}
