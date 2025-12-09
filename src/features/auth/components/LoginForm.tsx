'use client';

import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { AuthMode, AuthCommonProps } from '../types';
import { PasswordInput } from '@/components/ui/password-input';

type Props = AuthCommonProps & {
  email: string;
  password: string;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
  isSubmitting?: boolean;
};

export default function LoginForm({
  email,
  password,
  setEmail,
  setPassword,
  onSubmit,
  onSwitch,
  isSubmitting,
}: Props) {
  const t = useTranslations('auth');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('fields.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t('placeholders.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('fields.password')}</Label>
            <button
              type="button"
              onClick={() => onSwitch(AuthMode.Forgot)}
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              {t('links.forgot')}
            </button>
          </div>
          <PasswordInput
            id="password"
            placeholder={t('placeholders.password')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button isLoading={isSubmitting} type="submit" className="w-full">
          {t('actions.signIn')}
        </Button>

        {/* <p className="text-sm text-center text-muted-foreground">
          {t('inline.noAccount')}
          <button
            type="button"
            onClick={() => onSwitch(AuthMode.Signup)}
            className="text-primary hover:underline"
          >
            {t('links.signUp')}
          </button>
        </p> */}
      </CardFooter>
    </form>
  );
}
