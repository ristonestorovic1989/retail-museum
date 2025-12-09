'use client';

import { useSearchParams, useParams } from 'next/navigation';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const { locale } = useParams<{ locale: string }>();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-destructive">Invalid or expired reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <ResetPasswordForm token={token} email={email} locale={locale} />
    </div>
  );
}
