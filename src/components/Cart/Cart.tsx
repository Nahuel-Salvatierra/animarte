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
  const setName = useName((state) => state.setName);
  const nameRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleAmountChange = (amount: number, cartItem: CartItem) => {
    const currentAmount = cartItem.amount ?? 0;
    const newAmount = currentAmount + amount;

    if (newAmount < 0) return;

    handleAmount(cartItem.reference.id, newAmount, cartItem.reference);
  };

  const cartItemsIterable = Object.entries(cartItems).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  const validateName = (name: string): boolean => {
    if (!name) {
      toast.warning('Por favor, completa el nombre de la tienda');
      nameRef.current?.focus();
      return false;
    }
    return true;
  };

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name')?.toString() ?? '';

    if (!validateName(name)) return;

    setOpen(false);
    router.push('/pdf');
  };

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setName(value);
  };

  return (
    <>
      {open && (
        <SheetContent>
          <form
            onSubmit={(e) => handleOnSubmit(e)}
            className="overflow-y-auto pt-3 pl-4 pr-4 gap-2 flex flex-row flex-wrap"
          >
            <SheetTitle>Solicitud de pedido</SheetTitle>
            Por favor, completa los campos a continuación para que podamos
            procesar tu pedido.
            <Label className="text-sm text-muted-foreground">
              Nombre/Tienda
            </Label>
            <Input ref={nameRef} name="name" onChange={handleChange} />
            {cartItemsIterable.map((item) => (
              <CartCard
                key={item.id}
                item={item}
                handleAmountChange={handleAmountChange}
              />
            ))}
            <Button className="w-full mb-2" type="submit">
              Enviar
            </Button>
          </form>
        </SheetContent>
      )}
    </>
  );
}
