import DeviceDetailsPage from '@/features/devices/components/DeviceDetailsPage';

type RouteParams = {
  locale: string;
  deviceId: string;
};

export default async function DeviceDetailsRoute({ params }: { params: Promise<RouteParams> }) {
  const { deviceId } = await params;

  return <DeviceDetailsPage deviceId={deviceId} />;
}
