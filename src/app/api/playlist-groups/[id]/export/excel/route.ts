import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { API_URL } from '@/lib/http/server';

type Params = { id: string };

export async function GET(req: NextRequest, { params }: { params: Promise<Params> }) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const rawGroupName = searchParams.get('groupName') ?? `Group ${id}`;

  const safeGroupName = rawGroupName
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);

  const res = await fetch(`${API_URL}/api/playlist-groups/${id}/export/excel`, {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      Accept: '*/*',
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => 'Export failed');
    return new NextResponse(text, { status: res.status });
  }

  const buffer = await res.arrayBuffer();

  const filename = `Playlist Grupa - ${safeGroupName}.xlsx`;
  const filenameStar = encodeURIComponent(filename);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        res.headers.get('content-type') ??
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="playlist-group-${id}.xlsx"; filename*=UTF-8''${filenameStar}`,
      'Cache-Control': 'no-store',
    },
  });
}
