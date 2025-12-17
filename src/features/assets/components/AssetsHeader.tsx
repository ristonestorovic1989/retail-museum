'use client';

import { Search, Grid3x3, List, X, Upload } from 'lucide-react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TFn } from '@/types/i18n';

type ViewMode = 'table' | 'grid';

type Props = {
  t: TFn;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onUploadClick: () => void;
};

export function AssetsHeader({
  t,
  totalCount,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onUploadClick,
}: Props) {
  const handleClearSearch = () => {
    onSearchChange('');
  };

  return (
    <CardHeader>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <CardTitle>{t('table.title')}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('table.subtitle', { count: totalCount })}
          </p>

          <div className="mt-2 inline-flex items-center gap-1 rounded-md border p-1">
            <Button
              type="button"
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('table')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('table.searchPlaceholder')}
              className="pl-8 pr-8"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
                onClick={handleClearSearch}
                aria-label={t('table.clearSearch', { defaultValue: 'Clear search' })}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <Button type="button" className="gap-2" onClick={onUploadClick}>
            <Upload className="h-4 w-4" />
            {t('upload.button', { defaultValue: 'Upload assets' })}
          </Button>
        </div>
      </div>
    </CardHeader>
  );
}
