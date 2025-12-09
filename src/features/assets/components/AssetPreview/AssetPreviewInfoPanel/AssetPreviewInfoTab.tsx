'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  FileImage,
  HardDrive,
  Image as ImageIcon,
  Maximize,
  Tag,
  User,
  Archive,
  CheckCircle,
  XCircle,
  Trash2,
} from 'lucide-react';

import { formatDate, formatFileSize, formatRelativeTime } from '@/lib/format';
import { AssetListItem } from '@/features/assets/types';
import { TFn } from '@/types/i18n';

type InfoTabProps = {
  asset: AssetListItem;
  t: TFn;
  statusLabel: string;
  statusBadgeClasses: string;
  archivedLabel: string;
  deletedLabel: string;
  orientation?: string;
  dimensionsLabel?: string;
};

const getAssetTypeLabel = (t: TFn, typeId: number) => {
  switch (typeId) {
    case 1:
    case 3:
      return t('edit.fields.type.options.image', { defaultValue: 'Image' });
    case 2:
      return t('edit.fields.type.options.video', { defaultValue: 'Video' });
    default:
      return t('edit.fields.type.options.document', { defaultValue: 'Document' });
  }
};

export const AssetPreviewInfoTab = ({
  asset,
  t,
  statusLabel,
  statusBadgeClasses,
  archivedLabel,
  deletedLabel,
  orientation,
  dimensionsLabel,
}: InfoTabProps) => {
  return (
    <TabsContent value="info" className="space-y-4 mt-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-1">
          {t('edit.fields.name.label', { defaultValue: 'Asset name' })}
        </h4>
        <p className="text-sm font-medium break-all">{asset.name}</p>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <ImageIcon className="h-3 w-3" />
            {t('edit.fields.type.label', { defaultValue: 'Type' })}
          </h4>
          <p className="text-sm">{getAssetTypeLabel(t, asset.assetTypeId)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <FileImage className="h-3 w-3" />
            {t('edit.fields.format.label', { defaultValue: 'Format' })}
          </h4>
          <p className="text-sm uppercase">{asset.format}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {t('edit.fields.size.label', { defaultValue: 'Size' })}
          </h4>
          <p className="text-sm">{formatFileSize(asset.size)}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-1 flex items-center gap-1">
            <Maximize className="h-3 w-3" />
            {t('preview.fields.dimensions', { defaultValue: 'Dimensions' })}
          </h4>
          <p className="text-sm">
            {dimensionsLabel ?? 'N/A'}
            {orientation && orientation !== 'Unknown' && (
              <span className="text-muted-foreground"> · {orientation}</span>
            )}
          </p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2">
          {t('edit.fields.status.label', { defaultValue: 'Status' })}
        </h4>
        <div className="flex flex-wrap gap-2">
          <Badge className={`flex items-center gap-1 border ${statusBadgeClasses}`}>
            {asset.active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
            {statusLabel}
          </Badge>
          {asset.archived && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Archive className="h-3 w-3" />
              {archivedLabel}
            </Badge>
          )}
          {asset.isDeleted && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Trash2 className="h-3 w-3" />
              {deletedLabel}
            </Badge>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1">
          <Tag className="h-3 w-3" />
          {t('edit.fields.tags.label', { defaultValue: 'Tags' })}
        </h4>
        <div className="flex flex-wrap gap-1">
          {asset.tags && asset.tags.length > 0 ? (
            asset.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              {t('preview.tags.empty', { defaultValue: 'No tags' })}
            </span>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <User className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">
              {t('preview.fields.uploadedBy', { defaultValue: 'Uploaded by' })}:
            </span>
            <p className="font-medium">{asset.uploadedBy}</p>
          </div>
        </div>
        {asset.updatedBy && (
          <div className="flex items-start gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <span className="text-muted-foreground">
                {t('preview.fields.updatedBy', { defaultValue: 'Updated by' })}:
              </span>
              <p className="font-medium">{asset.updatedBy}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">
              {t('preview.fields.createdAt', { defaultValue: 'Created' })}:
            </span>
            <p>{formatDate(asset.dateOfUploading)}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(asset.dateOfUploading)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm">
          <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <span className="text-muted-foreground">
              {t('preview.fields.updatedAt', { defaultValue: 'Last updated' })}:
            </span>
            <p>{formatDate(asset.dateOfUpdate)}</p>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(asset.dateOfUpdate)}
            </p>
          </div>
        </div>
      </div>
    </TabsContent>
  );
};
