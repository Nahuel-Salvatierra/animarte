import { CommandGroup, CommandItem, CommandList } from 'cmdk';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Button } from '../ui/button';
import { Command } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { frameworks } from './constants';

export default function Dropdown() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

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
                        <AccordionItem value="item-1">
                          <AccordionTrigger>{framework.value}</AccordionTrigger>
                          {framework.subValues.map((subValue) => (
                            <AccordionContent
                              className="cursor-pointer hover:bg-secondary p-2"
                              key={subValue.value}
                            >
                              <Link
                                className="w-full flex"
                                onClick={() => setOpen(false)}
                                href={`/cuadernos/${subValue.value}`}
                              >
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
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Link
                        className="w-full flex"
                        onClick={() => setOpen(false)}
                        href={`/${framework.value}`}
                      >
                        {framework.value}
                      </Link>
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
