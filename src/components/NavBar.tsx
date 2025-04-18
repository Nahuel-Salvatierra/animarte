"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "./ui/badge";
import { useCartStore } from "@/store/useCartStore";
import { Sheet, SheetTrigger } from "./ui/sheet";
import Cart from "./Cart";

const frameworks = [
  {
    value: "cuadernos-a4",
    label: "Cuadernos A4",
  },
  {
    value: "cuadernos-a5",
    label: "Cuadernos A5",
  },
  {
    value: "caratulas-a6",
    label: "Cuadernos A6",
  },
  {
    value: "caratulas",
    label: "Caratulas",
  },
];

export function NavBar() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const cartItems = useCartStore((state) => state.cartItems);

  const cartCount = Object.keys(cartItems).length;

  return (
    <div className="w-full justify-center items-center flex flex-row bg-primary">
      <div className="container w-full flex justify-start">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="default"
              role="combobox"
              aria-expanded={open}
              className=" justify-between rounded-none"
            >
              {value
                ? frameworks.find((framework) => framework.value === value)
                    ?.label
                : "Productos"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {frameworks.map((framework) => (
                    <CommandItem
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === framework.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {framework.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Sheet>
          <SheetTrigger asChild>
            <div className="flex items-center cursor-pointer">
              <p className="pr-2 text-secondary">Pedir</p>
              <Badge className="rounded-full h-4 w-4" variant="destructive">
                {cartCount}
              </Badge>
            </div>
          </SheetTrigger>
          <Cart />
        </Sheet>
      </div>
    </div>
  );
}
