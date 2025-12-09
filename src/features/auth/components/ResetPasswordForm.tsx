'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { resetPassword } from '@/features/auth/api.client';
import type { ResetPasswordPayload } from '@/features/auth/types';
import { PasswordInput } from '@/components/ui/password-input';

type ResetPasswordFormProps = {
  token: string;
  email: string;
  locale: string;
};

export function ResetPasswordForm({ token, email, locale }: ResetPasswordFormProps) {
  const router = useRouter();
  const t = useTranslations('auth');

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error(t('resetPassword.errorInvalid'));
      return;
    }

    if (newPassword !== confirm) {
      toast.error(t('resetPassword.errorMismatch'));
      return;
    }

    const payload: ResetPasswordPayload = {
      token,
      newPassword,
      email,
    };

    try {
      setIsSubmitting(true);

      await resetPassword(payload);

      toast.success(t('resetPassword.toastSuccess'));
      router.push(`/${locale}/auth/login`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || t('resetPassword.toastError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <Card className="shadow">
        <CardHeader>
          <CardTitle className="text-xl">{t('resetPassword.title')}</CardTitle>
          <CardDescription>{t('resetPassword.description')}</CardDescription>
          {email && (
            <p className="text-sm text-muted-foreground mt-2">
              <span className="font-medium">{decodeURIComponent(email)}</span>
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('resetPassword.newPasswordLabel')}</Label>
            <PasswordInput
              id="password"
              placeholder={t('placeholders.password')}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">{t('resetPassword.confirmPasswordLabel')}</Label>
            <PasswordInput
              id="confirm-password"
              placeholder={t('placeholders.confirmPassword')}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? t('actions.sendReset') : t('resetPassword.submitButton')}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}
