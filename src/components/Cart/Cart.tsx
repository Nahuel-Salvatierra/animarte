import { Button } from "../ui/button";

import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import CartCard from "./CartCard";

export default function Cart() {
  const cartItems = useCartStore((state) => state.cartItems);
  const onAmountChange = useCartStore((state) => state.amountChange);

  const router = useRouter();

  const handleAmountChange = (amount: number, book: CartItem) => {
    const currentAmount = book.amount ?? 0;
    const newAmount = currentAmount + amount;

    if (newAmount < 0) return;

    onAmountChange(book.reference.id, newAmount, book.reference);
  };

  const cartItemsIterable = Object.entries(cartItems).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  return (
    <SheetContent>
      <SheetHeader className="pb-0">
        <SheetTitle>Solicitud de pedido</SheetTitle>
        <SheetDescription>
          El peidido se descargara en formato PDF.
        </SheetDescription>
      </SheetHeader>
      <div className="overflow-y-auto p-2 gap-2 flex flex-row flex-wrap">
        {cartItemsIterable.map((item) => (
          <CartCard
            key={item.id}
            item={item}
            handleAmountChange={handleAmountChange}
          />
        ))}
      </div>
      <SheetFooter>
        <SheetClose asChild>
          <Button type="button" onClick={() => router.push("/pdf")}>
            Enviar
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
