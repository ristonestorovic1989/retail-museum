'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';

import type { DeviceDetails, PlaylistSummary } from '../types';
import { FormSelect } from '@/components/shared/form-select';
import { FormInput } from '@/components/shared/form-input';
import { FormTextarea } from '@/components/shared/form-textarea';
import { FormCheckbox } from '@/components/shared/form-checkbox';
import { DataTable, ColumnDef } from '@/components/shared/data-table';

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
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
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

              <div className="md:col-span-2">
                <FormTextarea
                  id="description"
                  label={t('fields.description.label')}
                  value={value.description ?? ''}
                  onChange={handleFieldChange('description')}
                  disabled={disabled}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:col-span-2">
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
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{t('playlists.tableLabel')}</p>

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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
