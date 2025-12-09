import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const locale = (await getLocale()) as 'en' | 'sr';

  if (!session) {
    redirect(`/${locale}/auth/login?next=/${locale}/dashboard`);
  }

  redirect(`/${locale}/dashboard`);
}
