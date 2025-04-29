'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'react-toastify';

import { useName } from '@/store/useCart';
import { useCartStore } from '@/store/useCartStore';

export default function PDFGuard({ children }: { children: React.ReactNode }) {
  const name = useName((state) => state.getName());
  const cartItems = useCartStore((state) => state.cartItems);

  const cartItemsLength = Object.keys(cartItems).length;

  const hasShownToast = useRef(false);
  const router = useRouter();

  if (name === '' && !hasShownToast.current) {
    toast.error('Por favor, completa el nombre de la tienda');
    hasShownToast.current = true;
    router.replace('/');
  }

  if (cartItemsLength === 0 && !hasShownToast.current) {
    hasShownToast.current = true;
    router.replace('/');
  }

  return <>{children}</>;
}
