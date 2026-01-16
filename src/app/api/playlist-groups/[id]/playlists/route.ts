import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiFetch } from '@/lib/http/server';

import type { AddPlaylistsToGroupBody, MutateResponse } from '@/features/playlist-groups/types';

type Params = { id: string };

export async function POST(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as AddPlaylistsToGroupBody;

  const res = await apiFetch<MutateResponse>(`/api/playlist-groups/${id}/playlists`, {
    accessToken: session.accessToken,
    method: 'POST',
    body,
  });

  return NextResponse.json(res);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as AddPlaylistsToGroupBody;

  const res = await apiFetch<MutateResponse>(`/api/playlist-groups/${id}/playlists`, {
    accessToken: session.accessToken,
    method: 'DELETE',
    body,
  });

  return NextResponse.json(res);
}
