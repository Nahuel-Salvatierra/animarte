'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { Input } from './ui/input';

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [debouncedQuery] = useDebounce(query, 500);

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
    <div className="flex bg-secondary items-center gap-2">
      <Input
        type="text"
        placeholder="Buscar imágenes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border rounded px-4 py-2 w-full"
      />
    </div>
  );
}
