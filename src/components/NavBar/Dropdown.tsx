import { CommandList, CommandGroup, CommandItem } from "cmdk";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Command } from "../ui/command";
import { frameworks } from "./constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Link from "next/link";

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          role="combobox"
          aria-expanded={open}
          className=" justify-between uppercase tracking-wide rounded-md ml-2 sm:ml-0 hover:bg-secondary hover:text-primary"
        >
          Productos
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2 mt-3 ml-2">
        <Command>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <div key={framework.value}>
                  {framework.subValues ? (
                    <CommandItem>
                      <Accordion
                        type="single"
                        collapsible
                        className="cursor-pointer"
                      >
                        <AccordionItem value="item-1" >
                          <AccordionTrigger>{framework.value}</AccordionTrigger>
                          {framework.subValues.map((subValue) => (
                            <AccordionContent
                              className="cursor-pointer hover:bg-secondary p-2"
                              key={subValue.value}
                            >
                              <Link className="w-full flex" onClick={() => setOpen(false)} href={`/cuadernos/${subValue.value}`}>
                                {subValue.label}
                              </Link>
                            </AccordionContent>
                          ))}
                        </AccordionItem>
                      </Accordion>
                    </CommandItem>
                  ) : (
                    <CommandItem
                      className="cursor-pointer uppercase hover:bg-secondary p-2"
                      key={framework.value}
                      value={framework.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      {framework.label}
                    </CommandItem>
                  )}
                </div>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
