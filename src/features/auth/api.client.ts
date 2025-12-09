import type { ForgotPasswordPayload, ResetPasswordPayload } from './types';

async function handleJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (null as T);
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
  const res = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await handleJson<{ message?: string }>(res);
    throw new Error(data?.message || 'Failed to send reset link');
  }
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<void> {
  const res = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await handleJson<{ message?: string }>(res);
    throw new Error(data?.message || 'Failed to reset password');
  }
}
