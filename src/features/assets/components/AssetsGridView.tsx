'use client';

import Image from 'next/image';
import { Clock, Tag as TagIcon, Download, Edit, Trash2, ImageIcon, Eye } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { TablePagination } from '@/components/shared/table-pagination';

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
  onCardClick: (asset: AssetListItem) => void;
  onDownload: (asset: AssetListItem) => void;
  onEdit: (asset: AssetListItem) => void;
  onDelete: (asset: AssetListItem) => void;

  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;

  selectedAssetIds: number[];
  onToggleSelect: (id: number) => void;
};

export function AssetsGridView({
  t,
  items,
  loading,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onCardClick,
  onDownload,
  onEdit,
  onDelete,
  selectedAssetIds,
  onToggleSelect,
  pageSizeOptions,
  onPageSizeChange,
}: Props) {
  if (loading) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">{t('table.loading')}</div>
    );
  }

  if (!items.length) {
    return <div className="py-8 text-center text-sm text-muted-foreground">{t('table.empty')}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((asset) => {
          const thumbSrc = getAssetUrl(asset.thumbnailPath);
          const isSelected = selectedAssetIds.includes(asset.id);
          const type = getAssetTypeFromId(asset.assetTypeId);
          const typeLabel = t(`edit.fields.type.options.${type}`);

          return (
            <Card
              key={asset.id}
              className={`group cursor-pointer overflow-hidden p-0 transition-shadow hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onCardClick(asset)}
            >
              <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {thumbSrc ? (
                  <Image
                    src={thumbSrc}
                    alt={asset.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-8 w-8" />
                  </div>
                )}

                <div className="absolute left-2 top-2 z-10" onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={isSelected}
                    aria-label="Select asset"
                    onCheckedChange={() => onToggleSelect(asset.id)}
                  />
                </div>

                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCardClick(asset);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(asset);
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(asset);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(asset);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="space-y-2 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="line-clamp-2 text-sm font-medium">{asset.name}</p>
                  <Badge variant="outline" className="whitespace-nowrap text-xs">
                    {asset.format}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{asset.dateOfUploadingFormatted}</span>
                  </div>
                  <span>{`${(asset.size / 1024).toFixed(1)} KB`}</span>
                </div>

                {asset.tags && asset.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {asset.tags.slice(0, 3).map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1 text-[10px]"
                      >
                        <TagIcon className="h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                    {asset.tags.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{asset.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <AssetTypeIcon type={type} />
                  <span>{typeLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        pageSizeOptions={pageSizeOptions}
        onPageSizeChange={onPageSizeChange}
        onPageChange={(newPage) => {
          onPageChange(newPage);
        }}
      />
    </>
  );
}
