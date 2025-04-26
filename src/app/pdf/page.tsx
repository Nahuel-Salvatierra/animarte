'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

import CatalogPDF from './components/CatalogPDF';

import { useCartStore } from '@/store/useCartStore';

const DownloadButton = dynamic(() => import('./components/DownloadButton'), {
  ssr: false,
});

export default function Page() {
  const cartItemsRaw = useCartStore((state) => state.cartItems);
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
    <div className="p-5 h-[90vh] gap-4 flex flex-col container">
      <DownloadButton onDownload={handleOnDownload} />
      <h1 className="text-2xl mb-4">Vista previa</h1>
      {cartItems.length > 0 && (
        <div className="w-full h-full">
          <div className="w-full h-[90%]">
            <CatalogPDF cartItems={cartItems} />
          </div>
        </div>
      )}
    </div>
  );
}
