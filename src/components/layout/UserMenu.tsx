'use client';

import { LogOut, Settings, User2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { signOut } from 'next-auth/react';

interface UserMenuProps {
  name?: string;
  email?: string;
  locale?: string;
}

export default function UserMenu({
  name = 'Admin',
  email = 'admin@mail.test',
  locale,
}: UserMenuProps) {
  const t = useTranslations('layout.userMenu');

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none cursor-pointer" aria-label={t('triggerLabel')}>
        <div className="flex items-center gap-3">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm font-medium">{name}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="leading-tight">
          <div className="text-xs text-muted-foreground">{t('signedInAs')}</div>
          <div className="font-medium">{name}</div>
          <div className="text-xs text-muted-foreground">{email}</div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="gap-2 cursor-pointer data-highlighted:bg-accent/20 data-highlighted:text-accent-foreground">
          <User2 className="size-4" />
          {t('profile')}
        </DropdownMenuItem>

        <DropdownMenuItem className="gap-2 cursor-pointer data-highlighted:bg-accent/20 data-highlighted:text-accent-foreground">
          <Settings className="size-4" />
          {t('settings')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
          className="gap-2 text-red-600 cursor-pointer data-highlighted:bg-red-600/10 data-highlighted:text-red-700"
        >
          <LogOut className="size-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
