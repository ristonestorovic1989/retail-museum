'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, GripVertical, Trash2, Save, X } from 'lucide-react';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import type { TFn } from '@/types/i18n';
import type { PlaylistDetails } from '../../types';
import { getAssetUrl } from '@/lib/assets';

type Props = {
  t: TFn;
  playlist: PlaylistDetails;
  onAddAssets: () => void;
  onSaveOrder: (assetIds: number[]) => Promise<void> | void;
  isSaving?: boolean;
};

type AssetInstance = {
  instanceId: string;
  assetId: number;
  name: string;
  imageUrl?: string | null;
};

function buildInstances(playlist: PlaylistDetails): AssetInstance[] {
  const ids = playlist.assetIds ?? [];
  const assets = playlist.assets ?? [];

  const metaById = new Map<number, { name: string | null; imageUrl?: string | null }>();
  for (const a of assets) {
    metaById.set(a.id, {
      name: a.name,
      imageUrl: (a as any).imageUrl ?? (a as any).imageURL ?? null,
    });
  }

  return ids.map((assetId, idx) => {
    const meta = metaById.get(assetId);
    return {
      instanceId: `${assetId}:${idx}`,
      assetId,
      name: meta?.name ?? `#${assetId}`,
      imageUrl: meta?.imageUrl ?? null,
    };
  });
}

function SortableRow({
  t,
  item,
  index,
  isEditing,
  onRemove,
}: {
  t: TFn;
  item: AssetInstance;
  index: number;
  isEditing: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.instanceId,
    disabled: !isEditing,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  const thumb = item.imageUrl ? getAssetUrl(item.imageUrl) : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-xl p-3 flex gap-3 items-center bg-background"
    >
      <div className="h-12 w-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {t('playlists.details.noImage')}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="font-medium truncate">{item.name || t('playlists.details.untitled')}</div>
        <div className="text-xs text-muted-foreground">
          {t('playlists.details.order', { order: index + 1 })}
        </div>
      </div>

      <Badge variant="secondary">#{index + 1}</Badge>

      {isEditing && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hover:bg-destructive/10"
            onClick={onRemove}
            title={t('common.remove') ?? 'Remove'}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="cursor-grab active:cursor-grabbing"
            {...attributes}
            {...listeners}
            title={t('common.reorder') ?? 'Reorder'}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function PlaylistAssetsSection({
  t,
  playlist,
  onAddAssets,
  onSaveOrder,
  isSaving = false,
}: Props) {
  const initial = useMemo(() => buildInstances(playlist), [playlist]);

  const [isEditing, setIsEditing] = useState(false);
  const [items, setItems] = useState<AssetInstance[]>(initial);

  useEffect(() => {
    if (!isEditing) setItems(initial);
  }, [initial, isEditing]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const assetIdsToSave = useMemo(() => items.map((x) => x.assetId), [items]);

  const hasChanges = useMemo(() => {
    const a = (playlist.assetIds ?? []).join(',');
    const b = assetIdsToSave.join(',');
    return a !== b;
  }, [playlist.assetIds, assetIdsToSave]);

  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setItems((prev) => {
      const oldIndex = prev.findIndex((x) => x.instanceId === active.id);
      const newIndex = prev.findIndex((x) => x.instanceId === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const onRemoveInstance = (instanceId: string) => {
    setItems((prev) => prev.filter((x) => x.instanceId !== instanceId));
  };

  const assetsCount = items.length;

  return (
    <div className="flex-1 min-h-0 pt-6 flex flex-col overflow-hidden">
      <div className="shrink-0 flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{t('playlists.details.assetsTitle')}</h3>
          <Badge variant="outline">{assetsCount}</Badge>
          {isEditing && <Badge variant="secondary">{t('common.editing') ?? 'Editing'}</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button size="sm" variant="outline" className="gap-2" onClick={onAddAssets}>
                <Plus className="h-4 w-4" />
                {t('playlists.details.addAsset')}
              </Button>

              <Button size="sm" variant="default" onClick={() => setIsEditing(true)}>
                {t('common.edit') ?? 'Edit order'}
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isSaving}
                className="gap-2"
                onClick={() => {
                  setIsEditing(false);
                  setItems(buildInstances(playlist));
                }}
              >
                <X className="h-4 w-4" />
                {t('common.cancel') ?? 'Cancel'}
              </Button>

              <Button
                size="sm"
                variant="default"
                disabled={isSaving || !hasChanges}
                className="gap-2"
                onClick={async () => {
                  await onSaveOrder(assetIdsToSave);
                  setIsEditing(false);
                }}
              >
                <Save className="h-4 w-4" />
                {isSaving ? (t('common.saving') ?? 'Saving…') : (t('common.save') ?? 'Save')}
              </Button>
            </>
          )}
        </div>
      </div>

      {assetsCount === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <div className="w-full rounded-xl border-2 border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground mb-4">{t('playlists.details.noAssets')}</p>
            <Button className="gap-2" onClick={onAddAssets}>
              <Plus className="h-4 w-4" />
              {t('playlists.details.addFirstAsset')}
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col gap-3 pr-2 pb-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext
                items={items.map((x) => x.instanceId)}
                strategy={verticalListSortingStrategy}
              >
                {items.map((it, idx) => (
                  <SortableRow
                    key={it.instanceId}
                    t={t}
                    item={it}
                    index={idx}
                    isEditing={isEditing}
                    onRemove={() => onRemoveInstance(it.instanceId)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
