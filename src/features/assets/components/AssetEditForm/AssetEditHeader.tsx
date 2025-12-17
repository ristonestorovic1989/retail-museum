'use client';

import { ArrowLeft, Save, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';

type AssetEditHeaderProps = {
  isSaving: boolean;
  onCancel: () => void;
  onSave: () => void;
  title: string;
  subtitle: string;
  assetName?: string;
};

export function AssetEditHeader({
  isSaving,
  onCancel,
  onSave,
  title,
  subtitle,
  assetName,
}: AssetEditHeaderProps) {
  const t = useTranslations('assets.edit');
  const locale = useLocale();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <PageHeader
          title={t('title')}
          breadcrumbs={[
            { label: t('breadcrumbs.assets'), href: `/${locale}/assets` },
            { label: assetName },
          ]}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button
          className="hover:bg-red-600/80 hover:text-white gap-2"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="h-4 w-4" />
          {t('actions.cancel')}
        </Button>
        <Button onClick={onSave} className="gap-2" disabled={isSaving}>
          <Save className="h-4 w-4" />
          {isSaving ? t('actions.saving') : t('actions.saveChanges')}
        </Button>
      </div>
    </div>
  );
}
