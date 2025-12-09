import type { ReactNode } from 'react';
import { setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { cookies } from 'next/headers';

import ThemeProv from '@/providers/theme-provider';
import TRQProvider from '@/providers/trq-provider';
import ToasterProv from '@/providers/toaster-provider';
import SessionProviders from '@/providers/session-provider';
import { ConfirmDialogProvider } from '@/providers/confirm-provider';

function norm(l?: string): 'en' | 'sr' {
  return l === 'sr' ? 'sr' : 'en';
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  children: ReactNode;
  params: Promise<{ locale?: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  const current = norm(locale);

  setRequestLocale(current);
  const messages = (await import(`@/messages/${current}.json`)).default;

  const cookieStore = await cookies();
  const themeCookie = cookieStore.get('theme')?.value;
  const initialTheme = (themeCookie === 'dark' ? 'dark' : 'light') as 'light' | 'dark';

  return (
    <html lang={current} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider key={current} locale={current} messages={messages}>
          <ThemeProv defaultTheme={initialTheme}>
            <TRQProvider>
              <SessionProviders>
                <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
              </SessionProviders>
              <ToasterProv />
            </TRQProvider>
          </ThemeProv>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
