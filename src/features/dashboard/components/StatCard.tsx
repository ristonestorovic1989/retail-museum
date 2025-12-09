'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StatCard({
  title,
  value,
  hint,
  right,
  progressPercent,
}: {
  title: React.ReactNode;
  value: string | number;
  hint?: React.ReactNode;
  right?: React.ReactNode;
  progressPercent?: number;
}) {
  const clamped =
    typeof progressPercent === 'number' ? Math.min(Math.max(progressPercent, 0), 100) : undefined;

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base text-muted-foreground">{title}</CardTitle>
        {right}
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}

        {typeof clamped === 'number' && (
          <Progress value={clamped} className="h-2 [&>div]:bg-accent" />
        )}
      </CardContent>
    </Card>
  );
}
