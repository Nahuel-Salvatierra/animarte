'use client';

import { useCallback, useEffect, useState } from 'react';

import { resolveCatalogAssetUrl } from '@/catalog/cdn';
import type { CartItem } from '@/store/useCartStore';

type CartItemWithId = CartItem & { id: string };

const DEFAULT_FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function blobToPngDataUrl(blob: Blob): Promise<string> {
  // @react-pdf/renderer only decodes PNG/JPEG; catalog assets are webp.
  const bitmap = await createImageBitmap(blob);
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('canvas unavailable');
    ctx.drawImage(bitmap, 0, 0);
    return canvas.toDataURL('image/png');
  } finally {
    bitmap.close();
  }
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed');
  const blob = await res.blob();
  if (blob.size === 0) throw new Error('empty blob');
  const dataUrl = await blobToPngDataUrl(blob);
  if (!dataUrl.startsWith('data:image/png')) {
    throw new Error('invalid data URL');
  }
  return dataUrl;
}

export function useImageCache(cartItems: CartItemWithId[]) {
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  const [fallbackDataUrl, setFallbackDataUrl] = useState(DEFAULT_FALLBACK);
  const [cacheReady, setCacheReady] = useState(false);

  const getImageDataUrl = useCallback(
    (itemId: string): string => imageCache.get(itemId) ?? fallbackDataUrl,
    [imageCache, fallbackDataUrl],
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      setImageCache(new Map());
      setFallbackDataUrl(DEFAULT_FALLBACK);
      setCacheReady(true);
      return;
    }

    if (typeof window === 'undefined') {
      setCacheReady(true);
      return;
    }

    setCacheReady(false);
    const fallbackUrl = '/error_load_image.png';
    let cancelled = false;

    const run = async () => {
      const fallback = await fetchImageAsDataUrl(fallbackUrl).catch(
        () => DEFAULT_FALLBACK,
      );
      if (cancelled) return;
      setFallbackDataUrl(fallback);

      const next = new Map<string, string>();
      await Promise.all(
        cartItems.map(async (item) => {
          const url = resolveCatalogAssetUrl(item.reference.coverPath);
          if (!url) return;
          try {
            const dataUrl = await fetchImageAsDataUrl(url);
            if (!cancelled) next.set(item.id, dataUrl);
          } catch {
            /* fallback via getImageDataUrl */
          }
        }),
      );

      if (!cancelled) {
        setImageCache(next);
        setCacheReady(true);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  return { getImageDataUrl, cacheReady };
}
