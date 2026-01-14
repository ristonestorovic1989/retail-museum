import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type RouteParams = {
  id: string;
};

type UpdatePlaylistAssetsBody = {
  assetIds: number[];
  replace: boolean;
};

export async function PUT(req: NextRequest, { params }: { params: Promise<RouteParams> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let body: UpdatePlaylistAssetsBody | null = null;
  try {
    body = (await req.json()) as UpdatePlaylistAssetsBody;
  } catch {
    return NextResponse.json(
      { succeeded: false, message: 'Invalid JSON body', data: null },
      { status: 400 },
    );
  }

  if (!body || !Array.isArray(body.assetIds) || typeof body.replace !== 'boolean') {
    return NextResponse.json(
      {
        succeeded: false,
        message: 'Body must be { assetIds: number[], replace: boolean }',
        data: null,
      },
      { status: 400 },
    );
  }

  const res = await apiFetch<any>(`/api/playlists/${id}/assets`, {
    accessToken: session.accessToken,
    method: 'PUT',
    body,
  });

  return NextResponse.json(res);
}
