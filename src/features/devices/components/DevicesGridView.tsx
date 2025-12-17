'use client';

import Image from 'next/image';
import { Clock, TabletSmartphone, Settings, Trash2 } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TablePagination } from '@/components/shared/table-pagination';

import type { DeviceListItem } from '../types';

type TFn = (key: string, values?: Record<string, any>) => string;

type Props = {
  items: DeviceListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  isBusy: boolean;
  t: TFn;
  onPageChange: (page: number) => void;
  onCardClick: (device: DeviceListItem) => void;
  onEdit: (device: DeviceListItem) => void;
  onDelete: (device: DeviceListItem) => void;
};

function getDevicePreviewImage(type: string): string {
  const normalized = (type || '').toLowerCase();
  if (normalized.includes('tablet')) return '/images/devices/tablet-blank.png';
  return '/images/devices/device-generic.png';
}

export function DevicesGridView({
  items,
  page,
  pageSize,
  totalCount,
  isBusy,
  t,
  onPageChange,
  onCardClick,
  onEdit,
  onDelete,
}: Props) {
  if (isBusy && items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">{t('table.loading')}</div>
    );
  }

  if (!isBusy && items.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">{t('table.empty')}</div>
    );
  }

  return (
    <>
      <div
        className="
          grid gap-6
          grid-cols-[repeat(auto-fit,minmax(260px,1fr))]
          items-stretch
        "
      >
        {items.map((device) => {
          const previewSrc = getDevicePreviewImage(device.type);

          const isActive = device.status === 'active';
          const statusLabel = isActive ? t('status.active') : t('status.inactive');
          const statusDotClasses = isActive ? 'bg-emerald-500' : 'bg-muted-foreground';

          return (
            <Card
              key={device.id}
              className="
                group cursor-pointer
                border border-border/60 shadow-sm
                transition-all duration-200 hover:border-accent hover:-translate-y-1
                p-0 rounded-2xl overflow-hidden
                w-full
              "
              onClick={() => onCardClick(device)}
            >
              <div className="relative w-full aspect-3/4 overflow-hidden">
                <Image
                  src={previewSrc}
                  alt={device.name}
                  fill
                  className="
                    object-cover
                    scale-[1.10] -translate-y-[2%]
                  "
                />

                <div className="absolute inset-[12%] rounded-xl bg-background/92 backdrop-blur-md shadow-md flex flex-col px-3 py-3 gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <TabletSmartphone className="h-3.5 w-3.5 text-primary shrink-0" />
                        <p className="text-xs font-semibold leading-tight line-clamp-1">
                          {device.name}
                        </p>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {device.type} • {device.os}
                      </p>
                    </div>

                    <Badge className="h-5 rounded-full px-2 text-[10px] flex items-center gap-1 shrink-0">
                      <span className={`h-2 w-2 rounded-full ${statusDotClasses}`} />
                      <span>{statusLabel}</span>
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between rounded-md border bg-background px-2.5 py-1.5 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {t('table.columns.date')}
                    </span>
                    <span className="font-medium text-foreground">
                      {device.registrationDateFormatted}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(device);
                      }}
                    >
                      <Settings className="mr-1.5 h-3.5 w-3.5" />
                      {t('table.columns.actions')}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-destructive px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(device);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-auto pt-4">
        <TablePagination
          page={page}
          pageSize={pageSize}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
}
