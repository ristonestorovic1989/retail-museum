'use client';

import Image from 'next/image';
import { Download, Edit, Trash2, ImageIcon, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { DataTable, ColumnDef } from '@/components/shared/data-table';

import type { AssetListItem } from '../types';
import { getAssetUrl } from '@/lib/assets';
import { TFn } from '@/types/i18n';
import { AssetTypeIcon, getAssetTypeFromId } from './AssetTypeIcon';

type Props = {
  t: TFn;
  items: AssetListItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onRowClick: (asset: AssetListItem) => void;
  onDownload: (asset: AssetListItem) => void;
  onEdit: (asset: AssetListItem) => void;
  onDelete: (asset: AssetListItem) => void;
  onBulkDelete: (rows: AssetListItem[]) => Promise<void> | void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  selectedAssetIds: number[];
  onSelectedAssetIdsChange: (ids: number[]) => void;
};

export function AssetsTableView({
  t,
  items,
  loading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onRowClick,
  onDownload,
  onEdit,
  onDelete,
  onBulkDelete,
  selectedAssetIds,
  onSelectedAssetIdsChange,
  pageSizeOptions,
  onPageSizeChange,
}: Props) {
  const columns: ColumnDef<AssetListItem>[] = [
    {
      id: 'name',
      header: t('table.columns.name'),
      cell: (asset) => {
        const thumbSrc = getAssetUrl(asset.thumbnailPath);

        return (
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
              {thumbSrc ? (
                <Image src={thumbSrc} alt={asset.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                </div>
              )}
            </div>
            <span className="font-medium">{asset.name}</span>
          </div>
        );
      },
    },
    {
      id: 'assetType',
      header: t('table.columns.assetType'),
      cell: (asset) => {
        const type = getAssetTypeFromId(asset.assetTypeId);
        const label = t(`edit.fields.type.options.${type}`);

        return (
          <div className="flex items-center gap-2">
            <AssetTypeIcon type={type} />
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        );
      },
    },
    {
      id: 'format',
      header: t('table.columns.format'),
      cell: (asset) => asset.format,
    },
    {
      id: 'size',
      header: t('table.columns.size'),
      cell: (asset) => `${(asset.size / 1024).toFixed(1)} KB`,
    },
    {
      id: 'quality',
      header: t('table.columns.quality'),
      cell: (asset) => asset.quality,
    },
    {
      id: 'date',
      header: t('table.columns.uploadingDate'),
      cell: (asset) => (
        <span className="text-muted-foreground">{asset.dateOfUploadingFormatted}</span>
      ),
    },
    {
      id: 'active',
      header: t('table.columns.active'),
      cell: (asset) => {
        const isActive = asset.active;

        return (
          <Badge
            className={
              isActive
                ? 'bg-success/10 text-success hover:bg-success/20'
                : 'bg-muted text-muted-foreground border border-border'
            }
          >
            {isActive ? t('table.status.active') : t('table.status.inactive')}
          </Badge>
        );
      },
    },
    {
      id: 'tags',
      header: t('table.columns.tags'),
      cell: (asset) => (
        <span className="max-w-[220px] truncate text-xs text-muted-foreground">
          {asset.tags?.join(', ')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: t('table.columns.actions'),
      className: 'text-right',
      cell: (asset) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => onRowClick(asset)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDownload(asset)}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onEdit(asset)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => onDelete(asset)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<AssetListItem>
      columns={columns}
      data={items}
      page={page}
      pageSize={pageSize}
      totalCount={totalCount}
      onPageChange={onPageChange}
      isLoading={loading}
      loadingLabel={t('table.loading')}
      emptyMessage={t('table.empty')}
      onRowClick={onRowClick}
      enableSelection
      onBulkAction={onBulkDelete}
      selectedLabel={(count) => t('bulk.selected', { count })}
      bulkActionLabel={t('bulk.delete')}
      clearSelectionLabel={t('bulk.clearSelection')}
      selectedIds={selectedAssetIds}
      onSelectedIdsChange={(ids) => onSelectedAssetIdsChange(ids as number[])}
      pageSizeOptions={pageSizeOptions}
      onPageSizeChange={onPageSizeChange}
    />
  );
}
