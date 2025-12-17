'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Monitor, Smartphone, Tv, Settings, ListMusic, Save, X } from 'lucide-react';

import type { DeviceDetails } from '../types';
import { useDeviceQuery, useUpdateDeviceMutation } from '../api.client';
import { DeviceDetailsForm } from './DeviceDetailsForm';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { PageHeader } from '@/components/layout/PageHeader';
import { DevicePlaylistGroupsTab } from './DevicePlaylistGroupsTab';
import { usePlaylistsQuery } from '@/features/playlists/api.client';

type Props = {
  deviceId: string;
};

function getDeviceIcon(deviceTypeName: string | null | undefined) {
  const normalized = (deviceTypeName || '').toLowerCase();

  if (normalized.includes('tablet') || normalized.includes('phone')) {
    return <Smartphone className="h-5 w-5" />;
  }

  if (normalized.includes('tv') || normalized.includes('display')) {
    return <Tv className="h-5 w-5" />;
  }

  return <Monitor className="h-5 w-5" />;
}

export default function DeviceDetailsPage({ deviceId }: Props) {
  const id = Number(deviceId);
  const t = useTranslations('devices');
  const router = useRouter();
  const locale = useLocale();

  const { data: device, isLoading: isDeviceLoading } = useDeviceQuery(id);
  const updateDeviceMutation = useUpdateDeviceMutation(id);

  const { data: playlistsResponse, isLoading: isPlaylistsLoading } = usePlaylistsQuery({
    page: 1,
    pageSize: 1000,
  });

  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [selectedPlaylistGroupId, setSelectedPlaylistGroupId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (device) {
      setDetails(device);

      const initiallySelectedGroup = device.playlistGroups.find((g) => g.selected);
      setSelectedPlaylistGroupId(initiallySelectedGroup ? initiallySelectedGroup.id : null);
    }
  }, [device]);

  const handleBackToList = () => {
    router.push(`/${locale}/devices`);
  };

  const handleCancel = () => {
    if (isEditing && device) {
      setDetails(device);

      const initiallySelectedGroup = device.playlistGroups.find((g) => g.selected);
      setSelectedPlaylistGroupId(initiallySelectedGroup ? initiallySelectedGroup.id : null);

      setIsEditing(false);
      return;
    }

    handleBackToList();
  };

  const handleSave = async () => {
    if (!details) return;

    try {
      await updateDeviceMutation.mutateAsync({
        name: details.name,
        description: details.description,
        deviceTypeName: details.type,
        active: details.active,
        playlistGroupId: selectedPlaylistGroupId ?? 0,
      });

      setIsEditing(false);
      toast.success(t('details.messages.updateSuccessDescription'));
    } catch (error) {
      console.error('Update device error', error);

      toast.error(
        error instanceof Error ? error.message : t('details.messages.updateErrorDescription'),
      );
    }
  };

  const handleSelectPlaylistGroup = (groupId: number) => {
    if (!details) return;
    setSelectedPlaylistGroupId(groupId);
  };

  const isSaving = updateDeviceMutation.isPending;

  if (isDeviceLoading || !details) {
    return <CenteredSpinner label={t('details.loading')} />;
  }

  const allPlaylists = playlistsResponse?.items ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('details.title')}
        icon={getDeviceIcon(details.type)}
        breadcrumbs={[
          { label: t('breadcrumbs.devices'), href: `/${locale}/devices` },
          { label: details.name },
        ]}
      />

      <Tabs defaultValue="details" className="w-full space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-lg w-fit">
          <TabsTrigger
            value="details"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm hover:bg-accent/80"
          >
            <Settings className="h-4 w-4" />
            {t('details.tabs.details')}
          </TabsTrigger>
          <TabsTrigger
            value="playlistGroups"
            className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm hover:bg-accent/80"
          >
            <ListMusic className="h-4 w-4" />
            {t('details.tabs.playlistGroups')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <DeviceDetailsForm
            value={details}
            onChange={setDetails}
            playlists={details.playlists}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="playlistGroups" className="space-y-4">
          <DevicePlaylistGroupsTab
            groups={details.playlistGroups}
            playlists={allPlaylists}
            playlistAssetsById={details.playlistAssetsById ?? {}}
            selectedGroupId={selectedPlaylistGroupId}
            onSelect={handleSelectPlaylistGroup}
            isEditing={isEditing}
          />
          {isPlaylistsLoading && (
            <p className="text-xs text-muted-foreground">{t('details.loading')}</p>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSaving}
          className="gap-2 hover:bg-red-600/80 hover:text-white"
        >
          <X className="h-4 w-4" />
          {t('details.actions.cancel')}
        </Button>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="gap-2 bg-cyan-500 hover:bg-cyan-600"
          isLoading={isSaving}
        >
          {isSaving ? (
            t('details.actions.saving')
          ) : isEditing ? (
            <>
              <Save className="h-4 w-4" />
              {t('details.actions.save')}
            </>
          ) : (
            <>
              <Settings className="h-4 w-4" />
              {t('details.actions.edit')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
