'use client';

import Image from 'next/image';
import * as React from 'react';
import { useState } from 'react';

import Cart from '../Cart/Cart';
import { Badge } from '../ui/badge';
import { Sheet, SheetTrigger } from '../ui/sheet';
import Dropdown from './Dropdown';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';

export function NavBar() {
  const cartItems = useCartStore((state) => state.cartItems);
  const [open, setOpen] = useState(true);

  const cartCount = Object.keys(cartItems).length;

  return (
    <div className="w-full justify-center py-2 items-center flex flex-row bg-primary">
      <div className="container w-full gap-2 flex justify-between">
        <div className="flex justify-start">
          <Dropdown />

          <Sheet>
            <SheetTrigger
              asChild
              className="text-secondary inline-flex rounded-md px-3
                      hover:text-primary hover:bg-secondary"
            >
              <Button
                onClick={() => setOpen(true)}
                className="flex items-center  cursor-pointer"
              >
                <p className="tracking-wide">PEDIR</p>
                <Badge className="rounded-full h-4 w-4" variant="destructive">
                  {cartCount}
                </Badge>
              </Button>
            </SheetTrigger>
            <Cart open={open} setOpen={() => setOpen((prev) => !prev)} />
          </Sheet>
        </div>
        <Image
          alt="animarte logo"
          src={'/animarte_logo.png'}
          className="hidden sm:block justify-self-end"
          width={140}
          height={50}
        />
      </div>
    </div>
  );
}
