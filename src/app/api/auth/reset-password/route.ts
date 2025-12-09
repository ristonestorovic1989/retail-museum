import { NextResponse } from 'next/server';
import { resetPasswordServer } from '@/features/auth/api.server';
import type { ResetPasswordPayload } from '@/features/auth/types';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ResetPasswordPayload;

    await resetPasswordServer(body);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('[RESET PASSWORD ROUTE] error =', err);

    return NextResponse.json({ message: err?.message || 'Reset password failed' }, { status: 400 });
  }
}
