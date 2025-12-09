// src/features/dashboard/components/StatusOverviewCard.tsx
'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import * as React from 'react';

export interface StatusMetric {
  icon: React.ReactNode;
  label: string;
  value: number | string | null;
  percent: number | null;
  /**
   * Tailwind klase za Badge – boja i sl.
   * npr: "bg-success/10 text-success"
   */
  badgeClassName?: string;
}

interface StatusOverviewCardProps {
  title: string;
  description?: string;
  metrics: StatusMetric[];
}

export function StatusOverviewCard({ title, description, metrics }: StatusOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((metric, index) => {
            const clampedPercent =
              typeof metric.percent === 'number' ? Math.min(Math.max(metric.percent, 0), 100) : 0;

            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {metric.icon}
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{metric.value ?? '—'}</span>
                    <Badge variant="secondary" className={metric.badgeClassName ?? 'bg-muted'}>
                      {typeof metric.percent === 'number' ? `${Math.round(metric.percent)}%` : '0%'}
                    </Badge>
                  </div>
                </div>

                <Progress value={clampedPercent} className="h-2 [&>div]:bg-accent" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
