import { Suspense } from 'react';

import DriveBookStore from '@/components/DriveBookStore';
import SpinnerScreen from '@/components/Spinner';

type Params = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Cuadernos</h1>
      <br />
      <Suspense fallback={<SpinnerScreen />}>
        <DriveBookStore category={category} />
      </Suspense>
    </main>
  );
}
