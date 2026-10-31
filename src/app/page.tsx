import { Suspense } from 'react';

import CatalogStore from '@/components/CatalogStore';
import SpinnerScreen from '@/components/Spinner';

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Cuadernos</h1>
      <br />
      <Suspense fallback={<SpinnerScreen />}>
        <CatalogStore category="anime" />
      </Suspense>
    </main>
  );
}
