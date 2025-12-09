import { NextRequest, NextResponse } from 'next/server';
import { apiFetch } from '@/lib/http/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();

    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    console.log('[delete-bulk] incoming body from client:', { ids });

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'No ids provided' }, { status: 400 });
    }

    await apiFetch<void>('/api/assets/delete-bulk', {
      method: 'POST',
      body: { ids },
      accessToken: session?.accessToken,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('[delete-bulk] error:', error);
    return NextResponse.json({ message: error.message || 'Bulk delete failed' }, { status: 500 });
  }
}
