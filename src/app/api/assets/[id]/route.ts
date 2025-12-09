import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import type { AssetListItemApi } from '@/features/assets/types';
import { authOptions } from '../../auth/[...nextauth]/route';

type RouteContext = {
  params: { id: string };
};

export async function GET(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await context.params;

  const data = await apiFetch<AssetListItemApi>(`/api/assets/${id}`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id } = await context.params;

  await apiFetch<void>(`/api/assets/${id}`, {
    method: 'DELETE',
    accessToken: session.accessToken,
  });

  return new NextResponse(null, { status: 200 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const numericId = Number(id);

  const body = await req.json();

  try {
    const data = await apiFetch(`/api/assets/${numericId}`, {
      method: 'PATCH',
      accessToken: session.accessToken,
      body,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Upstream PATCH /api/assets failed', error);

    return NextResponse.json(
      {
        message: 'Failed to update asset',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }
}
