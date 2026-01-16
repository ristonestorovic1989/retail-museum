'use client';

import Image from 'next/image';
import { Clock, Layers, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PlaylistCardItem = {
  id: number;
  name: string;
  thumbnailUrl?: string | null;
  type?: string | null;
  duration?: string | null;
  itemCount?: number | null;
  lastModified?: string | null;
};

type Props = {
  items: PlaylistCardItem[];
  onOpen: (id: number) => void;
  className?: string;
};

export function GroupPlaylistsGrid({ items, onOpen, className }: Props) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
        className,
      )}
    >
      {items.map((p) => (
        <Card
          key={p.id}
          className="group overflow-hidden hover:shadow-md transition-all cursor-pointer border-border/50 hover:border-primary/30"
          onClick={() => onOpen(p.id)}
        >
          <div className="relative aspect-video bg-muted">
            {p.thumbnailUrl ? (
              <Image
                src={p.thumbnailUrl}
                alt={p.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                {t('playlistGroups.groupCard.noThumbnail')}
              </div>
            )}

            <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="sm"
                variant="secondary"
                className="gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen(p.id);
                }}
              >
                <Play className="h-4 w-4" />
                {t('playlistGroups.groupCard.openPlaylist')}
              </Button>
            </div>

            {p.duration ? (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {p.duration}
              </div>
            ) : null}

            {p.type ? (
              <Badge variant="secondary" className="absolute top-2 left-2">
                {p.type}
              </Badge>
            ) : null}
          </div>

          <CardContent className="p-3">
            <div className="min-w-0">
              <div className="font-medium text-sm truncate">{p.name}</div>

              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                {typeof p.itemCount === 'number' ? (
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {t('playlistGroups.groupCard.itemsCount', { count: p.itemCount })}
                  </span>
                ) : null}

                {p.lastModified ? (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {p.lastModified}
                  </span>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
