'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';

import AuthHeader from './AuthHeader';
import LoginForm from './LoginForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import AuthTopBar from '@/components/layout/AuthTopBar';
import { AuthMode, AuthCopy } from '../types';
import { forgotPassword } from '../api.client';

const COPY_KEYS: Record<AuthMode, AuthCopy> = {
  [AuthMode.Login]: { titleKey: 'titles.login', descriptionKey: 'descriptions.login' },
  [AuthMode.Signup]: { titleKey: 'titles.signup', descriptionKey: 'descriptions.signup' },
  [AuthMode.Forgot]: { titleKey: 'titles.forgot', descriptionKey: 'descriptions.forgot' },
};

export default function AuthContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pathname = usePathname();
  const t = useTranslations('auth');

  const next = params.get('next') || '/';
  const locale = pathname.match(/^\/(en|sr)(\/|$)/)?.[1] ?? 'en';
  const safeNext = next.startsWith('/') ? next : `/${locale}`;

  const [mode, setMode] = useState<AuthMode>(AuthMode.Login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSwitch = (m: AuthMode) => setMode(m);

  const loginMutation = useMutation({
    mutationFn: async (payload: { email: string; password: string }) => {
      const res = await signIn('credentials', {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });
      if (!res || !res.ok) {
        throw new Error(t('toast.invalidCredentials'));
      }
      return res;
    },
    onSuccess: () => {
      toast.success(t('toast.loginSuccess'));
      router.push(safeNext);
    },
    onError: (error: any) => {
      toast.error(error?.message || t('toast.invalidCredentials'));
    },
  });

  const forgotMutation = useMutation({
    mutationFn: async (payload: { email: string }) => {
      if (!payload.email) {
        throw new Error(t('toast.emailRequired'));
      }
      await forgotPassword({ email: payload.email });
      return true;
    },
    onSuccess: () => {
      toast(t('toast.resetTitle'), {
        description: t('toast.resetDescription'),
      });
      setMode(AuthMode.Login);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Request failed');
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    forgotMutation.mutate({ email });
  };

  const { titleKey, descriptionKey } = COPY_KEYS[mode];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-background to-muted p-4">
      <AuthTopBar />

      <Card className="w-full max-w-md">
        <AuthHeader titleKey={titleKey} descriptionKey={descriptionKey} />

        {mode === AuthMode.Login && (
          <LoginForm
            email={email}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
            onSubmit={handleLogin}
            onSwitch={onSwitch}
            isSubmitting={loginMutation.isPending}
          />
        )}

        {mode === AuthMode.Forgot && (
          <ForgotPasswordForm
            email={email}
            setEmail={setEmail}
            onSubmit={handleForgot}
            onSwitch={onSwitch}
            disabled={forgotMutation.isPending}
          />
        )}
      </Card>
    </div>
  );
}
