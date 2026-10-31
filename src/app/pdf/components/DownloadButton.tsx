'use client';

import { pdf } from '@react-pdf/renderer';
import { DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/button';
import type { CartItem } from '@/store/useCartStore';

import { OrderPdfDocument } from '../lib/OrderPdfDocument';

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

  const downloadPdf = async () => {
    const items = cartItems.map((item) => ({
      title: item.reference.title,
      amount: item.amount,
      imageDataUrl: getImageDataUrl(item.id),
    }));

    const blob = await pdf(
      <OrderPdfDocument storeName={name} items={items} />,
    ).toBlob();

    const fileName = `pedido-${name}-${new Date().toISOString().split('T')[0]}.pdf`;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const handleClick = async () => {
    if (cartItems.length === 0 || !cacheReady) return;
    setLoading(true);
    try {
      await downloadPdf();
      onSuccess?.();
    } catch (error) {
      console.error('Error al generar PDF:', error);
      toast.error('No se pudo generar el PDF');
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || cartItems.length === 0 || !cacheReady;

  return (
    <Button
      disabled={disabled}
      onClick={() => void handleClick()}
      variant="default"
      className="md:max-w-[30%]"
    >
      {loading ? (
        <>
          <div className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full" />
          <div>Generando PDF...</div>
        </>
      ) : !cacheReady && cartItems.length > 0 ? (
        <div className="flex truncate items-center gap-2">
          Cargando imágenes...
        </div>
      ) : (
        <div className="flex truncate items-center gap-2">
          Descargar PDF <DownloadIcon />
        </div>
      )}
    </Button>
  );
}
