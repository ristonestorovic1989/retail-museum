'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { ASSET_TYPE_ORDER, AssetType } from '../types';
import { useTranslations } from 'next-intl';

type AssetsDistributionPoint = {
  assetType: AssetType;
  label: string;
  count: number;
};

type AssetsDistributionInput = Partial<Record<AssetType, number>>;

interface AssetsDistributionCardProps {
  data?: AssetsDistributionInput;
  title?: string;
  description?: string;
}

const buildChartData = (
  input: AssetsDistributionInput | undefined,
  getLabel: (type: AssetType) => string,
): AssetsDistributionPoint[] => {
  const fallback: AssetsDistributionInput = {
    [AssetType.Video]: 145,
    [AssetType.Image]: 198,
    [AssetType.Document]: 52,
    [AssetType.Audio]: 23,
  };

  const source = input ?? fallback;

  return ASSET_TYPE_ORDER.map((type) => ({
    assetType: type,
    label: getLabel(type),
    count: source[type] ?? 0,
  }));
};

const segmentColor = (type: AssetType): string => {
  switch (type) {
    case AssetType.Video:
      return 'bg-cyan-500';
    case AssetType.Image:
      return 'bg-emerald-500';
    case AssetType.Document:
      return 'bg-amber-500';
    case AssetType.Audio:
      return 'bg-violet-500';
    default:
      return 'bg-primary';
  }
};

export function AssetsDistributionCard({ data, title, description }: AssetsDistributionCardProps) {
  const t = useTranslations('dashboard.assetsDistribution');

  const resolvedTitle = title ?? t('title');
  const resolvedDescription = description ?? t('description');

  const chartConfig: ChartConfig = {
    count: {
      label: t('series.count'),
      color: 'var(--accent)',
    },
  };

  const chartData = buildChartData(data, (type) => t(`assetTypes.${type}`));
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resolvedTitle}</CardTitle>
        <CardDescription>{resolvedDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 14,
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{
                fill: 'var(--muted-foreground)',
                fontSize: 12,
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartContainer>

        <div className="mt-6 space-y-4">
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted flex">
            {chartData.map((item) => {
              const percent = total > 0 ? (item.count / total) * 100 : 0;
              if (!percent) return null;

              return (
                <div
                  key={item.assetType}
                  className={`${segmentColor(item.assetType)} h-full`}
                  style={{ width: `${percent}%` }}
                  title={`${item.label}: ${item.count} (${Math.round(percent)}%)`}
                />
              );
            })}
          </div>

          <div className="grid gap-3 text-xs text-muted-foreground md:grid-cols-2 xl:grid-cols-4">
            {chartData.map((item) => {
              const percent = total > 0 ? Math.round((item.count / total) * 100) : 0;

              return (
                <div key={item.assetType} className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${segmentColor(item.assetType)}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground">{item.label}</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="text-[11px]">
                      {total > 0
                        ? t('legend.assetsLabel', {
                            count: item.count,
                            total,
                          })
                        : t('legend.assetsShort', {
                            count: item.count,
                          })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
