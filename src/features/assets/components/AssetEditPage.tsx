'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { useAssetDetailsQuery, useUpdateAssetMutation } from '../api.client';
import type { AssetDetails, AssetEditViewModel, UpdateAssetRequest, AssetType } from '../types';
import { AssetTypeId } from '../types';
import { AssetEditForm } from './AssetEditForm';
import { getAssetUrl } from '@/lib/assets';

type Props = {
  assetId: number;
};

function mapDetailsToViewModel(asset: AssetDetails): AssetEditViewModel {
  const status = asset.archived ? 'Archived' : asset.active ? 'Active' : 'Inactive';

  let type: AssetType = 'image';
  switch (asset.assetTypeId) {
    case AssetTypeId.Image:
      type = 'image';
      break;
    case AssetTypeId.Video:
      type = 'video';
      break;
    case AssetTypeId.Audio:
      type = 'audio';
      break;
    case AssetTypeId.Document:
      type = 'document';
      break;
    default:
      type = 'image';
  }

  const previewUrl = getAssetUrl(asset.thumbnailPath || asset.path);

  return {
    id: asset.id,
    name: asset.name,
    format: asset.format,
    size: asset.size,
    dateOfUploadingFormatted: asset.dateOfUploadingFormatted,
    tags: asset.tags ?? [],
    status,
    type,
    previewUrl,
  };
}

export default function AssetEditPage({ assetId }: Props) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('assets.edit');

  const { data, isLoading, isError, error } = useAssetDetailsQuery(assetId);
  const updateMutation = useUpdateAssetMutation();

  if (isLoading) {
    return <CenteredSpinner label="Loading asset..." />;
  }

  if (isError || !data) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        Failed to load asset. {error instanceof Error ? error.message : null}
      </div>
    );
  }

  const viewModel = mapDetailsToViewModel(data);

  const handleSave = async ({
    asset,
    mainDescription,
    translations,
  }: {
    asset: AssetEditViewModel;
    mainDescription: string;
    translations: Record<string, string>;
  }) => {
    try {
      const active = asset.status === 'Active';
      const archived = asset.status === 'Archived';

      const body: UpdateAssetRequest = {
        name: asset.name.trim(),
        description: (mainDescription ?? '').trim(),
        isDescriptionVisible: true,
        archived,
        active,
        tagsCsv: asset.tags.length ? asset.tags.join(',') : '',
        descriptionTranslations: translations,
      };

      await updateMutation.mutateAsync({ id: asset.id, body });

      toast.success(t('toasts.updateSuccessTitle'), {
        description: t('toasts.updateSuccessDescription'),
      });

      router.push(`/${locale}/assets`);
    } catch (err: any) {
      console.error('Update asset failed', err);

      toast.error(t('toasts.updateErrorTitle'), {
        description:
          t('toasts.updateErrorDescription') ??
          err?.message ??
          'Something went wrong while saving your changes.',
      });
    }
  };

  const handleCancel = () => {
    router.push(`/${locale}/assets`);
  };

  return (
    <AssetEditForm
      asset={viewModel}
      onSave={handleSave}
      onCancel={handleCancel}
      initialMainDescription={data.description ?? ''}
      initialTranslations={data.descriptionTranslations ?? {}}
    />
  );
}
