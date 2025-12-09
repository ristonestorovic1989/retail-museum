import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { apiFetch } from '@/lib/http/server';
import type { DevicesApiResponse } from '@/features/devices/types';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const url = qs ? `/api/devices?${qs}` : '/api/devices';

  const devices = await apiFetch<DevicesApiResponse>(url, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(devices);
}
