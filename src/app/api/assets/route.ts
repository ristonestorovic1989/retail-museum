import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import type { AssetsApiResponse } from '@/features/assets/types';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const searchTerm = searchParams.get('searchTerm') ?? '';
  const page = searchParams.get('page') ?? '1';
  const pageSize = searchParams.get('pageSize') ?? '10';

  const query = new URLSearchParams({
    ...(searchTerm ? { searchTerm } : {}),
    page,
    pageSize,
  }).toString();

  const data = await apiFetch<AssetsApiResponse>(`/api/assets?${query}`, {
    accessToken: session.accessToken,
  });

  return NextResponse.json(data);
}
