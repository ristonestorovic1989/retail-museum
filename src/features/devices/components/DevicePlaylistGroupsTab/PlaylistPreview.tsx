'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { PlaylistAssetPreview } from '../../types';
import { getAssetUrl } from '@/lib/assets';
import type { TFn } from '@/types/i18n';

const THUMB_W = 84;
const THUMB_H = 58;
const GAP = 10;
const STEP = THUMB_W + GAP;

type Props = {
  t: TFn;
  assets: PlaylistAssetPreview[];
  intervalMs?: number;
  autoPlay?: boolean;
  onClose?: () => void;
};

export function PlaylistPreview({ t, assets, intervalMs = 8000, autoPlay = true, onClose }: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const thumbsViewportRef = useRef<HTMLDivElement | null>(null);
  const [thumbsViewportW, setThumbsViewportW] = useState(0);

  useEffect(() => setIndex(0), [assets]);

  const goPrev = useCallback(() => {
    if (assets.length <= 1) return;
    setIndex((i) => (i - 1 + assets.length) % assets.length);
  }, [assets.length]);

  const goNext = useCallback(() => {
    if (assets.length <= 1) return;
    setIndex((i) => (i + 1) % assets.length);
  }, [assets.length]);

  useEffect(() => {
    if (!autoPlay || paused || assets.length <= 1) return;
    const id = window.setInterval(goNext, intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, paused, assets.length, intervalMs, goNext]);

  useEffect(() => {
    if (assets.length <= 1) return;

    const preload = (i: number) => {
      const a = assets[(i + assets.length) % assets.length];
      if (a?.imageUrl) {
        const img = new window.Image();
        img.src = getAssetUrl(a.imageUrl);
      }
    };

    preload(index + 1);
    preload(index + 2);
  }, [index, assets]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') onClose?.();
      if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goPrev, goNext, onClose]);

  useLayoutEffect(() => {
    const el = thumbsViewportRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => setThumbsViewportW(el.clientWidth));
    ro.observe(el);
    setThumbsViewportW(el.clientWidth);

    return () => ro.disconnect();
  }, []);

  const previewT = useCallback(
    (key: string, values?: Record<string, unknown>) => t(`preview.${key}`, values),
    [t],
  );

  if (!assets?.length) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg bg-muted/20 text-sm text-muted-foreground">
        {previewT('noAssets')}
      </div>
    );
  }

  const current = assets[index];
  const itemTitle =
    current?.name?.trim() ||
    previewT('assetFallback', { index: index + 1 }) ||
    `Asset ${index + 1}`;
  const mainSrc = getAssetUrl(current?.imageUrl ?? null);

  const translateX = useMemo(() => {
    const count = assets.length;
    if (count <= 1) return 0;

    const stripW = count * THUMB_W + (count - 1) * GAP;
    const viewportW = thumbsViewportW || 0;

    if (viewportW > 0 && stripW <= viewportW) {
      return Math.round((viewportW - stripW) / 2);
    }

    const activeCenter = index * STEP + THUMB_W / 2;
    const desired = viewportW / 2 - activeCenter;

    const max = 0;
    const min = viewportW - stripW;

    return Math.max(min, Math.min(max, desired));
  }, [assets.length, index, thumbsViewportW]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden rounded-lg bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative flex-1 overflow-hidden">
        {mainSrc ? (
          <Image
            src={mainSrc}
            alt={itemTitle}
            fill
            unoptimized
            className="object-contain"
            sizes="(max-width: 1024px) 90vw, 900px"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-white/70">
            {itemTitle}
          </div>
        )}

        {assets.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white/90 hover:text-accent hover:bg-accent/25 hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent transition cursor-pointer"
              aria-label={previewT('previous')}
              title={`${previewT('previous')} (←)`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={goNext}
              className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/15 bg-black/55 p-2 text-white/90 hover:text-accent hover:bg-accent/25 hover:border-accent/60 focus-visible:ring-2 focus-visible:ring-accent transition cursor-pointer"
              aria-label={previewT('next')}
              title={`${previewT('next')} (→)`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {assets.length > 1 && (
        <div className="border-t border-white/10 bg-black/92 px-3 pt-2">
          <div className="flex items-center justify-between pb-2">
            <p className="min-w-0 truncate text-[11px] text-white/75" title={itemTitle}>
              {itemTitle}
            </p>

            {paused && (
              <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                {previewT('paused')}
              </span>
            )}
          </div>

          <div ref={thumbsViewportRef} className="relative h-20 overflow-hidden pb-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-linear-to-r from-black/90 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-linear-to-l from-black/90 to-transparent" />

            <div className="absolute left-0 top-1/2 -translate-y-1/2">
              <div
                className="flex items-center gap-2.5 will-change-transform"
                style={{
                  transform: `translateX(${translateX}px)`,
                  transitionProperty: 'transform',
                  transitionDuration: '420ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {assets.map((a, i) => {
                  const thumbSrc = getAssetUrl(a.imageUrl ?? null);
                  const active = i === index;
                  const thumbTitle =
                    a?.name?.trim() ||
                    previewT('assetFallback', { index: i + 1 }) ||
                    `Asset ${i + 1}`;

                  return (
                    <button
                      key={a.id ?? i}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={[
                        'relative shrink-0 overflow-hidden rounded-md border transition',
                        'focus-visible:ring-2 focus-visible:ring-accent',
                        'hover:bg-accent/10 cursor-pointer',
                        active
                          ? 'border-accent ring-2 ring-accent/40 scale-[1.03]'
                          : 'border-white/15 hover:border-accent/60 hover:scale-[1.01]',
                      ].join(' ')}
                      style={{ width: THUMB_W, height: THUMB_H }}
                      aria-label={previewT('goToItem', { index: i + 1 })}
                      title={thumbTitle}
                    >
                      {thumbSrc ? (
                        <Image
                          src={thumbSrc}
                          alt={thumbTitle}
                          fill
                          unoptimized
                          className="object-contain p-1"
                          sizes="84px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center px-1 text-[10px] text-white/60">
                          {thumbTitle}
                        </div>
                      )}

                      <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-px text-[9px] text-white/80">
                        {i + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-2 bottom-2 w-px bg-white/10" />
          </div>
        </div>
      )}
    </div>
  );
}
