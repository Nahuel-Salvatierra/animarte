import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import SafeImage from "./SafeImage";

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
      <SheetHeader>
        <SheetTitle>Solicitud de pedido</SheetTitle>
        <SheetDescription>
          El peidido se descargara en formato PDF.
        </SheetDescription>
      </SheetHeader>
      <SheetDescription className="overflow-y-auto p-2 gap-2 flex flex-row flex-wrap">
        {cartItemsIterable.map((item) => (
          <Card className="w-full" key={item.id}>
            <CardContent>
              <div
                key={item.id}
                className="flex flex-col justify-between items-center py-2"
              >
                <div className="flex justify-start items-center">
                  <SafeImage
                    alt={item.reference.name || ""}
                    src={item.reference.images[0]}
                    width={75}
                    height={75}
                  />
                  <div className="text-center overflow-hidden text-ellipsis max-h-20">
                    {item.reference?.name}
                  </div>
                </div>
                <div className="flex pt-2 w-full justify-around items-center">
                  <MinusIcon
                    className=""
                    onClick={() => handleAmountChange(-1, item)}
                  ></MinusIcon>
                  <p className="py-1 ">{item.amount}</p>
                  <PlusIcon
                    onClick={() => handleAmountChange(+1, item)}
                  ></PlusIcon>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SheetDescription>
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
