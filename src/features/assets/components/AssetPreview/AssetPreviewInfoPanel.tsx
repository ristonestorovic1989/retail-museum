'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Download, Share2 } from 'lucide-react';

import type { AssetListItem } from '../../types';
import { AssetPreviewInfoTab } from './AssetPreviewInfoPanel/AssetPreviewInfoTab';
import { AssetPreviewMetadataTab } from './AssetPreviewInfoPanel/AssetPreviewMetadataTab';
import { AssetPreviewDescriptionTab } from './AssetPreviewInfoPanel/AssetPreviewDescriptionTab';
import { AssetPreviewActionsDropdown } from './AssetPreviewInfoPanel/AssetPreviewActionsDropdown';
import { TFn } from '@/types/i18n';

interface AssetPreviewInfoPanelProps {
  asset: AssetListItem;
  t: TFn;
  statusLabel: string;
  statusBadgeClasses: string;
  archivedLabel: string;
  deletedLabel: string;
  onEdit: (asset: AssetListItem) => void;
  onDelete: (asset: AssetListItem) => void;
  onDownload: () => void;
  onShare: () => void;
  orientation?: string;
  dimensionsLabel?: string;
}

export const AssetPreviewInfoPanel = ({
  asset,
  t,
  statusLabel,
  statusBadgeClasses,
  archivedLabel,
  deletedLabel,
  onEdit,
  onDelete,
  onDownload,
  onShare,
  orientation,
  dimensionsLabel,
}: AssetPreviewInfoPanelProps) => {
  return (
    <div className="w-full md:w-96 border-l bg-background flex flex-col min-w-[260px] min-h-0">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">
          {t('preview.detailsTitle', { defaultValue: 'Asset details' })}
        </h3>
        <div className="flex items-center gap-1">
          <AssetPreviewActionsDropdown
            asset={asset}
            t={t}
            onEdit={onEdit}
            onDelete={onDelete}
            onDownload={onDownload}
            onShare={onShare}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <Tabs defaultValue="info" className="p-4">
          <TabsList className="w-full">
            <TabsTrigger value="info" className="flex-1">
              {t('preview.tabs.info', { defaultValue: 'Info' })}
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex-1">
              {t('preview.tabs.metadata', { defaultValue: 'Metadata' })}
            </TabsTrigger>
            <TabsTrigger value="description" className="flex-1">
              {t('preview.tabs.description', { defaultValue: 'Description' })}
            </TabsTrigger>
          </TabsList>

          <AssetPreviewInfoTab
            asset={asset}
            t={t}
            statusLabel={statusLabel}
            statusBadgeClasses={statusBadgeClasses}
            archivedLabel={archivedLabel}
            deletedLabel={deletedLabel}
            orientation={orientation}
            dimensionsLabel={dimensionsLabel}
          />

          <AssetPreviewMetadataTab asset={asset} t={t} />

          <AssetPreviewDescriptionTab asset={asset} t={t} />
        </Tabs>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={onDownload}>
            <Download className="h-4 w-4 mr-2" />
            {t('actions.download', { defaultValue: 'Download' })}
          </Button>
          <Button variant="outline" onClick={() => onEdit(asset)}>
            <Edit className="h-4 w-4 mr-2" />
            {t('edit.actions.edit', { defaultValue: 'Edit' })}
          </Button>
        </div>
        <Button className="w-full" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-2" />
          {t('preview.actions.shareAsset', { defaultValue: 'Share asset' })}
        </Button>
      </div>
    </div>
  );
};
