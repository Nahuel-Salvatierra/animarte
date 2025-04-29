'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import CatalogPDF from './CatalogPDF';

import { useName } from '@/store/useCart';
import { useCartStore } from '@/store/useCartStore';

const DownloadButton = dynamic(() => import('./DownloadButton'), {
  ssr: false,
});

export default function ClientWrapper() {
  const cartItemsRaw = useCartStore((state) => state.cartItems);
  const name = useName((state) => state.name);

  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

  const cartItems = useMemo(
    () =>
      Object.entries(cartItemsRaw).map(([key, value]) => ({
        id: key,
        ...value,
      })),
    [cartItemsRaw],
  );

  const handleOnDownload = () => {
    clearCart();
    router.push('/');
    toast.success('Pedido recibido');
  };

  return (
    <>
      <DownloadButton onDownload={handleOnDownload} />
      <h1 className="text-2xl mb-4">Vista previa</h1>
      {cartItems.length > 0 && (
        <div className="w-full h-full">
          <div className="w-full h-[90%]">
            <CatalogPDF name={name} cartItems={cartItems} />
          </div>
        </div>
      )}
    </>
  );
}
