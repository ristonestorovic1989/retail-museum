import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

import type {
  PlaylistDetailsApiResponse,
  DeletePlaylistApiResponse,
} from '@/features/playlists/types';

type RouteParams = {
  id: string;
};

export async function GET(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const res = await apiFetch<PlaylistDetailsApiResponse>(`/api/playlists/${id}`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(res);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { succeeded: false, message: 'Invalid JSON body', data: null },
      { status: 400 },
    );
  }

  const res = await apiFetch<any>(`/api/playlists/${id}`, {
    accessToken: session.accessToken,
    method: 'PUT',
    body: body,
  });

  return NextResponse.json(res);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await apiFetch<void | string>(`/api/playlists/${id}`, {
    accessToken: session.accessToken,
    method: 'DELETE',
  });

  return NextResponse.json(
    { succeeded: true, message: null, data: 'OK' } satisfies DeletePlaylistApiResponse,
    { status: 200 },
  );
}
