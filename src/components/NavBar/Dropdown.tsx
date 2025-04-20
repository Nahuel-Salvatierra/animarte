import { CommandList, CommandGroup, CommandItem } from "cmdk";
import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Command } from "../ui/command";

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
          {value
            ? frameworks.find((framework) => framework.value === value)?.label
            : frameworks[0].label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-2 mt-3 ml-2">
        <Command>
          <CommandList>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  className="cursor-pointer hover:bg-secondary p-2"
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
