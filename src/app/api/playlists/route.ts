import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { authOptions } from '../auth/[...nextauth]/route';
import type { PlaylistsApiResponse } from '@/features/playlists/types';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const qs = searchParams.toString();
  const url = qs ? `/api/playlists?${qs}` : '/api/playlists';

  try {
    const playlists = await apiFetch<PlaylistsApiResponse>(url, {
      accessToken: session.accessToken,
    });

    return NextResponse.json(playlists);
  } catch (error) {
    console.error('GET /api/playlists failed', error);

    const message = error instanceof Error ? error.message : 'Failed to load playlists';

    return NextResponse.json({ message }, { status: 500 });
  }
}
