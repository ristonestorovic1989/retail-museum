import { apiFetch } from '@/lib/http/server';
import type { AuthUser, ForgotPasswordPayload, ResetPasswordPayload } from './types';

type LoginResponseRaw = {
  succeeded: boolean;
  message: string;
  data?: {
    userId: number;
    companyId: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    imageUrl: string;
    language: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAtUtc: string;
    refreshTokenExpiresAtUtc: string;
  };
};

export type NormalizedLoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
};

export async function loginServer(
  email: string,
  password: string,
): Promise<NormalizedLoginResponse | null> {
  const raw = await apiFetch<LoginResponseRaw>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!raw.succeeded || !raw.data?.accessToken) {
    return null;
  }

  const d = raw.data;

  return {
    accessToken: d.accessToken,
    refreshToken: d.refreshToken,
    user: {
      id: d.userId,
      companyId: d.companyId,
      email: d.email,
      name: `${d.firstName} ${d.lastName}`,
      firstName: d.firstName,
      lastName: d.lastName,
      role: d.role,
      imageUrl: d.imageUrl,
      language: d.language,
    },
    accessTokenExpiresAtUtc: d.accessTokenExpiresAtUtc,
    refreshTokenExpiresAtUtc: d.refreshTokenExpiresAtUtc,
  };
}

export async function refreshServer(refreshToken: string) {
  return apiFetch<{ accessToken: string; refreshToken?: string }>('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });
}

export async function forgotPasswordServer(payload: ForgotPasswordPayload) {
  await apiFetch<void>('/api/auth/forgot-password', {
    method: 'POST',
    body: payload,
  });
}

export async function resetPasswordServer(payload: ResetPasswordPayload) {
  await apiFetch<void>('/api/auth/reset-password', {
    method: 'POST',
    body: payload,
  });
}
