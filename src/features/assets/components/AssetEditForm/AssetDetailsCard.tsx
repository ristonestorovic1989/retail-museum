'use client';

import Image from 'next/image';
import { FileImage, Trash2, Plus } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { AppSelect } from '@/components/shared/app-select';
import { AssetEditViewModel, AssetStatus } from '../../types';
import { ASSET_STATUS_TRANSLATION_KEYS, ASSET_STATUSES } from '../../constants';

type TFn = (key: string, values?: Record<string, any>) => string;

type AssetDetailsCardProps = {
  t: TFn;
  asset: AssetEditViewModel;
  typeLabel: string;
  newTag: string;
  onChangeAsset: (updater: (prev: AssetEditViewModel) => AssetEditViewModel) => void;
  onChangeNewTag: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (index: number) => void;
  mainDescription: string;
  onChangeMainDescription: (value: string) => void;
};

export function AssetDetailsCard({
  t,
  asset,
  typeLabel,
  newTag,
  onChangeAsset,
  onChangeNewTag,
  onAddTag,
  onRemoveTag,
  mainDescription,
  onChangeMainDescription,
}: AssetDetailsCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('sections.details.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded bg-background overflow-hidden">
              {asset.previewUrl ? (
                <Image
                  src={asset.previewUrl}
                  alt={asset.name}
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileImage className="h-12 w-12 text-muted-foreground" />
              )}
            </div>

            <div className="flex-1">
              <p className="font-medium">{asset.name}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span>{asset.format.toUpperCase()}</span>
                <span>•</span>
                <span>
                  {(asset.size / 1024 / 1024).toFixed(2)} {t('fields.sizeUnit')}
                </span>
                <span>•</span>
                <span>{asset.dateOfUploadingFormatted}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset-name">{t('fields.name.label')}</Label>
              <Input
                id="asset-name"
                value={asset.name}
                onChange={(e) =>
                  onChangeAsset((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder={t('fields.name.placeholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('fields.type.label')}</Label>
                <Input value={typeLabel} disabled className="bg-muted" />
              </div>

              <AppSelect<AssetStatus>
                id="asset-status"
                label={t('fields.status.label')}
                placeholder={t('fields.status.placeholder')}
                value={asset.status}
                onChange={(v) =>
                  onChangeAsset((prev) => ({
                    ...prev,
                    status: v,
                  }))
                }
                options={ASSET_STATUSES.map((value) => ({
                  value,
                  label: t(
                    ASSET_STATUS_TRANSLATION_KEYS[value.toLowerCase() as Lowercase<AssetStatus>],
                  ),
                }))}
              />

              <div className="space-y-2">
                <Label htmlFor="asset-format">{t('fields.format.label')}</Label>
                <Input
                  id="asset-format"
                  value={asset.format.toUpperCase()}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('fields.tags.label')}</Label>
              <div className="flex flex-wrap gap-2 rounded-lg border p-3">
                {asset.tags.map((tag, index) => (
                  <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => onRemoveTag(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => onChangeNewTag(e.target.value)}
                    placeholder={t('fields.tags.placeholder')}
                    className="h-7 w-32 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7"
                    onClick={onAddTag}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    {t('fields.tags.add')}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="asset-description">{t('fields.mainDescription.label')}</Label>
              <Textarea
                id="asset-description"
                placeholder={t('fields.mainDescription.placeholder')}
                rows={4}
                className="resize-none"
                value={mainDescription}
                onChange={(e) => onChangeMainDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{t('fields.mainDescription.helper')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
