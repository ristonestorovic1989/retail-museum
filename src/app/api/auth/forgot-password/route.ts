import { NextRequest, NextResponse } from 'next/server';
import { forgotPasswordServer } from '@/features/auth/api.server';

export async function POST(req: NextRequest) {
  const payload = (await req.json()) as { email: string };

  await forgotPasswordServer(payload);

  return NextResponse.json({ ok: true });
}
