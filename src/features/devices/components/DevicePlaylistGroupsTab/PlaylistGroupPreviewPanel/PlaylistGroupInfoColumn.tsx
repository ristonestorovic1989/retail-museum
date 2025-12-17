'use client';

import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAssetUrl } from '@/lib/assets';
import { PlaylistGroupSummary } from '@/features/devices/types';

type Props = {
  group: PlaylistGroupSummary;
};

export function PlaylistGroupInfoColumn({ group }: Props) {
  const frontImageSrc = getAssetUrl(group.imageUrl);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3">
      <h4 className="wrap-break-word text-lg font-semibold">{group.name}</h4>

      {frontImageSrc && (
        <div className="relative h-40 w-60 overflow-hidden rounded-md border border-white/30 bg-black/40">
          <Image src={frontImageSrc} alt={group.name} fill className="object-cover" sizes="240px" />
        </div>
      )}

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full pr-2">
          <p className="wrap-break-word text-xs leading-relaxed text-white/90">
            {group.description}
          </p>
        </ScrollArea>
      </div>
    </div>
  );
}
