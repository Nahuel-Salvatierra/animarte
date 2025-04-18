import { ChevronDownSquareIcon, ChevronUpSquareIcon } from "lucide-react";
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
          El peidido se enviara a travez de WhatsApp en formato PDF.
        </SheetDescription>
      </SheetHeader>
      <SheetFooter className="overflow-y-auto">
        {cartItemsIterable.map((item) => (
          <Card key={item.id}>
            <CardContent>
              <div
                key={item.id}
                className="flex justify-between items-center py-2"
              >
                <div className="flex justify-start items-center">
                  <SafeImage
                    alt={item.reference.name || ""}
                    src={item.reference.images[0]}
                    width={50}
                    height={50}
                  />
                  <p className=" truncate text-start">{item.reference?.name}</p>
                </div>
                <div className="flex flex-col items-center">
                  <ChevronUpSquareIcon
                    className=""
                    onClick={() => handleAmountChange(+1, item)}
                  ></ChevronUpSquareIcon>
                  <p className="py-1 ">{item.amount}</p>
                  <ChevronDownSquareIcon
                    onClick={() => handleAmountChange(-1, item)}
                  ></ChevronDownSquareIcon>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </SheetFooter>
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
