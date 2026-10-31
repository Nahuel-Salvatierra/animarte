'use client';

import { MinusIcon, PlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useShallow } from 'zustand/shallow';

import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardTitle } from './ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './ui/carousel';

import type { CatalogItemView } from '@/catalog/types';
import { useCartStore } from '@/store/useCartStore';

type CatalogCardProps = {
  item: CatalogItemView;
};

const CatalogCard = ({ item }: CatalogCardProps) => {
  const quantity = useCartStore((state) => state.quantity);
  const toggleSelect = useCartStore((state) => state.toggleSelect);
  const handleAmount = useCartStore((state) => state.handleAmount);

  const cartItems = useCartStore(
    useShallow((state) => state.cartItems[item.id] || {}),
  );

  const updateAmount = (delta: number) => {
    const currentAmount = cartItems.amount ?? 0;
    const newAmount = currentAmount + delta;
    if (newAmount < 0) return;
    handleAmount(item, newAmount);
  };

  return (
    <Card className="p-4" data-testid="catalog-card">
      <CardContent>
        <CardTitle className="text-center text-lg font-semibold truncate">
          {item.title}
        </CardTitle>
        <div className="flex flex-col items-center">
          <Carousel className="w-full max-w-xs" opts={{ loop: true }}>
            <CarouselContent>
              {item.images.map((image, index) => (
                <CarouselItem key={index} className="justify-center flex">
                  <Image
                    src={image}
                    alt={item.title}
                    width={200}
                    height={200}
                    loading="lazy"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      </CardContent>
      <div className="flex justify-between w-full">
        <Button
          variant={cartItems.isSelected ? 'secondary' : 'default'}
          onClick={() => toggleSelect(item)}
        >
          {quantity(item.id) ? 'Eliminar' : 'Seleccionar'}
        </Button>
        <div className="flex px-2 items-center">
          <div className="mouse-pointer" onClick={() => updateAmount(-1)}>
            <MinusIcon />
          </div>
          <CardFooter className="px-4">{cartItems.amount || 0}</CardFooter>
          <div className="mouse-pointer" onClick={() => updateAmount(+1)}>
            <PlusIcon />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CatalogCard;
