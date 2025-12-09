import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const url = searchParams.get('url');
    const name = searchParams.get('name') || 'asset';

    if (!url) {
      return new Response('Missing url parameter', { status: 400 });
    }

    const upstreamRes = await fetch(url);

    if (!upstreamRes.ok) {
      return new Response('Failed to fetch asset from upstream', {
        status: upstreamRes.status,
      });
    }

    const contentType = upstreamRes.headers.get('content-type') || 'application/octet-stream';
    const buffer = await upstreamRes.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${encodeURIComponent(name)}"`,
        'Cache-Control': 'private, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Download proxy error', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
