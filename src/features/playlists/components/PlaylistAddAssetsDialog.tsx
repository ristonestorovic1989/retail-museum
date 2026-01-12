'use client';

import { useMemo, useState } from 'react';
import { Search, FileVideo, FileImage, FileAudio, X } from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import type { TFn } from '@/types/i18n';

type AssetType = 'video' | 'image' | 'audio';

type Asset = {
  id: number;
  name: string;
  type: AssetType;
  category: string;
  duration: string;
};

type Props = {
  t: TFn;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  playlistName: string;
  // pošto još nema API wired, ostavljam interno mock; možeš posle da proslediš prop
  assets?: Asset[];
  onConfirm: (assetIds: number[]) => void;
};

const DEFAULT_ASSETS: Asset[] = [
  { id: 101, name: 'Corporate Intro', type: 'video', category: 'Marketing', duration: '30s' },
  { id: 102, name: 'Product Showcase', type: 'video', category: 'Marketing', duration: '1m 15s' },
  { id: 103, name: 'Company Logo', type: 'image', category: 'Branding', duration: '10s' },
  { id: 104, name: 'Background Music 1', type: 'audio', category: 'Audio', duration: '2m 30s' },
  { id: 105, name: 'Promotional Banner', type: 'image', category: 'Marketing', duration: '15s' },
  { id: 106, name: 'Tutorial Video', type: 'video', category: 'Education', duration: '5m' },
  { id: 107, name: 'Event Highlights', type: 'video', category: 'Events', duration: '2m' },
  { id: 108, name: 'Testimonial', type: 'video', category: 'Marketing', duration: '45s' },
];

function iconFor(type: AssetType) {
  if (type === 'video') return <FileVideo className="h-10 w-10 text-muted-foreground" />;
  if (type === 'image') return <FileImage className="h-10 w-10 text-muted-foreground" />;
  return <FileAudio className="h-10 w-10 text-muted-foreground" />;
}

export function PlaylistAddAssetsDialog({
  t,
  open,
  onOpenChange,
  playlistName,
  assets = DEFAULT_ASSETS,
  onConfirm,
}: Props) {
  const [assetSearch, setAssetSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => set.add(a.category));
    return Array.from(set.values()).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    const s = assetSearch.trim().toLowerCase();
    return assets.filter((a) => {
      const matchesSearch = !s || a.name.toLowerCase().includes(s);
      const matchesCategory = selectedCategory === 'all' || a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [assets, assetSearch, selectedCategory]);

  const toggleAssetSelection = (assetId: number) => {
    setSelectedAssets((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId],
    );
  };

  const reset = () => {
    setAssetSearch('');
    setSelectedCategory('all');
    setSelectedAssets([]);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle>{t('playlists.addAssets.title')}</DialogTitle>
          <DialogDescription>
            {t('playlists.addAssets.description', { name: playlistName })}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-4">
          {/* Search + filter */}
          <div className="flex gap-4 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('playlists.addAssets.searchPlaceholder')}
                className="pl-9"
                value={assetSearch}
                onChange={(e) => setAssetSearch(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[220px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('playlists.addAssets.categories.all')}</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected count */}
          {selectedAssets.length > 0 && (
            <div className="shrink-0 flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <span className="text-sm font-medium">
                {t('playlists.addAssets.selectedCount', { count: selectedAssets.length })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedAssets([])}>
                {t('playlists.addAssets.clearSelection')}
              </Button>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredAssets.map((asset) => {
                const checked = selectedAssets.includes(asset.id);
                return (
                  <Card
                    key={asset.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${checked ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => toggleAssetSelection(asset.id)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                          {iconFor(asset.type)}

                          {checked && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <div className="bg-primary rounded-full p-2">
                                <X className="h-4 w-4 text-primary-foreground" />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-medium text-sm line-clamp-1">{asset.name}</h4>
                            <Checkbox
                              checked={checked}
                              onCheckedChange={() => toggleAssetSelection(asset.id)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="capitalize">{asset.type}</span>
                            <span>•</span>
                            <span>{asset.duration}</span>
                            <span>•</span>
                            <span>{asset.category}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredAssets.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t('playlists.addAssets.empty')}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
          >
            {t('playlists.common.cancel')}
          </Button>

          <Button
            onClick={() => {
              onConfirm(selectedAssets);
              onOpenChange(false);
              reset();
            }}
            disabled={selectedAssets.length === 0}
          >
            {t('playlists.addAssets.confirm', { count: selectedAssets.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
