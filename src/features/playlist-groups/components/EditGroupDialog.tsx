'use client';

import { useEffect, useMemo, useState } from 'react';
import { AppDialog } from '@/components/shared/app-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlaylistGroup } from '../types';

type FormValues = {
  name: string;
  description: string;
  imageUrl: string;
  backgroundUrl: string;
  playlistIds: number[];
};

type Props = {
  group: PlaylistGroup | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  isSaving: boolean;
  onSubmit: (values: FormValues) => void | Promise<void>;
};

export function EditGroupDialog({ group, open, onOpenChange, isSaving, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [playlistIdsText, setPlaylistIdsText] = useState('');

  useEffect(() => {
    if (!group) return;
    setName(group.name ?? '');
    setDescription(group.description ?? '');
    setImageUrl(group.imageUrl ?? '');
    setBackgroundUrl(group.backgroundUrl ?? '');
    setPlaylistIdsText((group.playlistIds ?? []).join(', '));
  }, [group]);

  const canSave = useMemo(() => name.trim().length > 0, [name]);

  function parseIds(s: string): number[] {
    return s
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map(Number)
      .filter((n) => Number.isFinite(n) && n > 0);
  }

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Group"
      description={group ? `Update details for "${group.name}".` : 'Update group details.'}
      cancelLabel="Cancel"
      primaryAction={{
        label: isSaving ? 'Saving…' : 'Save',
        onClick: () =>
          onSubmit({
            name: name.trim(),
            description: description.trim(),
            imageUrl: imageUrl.trim(),
            backgroundUrl: backgroundUrl.trim(),
            playlistIds: parseIds(playlistIdsText),
          }),
        disabled: !canSave || isSaving,
      }}
      onRequestClose={() => {
        onOpenChange(false);
      }}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Group name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Image URL</Label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Background URL</Label>
            <Input value={backgroundUrl} onChange={(e) => setBackgroundUrl(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Playlist IDs (comma-separated)</Label>
          <Input value={playlistIdsText} onChange={(e) => setPlaylistIdsText(e.target.value)} />
        </div>
      </div>
    </AppDialog>
  );
}
