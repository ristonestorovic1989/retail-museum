'use client';

import {
  LayoutDashboard,
  HardDrive,
  MonitorSmartphone,
  ListVideo,
  ListTree,
  Users2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';

type NavItem = { href: string; label: string; icon: React.ElementType };

const buildItems = (locale: string): NavItem[] => {
  const base = `/${locale}`;
  return [
    { href: `${base}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${base}/assets`, label: 'Asset', icon: HardDrive },
    { href: `${base}/devices`, label: 'Device', icon: MonitorSmartphone },
    { href: `${base}/playlists`, label: 'Playlist', icon: ListVideo },
    { href: `${base}/playlist-groups`, label: 'Playlist group', icon: ListTree },
    { href: `${base}/users`, label: 'User', icon: Users2 },
  ];
};

function isActive(pathname: string, href: string, locale: string) {
  const norm = (s: string) => (s.endsWith('/') && s !== '/' ? s.slice(0, -1) : s);
  const p = norm(pathname);
  const h = norm(href);

  const localeRoot = `/${locale}`;
  if (h === localeRoot) return p === h;
  return p === h || p.startsWith(h + '/');
}

export function SidebarNav({ collapsed }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? 'en';

  const items = buildItems(locale);

  return (
    <nav className="py-3">
      {items.map((item) => {
        const active = isActive(pathname, item.href, locale);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'mx-2 flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active ? 'bg-accent text-black font-medium' : 'text-white hover:bg-accent/20',
            )}
            aria-current={active ? 'page' : undefined}
            title={collapsed ? item.label : undefined}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && item.label}
          </Link>
        );
      })}
    </nav>
  );
}
