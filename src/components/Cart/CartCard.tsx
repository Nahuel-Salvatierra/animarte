import { MinusIcon, PlusIcon } from "lucide-react";
import SafeImage from "../SafeImage";
import { Card, CardContent } from "../ui/card";
import { CartItem } from "@/store/useCartStore";

export default function CartCard({
  item,
  handleAmountChange,
}: {
  item: CartItem;
  handleAmountChange: (amount: number, book: CartItem) => void;
}) {
  return (
    <Card className="w-full p-1">
      <CardContent>
        <div className="flex flex-col justify-between items-center py-2">
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
            />
            <p className="py-1 ">{item.amount}</p>
            <PlusIcon onClick={() => handleAmountChange(+1, item)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
