'use client';

import { Separator } from '@/components/ui/separator';
import { TabsContent } from '@/components/ui/tabs';
import { AssetListItem } from '@/features/assets/types';
import { TFn } from '@/types/i18n';

type MetadataTabProps = {
  asset: AssetListItem;
  t: TFn;
};

export const AssetPreviewMetadataTab = ({ asset, t }: MetadataTabProps) => {
  return (
    <TabsContent value="metadata" className="space-y-4 mt-4">
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('preview.metadata.assetId', { defaultValue: 'Asset ID' })}
          </span>
          <span className="font-mono text-xs">{asset.id}</span>
        </div>

        <div className="flex justify-between items-start">
          <span className="text-muted-foreground">
            {t('preview.metadata.guid', { defaultValue: 'GUID' })}
          </span>
          <span className="font-mono text-xs text-right max-w-[180px] break-all">{asset.guid}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('preview.metadata.assetTypeId', { defaultValue: 'Asset Type ID' })}
          </span>
          <span>{asset.assetTypeId}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('preview.metadata.companyId', { defaultValue: 'Company ID' })}
          </span>
          <span>{asset.companyId}</span>
        </div>

        <Separator />

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('edit.fields.format.label', { defaultValue: 'Format' })}
          </span>
          <span>{asset.format}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t('preview.fields.quality', { defaultValue: 'Quality' })}
          </span>
          <span>{asset.quality}</span>
        </div>

        <Separator />

        <div>
          <span className="text-muted-foreground">
            {t('preview.fields.path', { defaultValue: 'Path' })}
          </span>
          <p className="font-mono text-xs mt-1 break-all bg-muted p-2 rounded">{asset.path}</p>
        </div>

        <div>
          <span className="text-muted-foreground">
            {t('preview.fields.thumbnailPath', { defaultValue: 'Thumbnail path' })}
          </span>
          <p className="font-mono text-xs mt-1 break-all bg-muted p-2 rounded">
            {asset.thumbnailPath}
          </p>
        </div>
      </div>
    </TabsContent>
  );
};
