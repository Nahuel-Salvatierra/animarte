'use client';

import { LucidePenSquare, SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from './ui/input';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [debouncedQuery] = useDebounce(query, 500);
  const ref = useRef<HTMLInputElement>(null);

  const updateQueryParams = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('query', value);
    } else {
      params.delete('query');
    }
    router.push(`?${params.toString()}`);
  };

  useEffect(() => {
    updateQueryParams(debouncedQuery);
  }, [debouncedQuery]);

  return (
    <div className="flex bg-secondary justify-start h-7 transition-all duration-0 rounded-md items-center">
      <SearchIcon
        className="w-7 hover:scale-110 transition-all ease-in-out h-4 text-primary"
        onClick={() => ref.current?.focus()}
      />
      <Input
        ref={ref}
        type="text"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-none w-0 px-0 max-w-screen absolute top-14
                  opacity-0
                  transition-all duration-100 ease-in-out
                  focus-visible:ring-2 focus:px-2 focus:opacity-100 focus:visible focus:w-[96%] h-7
                  sm:relative sm:top-0 right-2 sm:focus-visible:ring-0"
      />
    </div>
  );
}
