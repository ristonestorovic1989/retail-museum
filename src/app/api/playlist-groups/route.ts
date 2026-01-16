import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { apiFetch } from '@/lib/http/server';

import type {
  CreatePlaylistGroupBody,
  GetPlaylistGroupsResponse,
  MutateResponse,
} from '@/features/playlist-groups/types';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const url = new URL(req.url);

  const qs = new URLSearchParams();
  const map = [
    ['SearchTerm', url.searchParams.get('SearchTerm')],
    ['SortBy', url.searchParams.get('SortBy')],
    ['SortDir', url.searchParams.get('SortDir')],
    ['Page', url.searchParams.get('Page')],
    ['PageSize', url.searchParams.get('PageSize')],
  ] as const;

  for (const [k, v] of map) if (v != null && v !== '') qs.set(k, v);

  const res = await apiFetch<GetPlaylistGroupsResponse>(
    `/api/playlist-groups${qs.toString() ? `?${qs.toString()}` : ''}`,
    { accessToken: session.accessToken },
  );

  return NextResponse.json(res);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) return new NextResponse('Unauthorized', { status: 401 });

  const body = (await req.json()) as CreatePlaylistGroupBody;

  const res = await apiFetch<MutateResponse>(`/api/playlist-groups`, {
    accessToken: session.accessToken,
    method: 'POST',
    body,
  });

  return NextResponse.json(res);
}
