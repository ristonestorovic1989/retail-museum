'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HardDrive, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { useAssetsQuery, useDeleteAssetsMutation } from './api.client';
import type { AssetListItem } from './types';

import { AssetsHeader } from './components/AssetsHeader';
import { AssetsTableView } from './components/AssetsTableView';
import { AssetsGridView } from './components/AssetsGridView';
import { AssetsUploadDialog } from './components/AssetsUploadDialog';
import { AssetPreview } from './components/AssetPreview';
import { getAssetUrl } from '@/lib/assets';
import { useConfirm } from '@/providers/confirm-provider';

type ViewMode = 'table' | 'grid';

export default function AssetsContent() {
  const t = useTranslations('assets');
  const router = useRouter();
  const confirm = useConfirm();

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [previewAsset, setPreviewAsset] = useState<AssetListItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data, isLoading, isFetching } = useAssetsQuery({
    searchTerm: searchQuery || undefined,
    page,
    pageSize,
  });

  const deleteMutation = useDeleteAssetsMutation();
  const isDeleting = deleteMutation.isPending;

  const items: AssetListItem[] = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const loading = isLoading || isFetching || isDeleting;

  useEffect(() => {
    setPage(1);
    setSelectedAssetIds([]);
  }, [searchQuery]);

  const handlePreviewAsset = (asset: AssetListItem) => {
    setPreviewAsset(asset);
    setIsPreviewOpen(true);
  };

  const handleOpenDetails = (asset: AssetListItem) => {
    router.push(`/en/assets/${asset.id}`);
  };

  const handleRowClick = (asset: AssetListItem) => {
    handlePreviewAsset(asset);
  };

  const handleDownloadAsset = (asset: AssetListItem) => {
    try {
      const assetUrl = getAssetUrl(asset, { thumbnail: false });
      if (!assetUrl) {
        throw new Error('Missing asset URL');
      }

      const fileName = asset.name || `asset-${asset.id}`;

      const apiUrl = `/api/assets/download?url=${encodeURIComponent(
        assetUrl,
      )}&name=${encodeURIComponent(fileName)}`;

      const link = document.createElement('a');
      link.href = apiUrl;
      link.download = fileName;
      link.rel = 'noopener noreferrer';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download asset error', error);
      toast.error(t('download.errorTitle', { defaultValue: 'Failed to download asset' }));
    }
  };

  const handleEditAssetClick = (asset: AssetListItem) => {
    handleOpenDetails(asset);
  };

  const deleteMany = async (ids: number[]) => {
    if (!ids.length) return;

    const confirmed = await confirm({
      title:
        ids.length === 1
          ? t('delete.confirmTitle', { defaultValue: 'Delete asset' })
          : t('bulk.delete', { defaultValue: 'Delete selected assets' }),
      description:
        ids.length === 1
          ? t('delete.confirmDescription', {
              defaultValue: 'Are you sure you want to delete this asset?',
            })
          : t('bulk.confirmDelete', {
              count: ids.length,
              defaultValue: 'Are you sure you want to delete {count} selected assets?',
            }),
      variant: 'destructive',
      confirmText:
        ids.length === 1
          ? t('delete.confirm', { defaultValue: 'Delete' })
          : t('bulk.delete', { defaultValue: 'Delete' }),
      cancelText: t('delete.cancel', { defaultValue: 'Cancel' }),
    });

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync(ids);

      setSelectedAssetIds([]);

      if (previewAsset && ids.includes(previewAsset.id)) {
        setIsPreviewOpen(false);
        setPreviewAsset(null);
      }

      toast.success(
        ids.length === 1
          ? t('delete.successTitle', { defaultValue: 'Asset deleted successfully' })
          : t('bulk.successTitle', { defaultValue: 'Assets deleted successfully' }),
      );
    } catch (error: any) {
      console.error('Delete assets error', error);
      toast.error(
        ids.length === 1
          ? t('delete.errorTitle', { defaultValue: 'Failed to delete asset' })
          : t('bulk.errorTitle', { defaultValue: 'Failed to delete selected assets' }),
        {
          description: error?.message,
        },
      );
    }
  };

  const handleDeleteAsset = async (asset: AssetListItem) => {
    await deleteMany([asset.id]);
  };

  const handleTableBulkDelete = async (rows: AssetListItem[]) => {
    const ids = rows.map((r) => r.id);
    await deleteMany(ids);
  };

  const handleGridBulkDelete = async () => {
    if (!selectedAssetIds.length) return;
    await deleteMany(selectedAssetIds);
  };

  const handleUploadClick = () => {
    setIsUploadOpen(true);
  };

  const handleToggleSelect = (id: number) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleClearSelection = () => {
    setSelectedAssetIds([]);
  };

  const handlePageChange = (newPage: number) => {
    setSelectedAssetIds([]);
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setSelectedAssetIds([]);
    setPage(1);
    setPageSize(newPageSize);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        icon={<HardDrive className="h-6 w-6" />}
        title={t('title')}
        subtitle={t('subtitle')}
      />

      <Card>
        <AssetsHeader
          t={t}
          totalCount={totalCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onUploadClick={handleUploadClick}
        />

        <CardContent>
          {viewMode === 'grid' && selectedAssetIds.length > 0 && (
            <div className="mb-4 flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                {t('bulk.selected', { count: selectedAssetIds.length })}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClearSelection}>
                  {t('bulk.clearSelection')}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleGridBulkDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('bulk.delete')}
                </Button>
              </div>
            </div>
          )}

          {viewMode === 'table' ? (
            <AssetsTableView
              t={t}
              items={items}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onRowClick={handleRowClick}
              onDownload={handleDownloadAsset}
              onEdit={handleEditAssetClick}
              onDelete={handleDeleteAsset}
              onBulkDelete={handleTableBulkDelete}
              selectedAssetIds={selectedAssetIds}
              onSelectedAssetIdsChange={setSelectedAssetIds}
              pageSizeOptions={[10, 25, 50, 100]}
              onPageSizeChange={handlePageSizeChange}
            />
          ) : (
            <AssetsGridView
              t={t}
              items={items}
              loading={loading}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              onPageChange={handlePageChange}
              onCardClick={handleRowClick}
              onDownload={handleDownloadAsset}
              onEdit={handleEditAssetClick}
              onDelete={handleDeleteAsset}
              selectedAssetIds={selectedAssetIds}
              pageSizeOptions={[10, 25, 50, 100]}
              onPageSizeChange={handlePageSizeChange}
              onToggleSelect={handleToggleSelect}
            />
          )}
        </CardContent>
      </Card>

      <AssetPreview
        open={isPreviewOpen}
        onOpenChange={(open) => {
          setIsPreviewOpen(open);
          if (!open) {
            // setPreviewAsset(null);
          }
        }}
        asset={previewAsset}
        assets={items}
        onEdit={handleEditAssetClick}
        onDelete={handleDeleteAsset}
        onDownload={handleDownloadAsset}
      />

      <AssetsUploadDialog t={t} open={isUploadOpen} onOpenChange={setIsUploadOpen} companyId={0} />
    </div>
  );
}
