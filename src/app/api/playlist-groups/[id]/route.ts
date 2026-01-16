import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiFetch } from '@/lib/http/server';

import type {
  GetPlaylistGroupDetailsResponse,
  MutateResponse,
  UpdatePlaylistGroupBody,
} from '@/features/playlist-groups/types';

type Params = { id: string };

export async function GET(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const res = await apiFetch<GetPlaylistGroupDetailsResponse>(`/api/playlist-groups/${id}`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(res);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as UpdatePlaylistGroupBody;

  const res = await apiFetch<MutateResponse>(`/api/playlist-groups/${id}`, {
    accessToken: session.accessToken,
    method: 'PUT',
    body,
  });

  return NextResponse.json(res);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const res = await apiFetch<MutateResponse>(`/api/playlist-groups/${id}`, {
    accessToken: session.accessToken,
    method: 'DELETE',
  });

  return NextResponse.json(res);
}
