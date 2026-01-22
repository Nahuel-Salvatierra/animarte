'use client';

import { SendIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { CartItem } from '@/store/useCartStore';

import type { PdfCatalogItem } from '../lib/buildCatalogHtml';
import { buildCatalogHtml } from '../lib/buildCatalogHtml';

type CartItemWithId = CartItem & { id: string };

export default function DownloadButton({
  name,
  cartItems,
  getImageDataUrl,
  cacheReady,
  onSuccess,
}: {
  name: string;
  cartItems: CartItemWithId[];
  getImageDataUrl: (itemId: string) => string;
  cacheReady: boolean;
  onSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const downloadAndSend = async () => {
    const catalogItems: PdfCatalogItem[] = cartItems.map((item) => ({
      reference: { name: item.reference.name },
      amount: item.amount,
      imageDataUrl: getImageDataUrl(item.id),
    }));

    const html = buildCatalogHtml(name, catalogItems);
    const fileName = `pedido-${name}-${new Date().toISOString().split('T')[0]}.html`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    const res = await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ html }),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      throw new Error(data?.error ?? 'Error al enviar');
    }
  };

  const handleClick = async () => {
    if (cartItems.length === 0 || !cacheReady) return;
    setLoading(true);
    try {
      await downloadAndSend();
      onSuccess?.();
    } catch (error) {
      console.error('Error al descargar o enviar:', error);
    } finally {
      setLoading(false);
    }
  };

  const disabled =
    loading || cartItems.length === 0 || !cacheReady;

  return (
    <Button
      disabled={disabled}
      onClick={handleClick}
      variant="default"
      className="md:max-w-[30%]"
    >
      {loading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
          <div>Procesando...</div>
        </>
      ) : !cacheReady && cartItems.length > 0 ? (
        <div className="flex truncate items-center gap-2">
          Cargando imágenes...
        </div>
      ) : (
        <div className="flex truncate items-center gap-2">
          Descargar y Enviar <SendIcon />
        </div>
      )}
    </Button>
  );
}
