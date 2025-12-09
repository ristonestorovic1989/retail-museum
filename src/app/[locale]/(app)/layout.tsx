import { ReactNode } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import AppShell from '@/components/layout/AppShell';

type Props = {
  children: ReactNode;
};

export default async function ProtectedLayout({ children }: Props) {
  const locale = await getLocale();
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/auth/login?next=/${locale}/dashboard`);
  }

  return (
    <AppShell
      locale={locale}
      user={{
        name: session.user?.name ?? 'User',
        email: session.user?.email ?? '',
      }}
    >
      {children}
    </AppShell>
  );
}
