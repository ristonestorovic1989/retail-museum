import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { DevicePlaylistsResponse, UpdateDevicePlaylistsPayload } from '@/features/devices/types';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type RouteParams = {
  id: string;
};

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const playlists = await apiFetch<DevicePlaylistsResponse>(`/api/devices/${id}/playlists`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(playlists);
}

export async function POST(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const payload = (await req.json()) as UpdateDevicePlaylistsPayload;

  await apiFetch<void>(`/api/devices/${id}/playlists`, {
    accessToken: session.accessToken,
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return new NextResponse(null, { status: 204 });
}
