import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { apiFetch } from '@/lib/http/server';
import { authOptions } from '../../auth/[...nextauth]/route';

type TranslateRequest = {
  langs: string[];
  text: string;
};

type TranslateResponse = {
  translations: Record<string, string>;
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const body = (await req.json()) as TranslateRequest;

  const data = await apiFetch<TranslateResponse>('/api/assets/translate', {
    method: 'POST',
    body: body,
    accessToken: session.accessToken,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return NextResponse.json(data);
}
