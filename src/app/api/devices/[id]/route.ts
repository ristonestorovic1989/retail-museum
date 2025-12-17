import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { DeviceDetails, UpdateDevicePayload } from '@/features/devices/types';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type RouteParams = {
  id: string;
};

export async function GET(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const device = await apiFetch<DeviceDetails>(`/api/devices/${id}`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(device);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const payload = (await req.json()) as UpdateDevicePayload;

  const updated = await apiFetch<DeviceDetails>(`/api/devices/${id}`, {
    accessToken: session.accessToken,
    method: 'PATCH',
    body: payload,
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await apiFetch<void>(`/api/devices/${id}`, {
    accessToken: session.accessToken,
    method: 'DELETE',
  });

  return new NextResponse(null, { status: 204 });
}
