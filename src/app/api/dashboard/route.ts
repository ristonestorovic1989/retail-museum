import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiFetch } from '@/lib/http/server';
import { DashboardSummaryResponse } from '@/features/dashboard/types';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const upstream = await apiFetch<DashboardSummaryResponse>('/api/dashboard', {
    accessToken: session.accessToken,
  });

  return NextResponse.json(upstream);
}
