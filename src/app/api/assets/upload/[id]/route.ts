import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

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
  const headers: Record<string, string> = {};

  // 1) prenesi sve dolazne headere ka upstreamu
  req.headers.forEach((value, key) => {
    // ne želimo da pregazimo naš Authorization
    if (key.toLowerCase() === 'authorization') return;

    headers[key] = value;
  });

  // 2) naš Authorization za BE
  headers['Authorization'] = `Bearer ${accessToken}`;

  // 3) osiguraj Tus-Resumable (ako ga klijent nije poslao)
  if (!headers['Tus-Resumable'] && !headers['tus-resumable']) {
    headers['Tus-Resumable'] = '1.0.0';
  }

  return headers;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const decodedPath = decodeURIComponent(id);
  const normalizedPath = decodedPath.startsWith('/') ? decodedPath : `/${decodedPath}`;

  const upstreamUrl = `${upstreamOrigin}${normalizedPath}`;

  return NextResponse.json({
    message: 'OK from /api/assets/upload/[id]',
    encodedId: id,
    decodedPath: normalizedPath,
    upstream: upstreamUrl,
  });
}

export async function HEAD(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const decodedPath = decodeURIComponent(id);
  const normalizedPath = decodedPath.startsWith('/') ? decodedPath : `/${decodedPath}`;

  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const upstreamUrl = `${upstreamOrigin}${normalizedPath}`;

  const upstreamHeaders = buildUpstreamHeaders(req, session.accessToken as string);

  const init: NodeRequestInit = {
    method: 'HEAD',
    headers: upstreamHeaders,
    duplex: 'half',
  };

  const upstreamRes = await fetch(upstreamUrl, init);

  const resHeaders = new Headers();
  upstreamRes.headers.forEach((v, h) => resHeaders.set(h, v));

  return new NextResponse(null, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const decodedPath = decodeURIComponent(id);
  const normalizedPath = decodedPath.startsWith('/') ? decodedPath : `/${decodedPath}`;

  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const upstreamUrl = `${upstreamOrigin}${normalizedPath}`;

  const upstreamHeaders = buildUpstreamHeaders(req, session.accessToken as string);

  const init: NodeRequestInit = {
    method: 'PATCH',
    headers: upstreamHeaders,
    body: req.body,
    duplex: 'half',
  };

  const upstreamRes = await fetch(upstreamUrl, init);

  const resHeaders = new Headers();
  upstreamRes.headers.forEach((v, h) => resHeaders.set(h, v));

  if (!upstreamRes.ok) {
    const txt = await upstreamRes.text().catch(() => '');
    console.error('[TUS PROXY] Upstream PATCH error:', {
      status: upstreamRes.status,
      url: upstreamUrl,
      body: txt.slice(0, 200),
    });

    return new NextResponse('Upload chunk failed', {
      status: upstreamRes.status,
      headers: resHeaders,
    });
  }

  return new NextResponse(null, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}
