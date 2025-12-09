'use client';

import { CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslations } from 'next-intl';
import { AuthCommonProps, AuthMode } from '../types';

type Props = AuthCommonProps & {
  email: string;
  setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
};

export default function ForgotPasswordForm({ email, setEmail, onSubmit, onSwitch }: Props) {
  const t = useTranslations('auth');

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">{t('fields.email')}</Label>
          <Input
            id="forgot-email"
            type="email"
            placeholder={t('placeholders.email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full">
          {t('actions.sendReset')}
        </Button>
        <button
          type="button"
          onClick={() => onSwitch(AuthMode.Login)}
          className="text-sm text-primary hover:underline"
        >
          {t('links.backToLogin')}
        </button>
      </CardFooter>
    </form>
  );
}
