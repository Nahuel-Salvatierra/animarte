import { MinusIcon, PlusIcon } from 'lucide-react';

import SafeImage from '../SafeImage';
import { Card, CardContent } from '../ui/card';

import { resolveCatalogAssetUrl } from '@/catalog/cdn';
import { CartItem } from '@/store/useCartStore';

export default function CartCard({
  item,
  handleAmountChange,
}: {
  item: CartItem;
  handleAmountChange: (amount: number, cartItem: CartItem) => void;
}) {
  const imageSrc = resolveCatalogAssetUrl(item.reference.coverPath);

  return (
    <Card className="w-full p-1">
      <CardContent>
        <div className="flex flex-col justify-between items-center py-2">
          <div className="flex justify-start items-center">
            <SafeImage
              alt={item.reference.title || ''}
              src={imageSrc}
              width={75}
              height={75}
            />
            <div className="text-center overflow-hidden text-ellipsis max-h-20">
              {item.reference.title}
            </div>
          </div>
          <div className="flex pt-2 w-full justify-around items-center">
            <MinusIcon onClick={() => handleAmountChange(-1, item)} />
            <p className="py-1 ">{item.amount}</p>
            <PlusIcon onClick={() => handleAmountChange(+1, item)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
