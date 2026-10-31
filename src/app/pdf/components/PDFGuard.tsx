'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

import { useName } from '@/hooks/useName';
import { useCartStore } from '@/store/useCartStore';

export default function PDFGuard({ children }: { children: React.ReactNode }) {
  const name = useName((state) => state.name);
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemsLength = Object.keys(cartItems).length;
  const hasRedirected = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasRedirected.current) return;

    if (!name) {
      hasRedirected.current = true;
      toast.error('Por favor, completa el nombre de la tienda');
      router.replace('/');
      return;
    }

    if (cartItemsLength === 0) {
      hasRedirected.current = true;
      router.replace('/');
    }
  }, [name, cartItemsLength, router]);

  return <>{children}</>;
}
