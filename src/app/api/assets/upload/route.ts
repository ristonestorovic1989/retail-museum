import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const runtime = 'nodejs';

const tusBaseEnv = process.env.NEXT_PUBLIC_TUS_UPLOAD_URL ?? process.env.TUS_UPLOAD_URL;

if (!tusBaseEnv) {
  throw new Error('Missing NEXT_PUBLIC_TUS_UPLOAD_URL or TUS_UPLOAD_URL env variable');
}

const tusBase = tusBaseEnv.replace(/\/$/, '');
const tusBaseUrl = new URL(tusBase);
const upstreamOrigin = tusBaseUrl.origin;

type NodeRequestInit = RequestInit & {
  duplex?: 'half' | 'full';
};

function buildUpstreamHeaders(req: NextRequest, accessToken: string) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Tus-Resumable': req.headers.get('tus-resumable') ?? '1.0.0',
  };

  const passthrough = [
    'upload-metadata',
    'upload-length',
    'upload-defer-length',
    'upload-offset',
    'content-type',
  ];

  for (const h of passthrough) {
    const v = req.headers.get(h);
    if (v) headers[h] = v;
  }

  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const upstreamHeaders = buildUpstreamHeaders(req, session.accessToken as string);

  const init: NodeRequestInit = {
    method: 'POST',
    headers: upstreamHeaders,
    body: req.body,
    duplex: 'half',
  };

  const upstreamRes = await fetch(tusBase, init);

  const resHeaders = new Headers();
  const tusHeader = upstreamRes.headers.get('Tus-Resumable');
  if (tusHeader) resHeaders.set('Tus-Resumable', tusHeader);

  let upstreamLocation = upstreamRes.headers.get('Location') ?? '';

  if (!upstreamRes.ok) {
    const txt = await upstreamRes.text().catch(() => '');
    console.error('[TUS PROXY] Upstream POST error:', txt.slice(0, 300));
    return new NextResponse(txt || 'Upload init failed', {
      status: upstreamRes.status,
      headers: resHeaders,
    });
  }

  let locationPath = upstreamLocation;

  if (upstreamLocation.startsWith('http://') || upstreamLocation.startsWith('https://')) {
    try {
      const urlObj = new URL(upstreamLocation);
      locationPath = urlObj.pathname;
    } catch {
      // ignore
    }
  }

  if (!locationPath.startsWith('/')) {
    locationPath = `/${locationPath}`;
  }

  const encodedPath = encodeURIComponent(locationPath);
  const proxyLocation = `/api/assets/upload/${encodedPath}`;

  resHeaders.set('Location', proxyLocation);

  return new NextResponse(null, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}
