'use client';

import { useCallback, useEffect, useState } from 'react';

type CartItemWithId = {
  id: string;
  reference: { name: string; images: string[] };
  amount: number;
};

const DEFAULT_FALLBACK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('fetch failed');
  const blob = await res.blob();
  if (blob.size === 0) throw new Error('empty blob');
  const dataUrl = await blobToDataUrl(blob);
  if (!dataUrl || !dataUrl.startsWith('data:')) {
    throw new Error('invalid data URL');
  }
  return dataUrl;
}

export function useImageCache(cartItems: CartItemWithId[]) {
  const [imageCache, setImageCache] = useState<Map<string, string>>(new Map());
  const [fallbackDataUrl, setFallbackDataUrl] = useState<string>(DEFAULT_FALLBACK);
  const [cacheReady, setCacheReady] = useState(false);

  const getImageDataUrl = useCallback(
    (itemId: string): string => {
      return imageCache.get(itemId) ?? fallbackDataUrl;
    },
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
    const proxyBase = `${window.location.origin}/api/proxy-image`;
    const fallbackUrl = `${window.location.origin}/error_load_image.png`;

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
          const url = item.reference.images[0];
          if (!url) return;
          try {
            const dataUrl = await fetchImageAsDataUrl(
              `${proxyBase}?url=${encodeURIComponent(url)}`,
            );
            if (!cancelled) next.set(item.id, dataUrl);
          } catch {
            /* use fallback via getImageDataUrl */
          }
        }),
      );

      if (!cancelled) {
        setImageCache(next);
        setCacheReady(true);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [cartItems]);

  return { getImageDataUrl, cacheReady };
}
