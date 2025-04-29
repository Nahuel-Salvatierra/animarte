'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { toast } from 'react-toastify';

import { useName } from '@/store/useCart';

export default function PDFGuard({ children }: { children: React.ReactNode }) {
  const name = useName((state) => state.getName());
  const hasShownToast = useRef(false);
  const router = useRouter();

  if (name === '' && !hasShownToast.current) {
    toast.error('Por favor, completa el nombre de la tienda');
    hasShownToast.current = true;
    router.replace('/');
  }

  return <>{children}</>;
}
