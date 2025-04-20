"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useShallow } from "zustand/shallow";
import { useCartStore } from "@/store/useCartStore";
import { Book } from "./DriveBookStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

type BookCardProps = {
  book: Book;
  onClick: () => void;
};

const BookCard = ({ book, onClick }: BookCardProps) => {
  const isInCart = useCartStore((state) => state.isInCart);
  const toggleSelect = useCartStore((state) => state.toggleSelect);
  const amountChange = useCartStore((state) => state.amountChange);

  const cartItems = useCartStore(
    useShallow((state) => state.cartItems[book.id] || {})
  );

  const isInCartAmount = isInCart(book.id);

  const handleAmountChange = (amount: number) => {
    const currentAmount = cartItems.amount ?? 0;
    const newAmount = currentAmount + amount;

    if (newAmount < 0) return;

    amountChange(book.id, newAmount, book);
  };

  return (
    <Card className="p-4">
      <CardContent onClick={onClick}>
        <CardTitle className="text-center text-lg font-semibold truncate">
          {book.name}
        </CardTitle>
        <div className="flex flex-col items-center">
          <Carousel className="w-full max-w-xs" opts={{ loop: true }}>
            <CarouselContent>
              {book.images.map((image, index) => (
                <CarouselItem key={index} className="justify-center flex">
                  <Image src={image} alt={book.name} width={200} height={200} />
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
          variant={cartItems.isSelected ? "secondary" : "default"}
          onClick={() => toggleSelect(book.id, book)}
        >
          {isInCartAmount ? "Eliminar" : "Seleccionar"}
        </Button>
        <div className="flex px-2 items-center">
          <div className="mouse-pointer" onClick={() => handleAmountChange(-1)}>
            <MinusIcon />
          </div>
          <CardFooter className="px-4">{cartItems.amount || 0}</CardFooter>
          <div className="mouse-pointer" onClick={() => handleAmountChange(+1)}>
            <PlusIcon />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BookCard;
