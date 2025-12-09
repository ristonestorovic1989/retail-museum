import { clientFetch } from '@/lib/http/client';
import { DashboardSummaryResponse } from './types';
import { useQuery } from '@tanstack/react-query';
import { DashboardSummaryDto } from './types';

const dashboardKeys = {
  all: ['dashboard'] as const,
  summary: () => [...dashboardKeys.all, 'summary'] as const,
};

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  return clientFetch<DashboardSummaryResponse>('/api/dashboard');
}

export function useDashboardSummaryQuery() {
  return useQuery<DashboardSummaryDto>({
    queryKey: dashboardKeys.summary(),
    queryFn: async () => {
      const res = await getDashboardSummary();
      return res.data;
    },
    staleTime: 60_000,
  });
}
