'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, ListMusic } from 'lucide-react';

import type { DeviceDetails } from '../types';
import { FormSelect } from '@/components/shared/form-select';
import { FormInput } from '@/components/shared/form-input';
import { FormTextarea } from '@/components/shared/form-textarea';
import { FormCheckbox } from '@/components/shared/form-checkbox';
import { DataTable, ColumnDef } from '@/components/shared/data-table';
import { PlaylistSummary } from '@/features/playlists/types';

type Props = {
  value: DeviceDetails;
  onChange: (next: DeviceDetails) => void;
  playlists: PlaylistSummary[];

  isEditing: boolean;
  isSaving?: boolean;
};

export function DeviceDetailsForm({ value, onChange, playlists, isEditing, isSaving }: Props) {
  const t = useTranslations('devices.details');

  const disabled = !isEditing || !!isSaving;

  const handleFieldChange = (field: keyof DeviceDetails) => (next: string) => {
    onChange({ ...value, [field]: next });
  };

  const handleTypeChange = (type: string) => {
    onChange({ ...value, type });
  };

  const handleActiveChange = (checked: boolean) => {
    onChange({ ...value, active: checked });
  };

  type PlaylistRow = PlaylistSummary;

  const columns: ColumnDef<PlaylistRow>[] = [
    {
      id: 'name',
      header: t('playlists.columns.name'),
      cell: (row) => row.name,
    },
    {
      id: 'duration',
      header: t('playlists.columns.duration'),
      cell: (row) => row.duration,
    },
    {
      id: 'creationDate',
      header: t('playlists.columns.creationDate'),
      cell: (row) => row.dateOfCreation ?? '–',
    },
    {
      id: 'numAssets',
      header: t('playlists.columns.numAssets'),
      cell: (row) => row.numAssets,
    },
  ];

  const page = 1;
  const pageSize = playlists.length || 10;
  const totalCount = playlists.length;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardContent className="pt-2">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-border/60 bg-background px-4 py-4 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-cyan-600" />
                <h3 className="text-sm font-semibold">
                  {t('sections.basicInfo', { defaultMessage: 'Basic information' })}
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    id="name"
                    label={t('fields.name.label')}
                    value={value.name}
                    onChange={handleFieldChange('name')}
                    disabled={disabled}
                  />

                  <FormSelect
                    id="type"
                    label={t('fields.type.label')}
                    value={value.type}
                    onChange={handleTypeChange}
                    options={value.availableTypes.map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    disabled={disabled}
                  />
                </div>

                <FormTextarea
                  id="description"
                  label={t('fields.description.label')}
                  value={value.description ?? ''}
                  onChange={handleFieldChange('description')}
                  disabled={disabled}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormInput
                    id="os"
                    label={t('fields.os.label')}
                    value={value.operatingSystem}
                    onChange={handleFieldChange('operatingSystem')}
                    disabled={disabled}
                  />

                  <FormCheckbox
                    id="status"
                    label={t('fields.status.label')}
                    checked={value.active}
                    onChange={handleActiveChange}
                    disabled={disabled}
                    valueLabel={
                      value.active
                        ? t('active', { defaultValue: 'Active' })
                        : t('inactive', { defaultValue: 'Inactive' })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="h-full">
            <div className="flex h-full flex-col rounded-xl border border-border/60 bg-background px-4 py-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ListMusic className="h-4 w-4 text-cyan-600" />
                  <h3 className="text-sm font-semibold">
                    {t('sections.playlistsTable', { defaultMessage: 'Playlists table' })}
                  </h3>
                </div>

                {playlists.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {t('playlists.count', {
                      count: playlists.length,
                      defaultMessage: '{count} playlists',
                    })}
                  </span>
                )}
              </div>

              <div className="flex-1 rounded-lg border border-border/50 bg-muted/30 p-2">
                {playlists.length === 0 ? (
                  <div className="flex h-full items-center justify-center px-3 text-xs text-muted-foreground text-center">
                    {t('playlists.empty')}
                  </div>
                ) : (
                  <DataTable<PlaylistRow>
                    columns={columns}
                    data={playlists}
                    page={page}
                    pageSize={pageSize}
                    totalCount={totalCount}
                    onPageChange={() => {}}
                    isLoading={false}
                    emptyMessage={t('playlists.empty')}
                    enableSelection={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
