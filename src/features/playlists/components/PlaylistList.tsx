'use client';

import { Calendar, Clock, Search } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { InlineSpinner } from '@/components/shared/inline-spinner';

import type { TFn } from '@/types/i18n';
import type { PlaylistSummary } from '../types';
import { CenteredSpinner } from '@/components/shared/centered-spiner';
import { SearchInput } from '@/components/shared/search-input';

type Props = {
  t: TFn;
  items: PlaylistSummary[];
  searchTerm: string;
  onSearchTermChange: (v: string) => void;
  selectedId: number | null;
  onSelect: (id: number) => void;
  isLoading?: boolean;
  error?: string | null;
};

export function PlaylistsList({
  t,
  items,
  searchTerm,
  onSearchTermChange,
  selectedId,
  onSelect,
  isLoading,
  error,
}: Props) {
  const hasItems = items.length > 0;
  const showInitialLoading = !!isLoading && !hasItems && !error;
  const showRefreshing = !!isLoading && hasItems && !error;

  return (
    <Card className="lg:col-span-1 h-full min-h-0 flex flex-col overflow-hidden">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <CardTitle>{t('playlists.list.title')}</CardTitle>

          {showRefreshing && (
            <InlineSpinner
              label={t('playlists.list.refreshing', { defaultValue: 'Refreshing…' })}
            />
          )}
        </div>

        <div className="mt-4">
          <SearchInput
            value={searchTerm}
            onChange={() => {}}
            onDebouncedChange={onSearchTermChange}
            delayMs={350}
            placeholder={t('playlists.list.searchPlaceholder')}
            disableFocusStyles
            clearable
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0 min-h-0 overflow-hidden">
        {error && <div className="text-sm text-destructive">{error}</div>}

        {showInitialLoading && (
          <CenteredSpinner label={t('playlists.list.loading', { defaultValue: 'Loading…' })} />
        )}

        {!error && !showInitialLoading && (
          <div className="relative h-full min-h-0 overflow-hidden pb-6">
            {showRefreshing && (
              <div className="absolute z-10 top-3 right-3">
                <InlineSpinner
                  label={t('playlists.list.refreshing', { defaultValue: 'Refreshing…' })}
                />
              </div>
            )}

            <ScrollArea className="h-full w-full">
              <div className="space-y-2 w-full min-w-0 pr-3">
                {items.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onSelect(Number(p.id))}
                    className={cn(
                      'block cursor-pointer w-full min-w-0 text-left',
                      'rounded-xl border bg-card p-4 transition',
                      'hover:border-accent/40 hover:shadow-sm',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent',
                      String(selectedId) === String(p.id) && 'border-accent border-2',
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 w-full min-w-0">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold whitespace-normal wrap-break-word">
                          {p.name}
                        </div>

                        <div className="mt-1 flex items-start gap-2 text-xs text-muted-foreground min-w-0">
                          <Clock className="h-3 w-3 shrink-0 mt-0.5" />
                          <div className="min-w-0 whitespace-normal wrap-break-word">
                            {p.duration} • {t('playlists.list.assetsCount', { count: p.numAssets })}
                          </div>
                        </div>
                      </div>

                      <Badge
                        className={cn(
                          'shrink-0 h-6',
                          p.active
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-muted text-muted-foreground border border-border',
                        )}
                      >
                        {p.active
                          ? t('playlists.list.statusActive')
                          : t('playlists.list.statusInactive')}
                      </Badge>
                    </div>

                    <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground min-w-0">
                      <Calendar className="h-3 w-3 shrink-0 mt-0.5" />
                      <div className="min-w-0 whitespace-normal wrap-break-word">
                        {p.dateOfCreation}
                      </div>
                    </div>
                  </button>
                ))}

                {items.length === 0 && (
                  <div className="text-sm text-muted-foreground">{t('playlists.list.empty')}</div>
                )}
              </div>
            </ScrollArea>

            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-card to-transparent" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
