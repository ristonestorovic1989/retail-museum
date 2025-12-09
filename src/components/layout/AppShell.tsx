'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

import { SidebarNav } from './SidebarNav';
import LocaleSwitcher from '../LocaleSwitcher';
import ThemeToggle from '../theme/ThemeToggle';
import UserMenu from '@/components/layout/UserMenu';

type AppShellProps = {
  children: React.ReactNode;
  locale: string;
  user?: { name?: string; email?: string };
};

export default function AppShell({ children, locale, user: ssrUser }: AppShellProps) {
  const { data: session } = useSession();
  const user = session?.user ?? ssrUser;

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const update = () => setCollapsed(window.innerWidth < 1280);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <div className="min-h-dvh flex bg-background">
      <aside
        className={cn(
          'hidden lg:block sticky top-0 h-dvh border-r bg-slate-950 text-slate-100 transition-all',
          collapsed ? 'w-16' : 'w-64',
        )}
      >
        <div className="h-14 flex items-center px-3 border-b border-slate-800/60">
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-200/90 hover:text-white"
            onClick={() => setCollapsed((v) => !v)}
          >
            <Menu className="size-5" />
          </Button>
          {!collapsed && <span className="ml-2 font-semibold tracking-tight">RetailCMS</span>}
        </div>

        <SidebarNav collapsed={collapsed} />

        <div className="absolute bottom-0 w-full border-t border-slate-800/60 p-3">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/auth/login` })}
            className="w-full inline-flex items-center gap-3 rounded-md px-3 py-2 text-sm text-slate-200/90 hover:bg-slate-800/60 cursor-pointer"
          >
            <LogOut className="size-4" />
            {!collapsed && 'Logout'}
          </button>
        </div>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 bg-slate-950 text-slate-100 w-72">
          <div className="h-14 flex items-center px-3 border-b border-slate-800/60">
            <span className="font-semibold font-accent tracking-tight">RetailCMS</span>
          </div>
          <SidebarNav />
        </SheetContent>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-white/90 backdrop-blur supports-backdrop-filter:bg-white/60 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <SheetTrigger asChild>
                <Button className="lg:hidden" variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <LocaleSwitcher />
              <UserMenu locale={locale} name={user?.name ?? 'Guest'} email={user?.email ?? ''} />
            </div>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </Sheet>
    </div>
  );
}
