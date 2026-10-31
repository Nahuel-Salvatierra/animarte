import { useRouter } from 'next/navigation';
import { FormEvent, useRef } from 'react';
import { toast } from 'react-toastify';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { SheetContent, SheetTitle } from '../ui/sheet';
import CartCard from './CartCard';

import { useName } from '@/hooks/useName';
import { CartItem, useCartStore } from '@/store/useCartStore';

export default function Cart({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const cartItems = useCartStore((state) => state.cartItems);
  const handleAmount = useCartStore((state) => state.handleAmount);
  const name = useName((state) => state.name);
  const setName = useName((state) => state.setName);
  const nameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleAmountChange = (delta: number, cartItem: CartItem) => {
    const currentAmount = cartItem.amount ?? 0;
    const newAmount = currentAmount + delta;
    if (newAmount < 0) return;

    handleAmount(
      {
        id: cartItem.reference.id,
        title: cartItem.reference.title,
        category: '',
        kind: 'notebook',
        images: [],
        coverPath: cartItem.reference.coverPath,
      },
      newAmount,
    );
  };

  const cartItemsIterable = Object.entries(cartItems).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const validateName = (value: string): boolean => {
    if (!value) {
      toast.warning('Por favor, completa el nombre de la tienda');
      nameRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const storeName = formData.get('name')?.toString() ?? '';

    if (!validateName(storeName)) return;

    setOpen(false);
    router.push('/pdf');
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  return (
    <>
      {open && (
        <SheetContent>
          <form
            onSubmit={handleOnSubmit}
            className="overflow-y-auto pt-3 pl-4 pr-4 gap-2 flex flex-row flex-wrap"
          >
            <SheetTitle>Solicitud de pedido</SheetTitle>
            Por favor, completa los campos a continuación para generar tu PDF.
            <Label className="text-sm text-muted-foreground">
              Nombre/Tienda
            </Label>
            <Input
              ref={nameRef}
              name="name"
              value={name}
              onChange={handleChange}
            />
            {cartItemsIterable.map((item) => (
              <CartCard
                key={item.id}
                item={item}
                handleAmountChange={handleAmountChange}
              />
            ))}
            <Button className="w-full mb-2" type="submit">
              Generar PDF
            </Button>
          </form>
        </SheetContent>
      )}
    </>
  );
}
