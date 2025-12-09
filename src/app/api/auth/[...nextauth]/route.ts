import NextAuth, { type NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginServer, refreshServer } from '@/features/auth/api.server';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },

  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (creds) => {
        if (!creds?.email || !creds?.password) return null;

        const data = await loginServer(creds.email, creds.password);
        if (!data?.accessToken) return null;

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          companyId: data.user.companyId,
          imageUrl: data.user.imageUrl,
          language: data.user.language,

          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          accessTokenExpiresAtUtc: data.accessTokenExpiresAtUtc,
          refreshTokenExpiresAtUtc: data.refreshTokenExpiresAtUtc,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          id: Number(user.id),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          imageUrl: user.imageUrl,
          language: user.language,
        };

        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        token.accessTokenExpiresAt = Date.now() + 55 * 60 * 1000;
      }
      if (
        token.accessTokenExpiresAt &&
        Date.now() > token.accessTokenExpiresAt &&
        token.refreshToken
      ) {
        try {
          const refreshed = await refreshServer(token.refreshToken);

          if (refreshed?.accessToken) {
            token.accessToken = refreshed.accessToken;

            if (refreshed.refreshToken) {
              token.refreshToken = refreshed.refreshToken;
            }

            token.accessTokenExpiresAt = Date.now() + 55 * 60 * 1000;
          } else {
            return {};
          }
        } catch (err) {
          console.error('Refresh token error:', err);
          return {};
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.accessToken) {
        return {
          user: null,
          accessToken: '',
          refreshToken: '',
          expires: new Date(Date.now()).toISOString(),
        } as any;
      }

      session.user = token.user as any;
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;

      session.expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      return session;
    },
  },

  pages: {
    signIn: '/auth/login',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
