import NextAuth, { DefaultSession } from 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      email: string;
      name: string;
      role: string;
      companyId: number;
      imageUrl?: string | null;
      language?: string | null;
    };
    accessToken: string;
    refreshToken?: string;
  }

  interface User {
    id: number;
    email: string;
    name: string;
    role: string;
    companyId: number;
    imageUrl?: string | null;
    language?: string | null;

    accessToken: string;
    refreshToken?: string;
    accessTokenExpiresAtUtc: string;
    refreshTokenExpiresAtUtc: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpiresAt?: number;

    user?: {
      id: number;
      email: string;
      name: string;
      role: string;
      companyId: number;
      imageUrl?: string | null;
      language?: string | null;
    };
  }
}
