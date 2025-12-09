'use client';

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {
  titleKey: string;
  descriptionKey: string;
};

export default function AuthHeader({ titleKey, descriptionKey }: Props) {
  const t = useTranslations('auth');

  return (
    <CardHeader className="space-y-1 text-center">
      <div className="flex justify-center mb-4">
        <div className="h-12 w-12 bg-accent rounded-lg flex items-center justify-center">
          <Monitor className="h-6 w-6 text-primary-foreground" />
        </div>
      </div>
      <CardTitle className="text-2xl font-bold">{t(titleKey)}</CardTitle>
      <CardDescription>{t(descriptionKey)}</CardDescription>
    </CardHeader>
  );
}
