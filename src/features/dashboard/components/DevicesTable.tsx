'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { DashboardDeviceDto } from '../types';
import { Button } from '@/components/ui/button';

interface DevicesTableProps {
  devices: DashboardDeviceDto[];
  loading?: boolean;
}

const DevicesTable = ({ devices, loading }: DevicesTableProps) => {
  const t = useTranslations('dashboard.devicesTable');
  const locale = useLocale();
  const router = useRouter();

  const hasDevices = devices && devices.length > 0;

  const goToDetails = (id: number | string) => {
    router.push(`/${locale}/devices/${id}`);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl">{t('title')}</CardTitle>
        <div className="text-sm text-muted-foreground -mt-1">{t('subtitle')}</div>
      </CardHeader>
      <CardContent>
        <div className="mt-4 rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">{t('columns.name')}</TableHead>
                <TableHead>{t('columns.type')}</TableHead>
                <TableHead>{t('columns.status')}</TableHead>
                <TableHead>{t('columns.os')}</TableHead>
                <TableHead>{t('columns.registered')}</TableHead>
                <TableHead className="text-right">{t('columns.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && !hasDevices && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                    {t('loading')}
                  </TableCell>
                </TableRow>
              )}

              {!loading && !hasDevices && (
                <TableRow>
                  <TableCell colSpan={6} className="py-6 text-center text-sm text-muted-foreground">
                    {t('empty')}
                  </TableCell>
                </TableRow>
              )}

              {devices.map((d) => (
                <TableRow key={d.id} className="cursor-pointer" onClick={() => goToDetails(d.id)}>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">{d.deviceTypeName}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        d.active
                          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-100'
                      }
                    >
                      {d.active ? t('status.true') : t('status.false')}
                    </Badge>
                  </TableCell>
                  <TableCell>{d.os}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {d.registrationDateFormatted}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      className="text-cyan-700 hover:bg-cyan-100"
                      onClick={() => goToDetails(d.id)}
                    >
                      {t('actions.view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DevicesTable;
