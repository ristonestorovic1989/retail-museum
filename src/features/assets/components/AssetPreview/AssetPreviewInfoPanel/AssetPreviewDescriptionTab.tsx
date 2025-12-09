'use client';

import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TabsContent } from '@/components/ui/tabs';
import { AssetListItem } from '@/features/assets/types';
import { TFn } from '@/types/i18n';
import { Eye, FileText, XCircle } from 'lucide-react';

type DescriptionTabProps = {
  asset: AssetListItem;
  t: TFn;
};

export const AssetPreviewDescriptionTab = ({ asset, t }: DescriptionTabProps) => {
  return (
    <TabsContent value="description" className="space-y-4 mt-4">
      {asset.description ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {t('edit.fields.mainDescription.label', {
                defaultValue: 'Description',
              })}
            </h4>
            {asset.isDescriptionVisible ? (
              <Badge variant="outline" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                {t('preview.description.visible', {
                  defaultValue: 'Visible',
                })}
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <XCircle className="h-3 w-3 mr-1" />
                {t('preview.description.hidden', {
                  defaultValue: 'Hidden',
                })}
              </Badge>
            )}
          </div>
          <ScrollArea className="h-64">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {asset.description}
            </p>
          </ScrollArea>
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            {t('preview.description.empty', {
              defaultValue: 'No description',
            })}
          </p>
        </div>
      )}
    </TabsContent>
  );
};
