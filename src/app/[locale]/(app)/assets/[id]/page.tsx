import AssetEditPage from '@/features/assets/components/AssetEditPage';
import { notFound } from 'next/navigation';

type Params = {
  locale: string;
  id: string;
};

export default async function AssetEditRoute({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  const numericId = Number(id);
  if (!Number.isFinite(numericId)) {
    notFound();
  }

  return <AssetEditPage assetId={numericId} />;
}
