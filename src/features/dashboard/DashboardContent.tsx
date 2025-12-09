'use client';

import {
  UserRound,
  MonitorSmartphone,
  FileStack,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  HardDrive,
  LayoutDashboard,
} from 'lucide-react';

import DevicesTable from '@/features/dashboard/components/DevicesTable';
import StatCard from '@/features/dashboard/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { useTranslations } from 'next-intl';
import { AssetsDistributionCard } from './components/AssetDistributionCard';
import { AssetType } from './types';
import { StatusOverviewCard } from './components/StatusOverviewCard';
import { useDashboardSummaryQuery } from './api.client';
import { PageHeader } from '@/components/layout/PageHeader';

function formatMegabytes(mb: number): string {
  if (!mb) return '0 MB';

  if (mb >= 1024) {
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }
  screen;
  return `${mb.toFixed(0)} MB`;
}

export default function DashboardContent() {
  const t = useTranslations();
  const { data, isLoading, isError } = useDashboardSummaryQuery();

  const hasData = !!data;

  const storageTotalMb = hasData ? data.companyStorage : 0;
  const storageUsedMb = hasData ? data.occupiedMemory : 0;

  const storageUsedPercentage = storageTotalMb > 0 ? (storageUsedMb / storageTotalMb) * 100 : 0;

  const assetsDistribution = hasData
    ? {
        [AssetType.Video]: data.videoAssets,
        [AssetType.Image]: data.jpgAssets + data.pngAssets + data.gifAssets,
        [AssetType.Document]: 0,
        [AssetType.Audio]: 0,
      }
    : undefined;

  if (isError) {
    return (
      <div className="text-sm text-red-600">
        {t('common.error.generic', { defaultValue: 'Failed to load dashboard.' })}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        icon={<LayoutDashboard className="h-6 w-6" />}
        title={t('title')}
        subtitle={t('subtitle')}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.statCard.activeUsers')}
          value={1}
          hint={
            <span className="inline-flex items-center gap-2">
              <span className="text-xs rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                {t('dashboard.badges.active')}
              </span>
            </span>
          }
          right={<UserRound className="size-4 text-primary" />}
        />

        <StatCard
          title={t('dashboard.statCard.totalDevices')}
          value={hasData ? data.devicesSum : '—'}
          hint={t('dashboard.hints.devicesUpdated', {
            percent: hasData ? data.numberOfUpdatedDevicesPercentage : 0,
          })}
          right={<MonitorSmartphone className="size-4 text-primary" />}
          progressPercent={hasData ? data.numberOfUpdatedDevicesPercentage : 0}
        />

        <StatCard
          title={t('dashboard.statCard.totalAssets')}
          value={hasData ? data.assetSum : '—'}
          hint={
            hasData
              ? t('dashboard.hints.assetsPublished', {
                  published: data.publishedAssets,
                  archived: data.archivedAssets,
                })
              : ''
          }
          right={<FileStack className="size-4 text-primary" />}
        />

        <StatCard
          title={t('dashboard.statCard.storageUsed')}
          value={hasData ? formatMegabytes(storageUsedMb) : '—'}
          hint={
            hasData
              ? t('dashboard.hints.storageUsage', {
                  percent: storageUsedPercentage.toFixed(1),
                  total: formatMegabytes(storageTotalMb),
                })
              : ''
          }
          right={<HardDrive className="size-4 text-primary" />}
          progressPercent={storageUsedPercentage}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatusOverviewCard
          title={t('dashboard.statusCards.connection.title')}
          description={t('dashboard.statusCards.connection.description')}
          metrics={[
            {
              icon: <Wifi className="w-4 h-4 text-success" />,
              label: t('dashboard.badges.online'),
              value: hasData ? data.numberOfOnlineDevices : null,
              percent: hasData ? data.numberOnlineDevicesPercentage : 0,
              badgeClassName: 'bg-success/10 text-success',
            },
            {
              icon: <WifiOff className="w-4 h-4 text-muted-foreground" />,
              label: t('dashboard.badges.offline'),
              value: hasData ? data.numberOfOfflineDevices : null,
              percent: hasData ? data.numberOfflineDevicesPercentage : 0,
              badgeClassName: 'bg-muted',
            },
          ]}
        />

        <StatusOverviewCard
          title={t('dashboard.statusCards.update.title')}
          description={t('dashboard.statusCards.update.description')}
          metrics={[
            {
              icon: <CheckCircle className="w-4 h-4 text-success" />,
              label: t('dashboard.badges.updated'),
              value: hasData ? data.numberOfUpdatedDevices : null,
              percent: hasData ? data.numberOfUpdatedDevicesPercentage : 0,
              badgeClassName: 'bg-success/10 text-success',
            },
            {
              icon: <XCircle className="w-4 h-4 text-amber-700" />,
              label: t('dashboard.badges.notUpdated'),
              value: hasData ? data.numberOfNotUpdatedDevices : null,
              percent: hasData ? data.numberOfNotUpdatedDevicesPercentage : 0,
              badgeClassName: 'bg-amber-100 text-amber-700',
            },
          ]}
        />
      </div>
      <section>
        <AssetsDistributionCard data={assetsDistribution} />
      </section>

      {/* TO DO: Finish tabs content */}
      <Card className="shadow-none border-none p-0">
        <Tabs defaultValue="devices" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="devices">{t('dashboard.tabs.activeDevices')}</TabsTrigger>
            <TabsTrigger value="playlists">{t('dashboard.tabs.recentPlaylists')}</TabsTrigger>
            <TabsTrigger value="assets">{t('dashboard.tabs.latestAssets')}</TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            <DevicesTable devices={data?.devices ?? []} loading={isLoading} />
          </TabsContent>

          <TabsContent value="playlists" className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>{t('dashboard.playlists.cardTitle')}</CardTitle>
                <CardDescription>{t('dashboard.playlists.cardDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Muzej Batinske bitke', duration: '00:05:30', assets: 24 },
                    { name: 'Aranina', duration: '00:00:10', assets: 1 },
                    { name: 'Лопор Шарпар', duration: '00:03:00', assets: 22 },
                  ].map((playlist, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary">PL</span>
                        </div>
                        <div>
                          <p className="font-medium">{playlist.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t('dashboard.playlists.assetsCount', {
                              count: playlist.assets,
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{playlist.duration}</span>
                        <Button variant="outline" size="sm">
                          {t('dashboard.playlists.edit')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            <div className="rounded-lg border p-8 text-sm text-muted-foreground">
              {t('dashboard.placeholders.latestAssets')}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
