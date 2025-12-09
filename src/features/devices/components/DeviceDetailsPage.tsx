'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import type { DeviceDetails } from '../types';
import { useDeviceQuery, useUpdateDeviceMutation } from '../api.client';
import { DeviceDetailsForm } from './DeviceDetailsForm';
import { DevicePlaylistGroupsPanel } from './DevicePlaylistGroupsPanel';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { PageHeader } from '@/components/layout/PageHeader';
import { toast } from 'sonner';

type Props = {
  deviceId: string;
};

export default function DeviceDetailsPage({ deviceId }: Props) {
  const id = Number(deviceId);
  const t = useTranslations('devices');
  const router = useRouter();

  const { data: device, isLoading: isDeviceLoading } = useDeviceQuery(id);
  const updateDeviceMutation = useUpdateDeviceMutation(id);

  const [details, setDetails] = useState<DeviceDetails | null>(null);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<number[]>([]);
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
    router.push('../devices');
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

    const group = details.playlistGroups.find((g) => g.id === groupId);
    if (group) {
      setSelectedPlaylistIds(group.playlistIds);
    }
  };

  const isSaving = updateDeviceMutation.isPending;

  if (isDeviceLoading || !details) {
    return <CenteredSpinner label={t('details.loading')} />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('details.title')}
        breadcrumbs={[
          { label: t('breadcrumbs.devices'), href: '../devices' },
          { label: details.name },
        ]}
      />

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">{t('details.tabs.details')}</TabsTrigger>
          <TabsTrigger value="playlistGroups">{t('details.tabs.playlistGroups')}</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <DeviceDetailsForm
            value={details}
            onChange={setDetails}
            playlists={details.playlists}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="playlistGroups" className="space-y-6">
          <DevicePlaylistGroupsPanel
            groups={details.playlistGroups}
            playlists={details.playlists}
            playlistAssetsById={details.playlistAssetsById ?? {}}
            selectedGroupId={selectedPlaylistGroupId}
            onSelect={handleSelectPlaylistGroup}
            isEditing={isEditing}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
          {t('details.actions.cancel')}
        </Button>

        <Button
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          className="bg-cyan-500 hover:bg-cyan-600"
          isLoading={isSaving}
        >
          {isSaving
            ? t('details.actions.saving')
            : isEditing
              ? t('details.actions.save')
              : t('details.actions.edit')}
        </Button>
      </div>
    </div>
  );
}
