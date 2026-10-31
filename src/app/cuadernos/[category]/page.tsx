import { Suspense } from 'react';

import { NOTEBOOK_CATEGORIES } from '@/catalog/categories';
import CatalogStore from '@/components/CatalogStore';
import SpinnerScreen from '@/components/Spinner';

type Params = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return NOTEBOOK_CATEGORIES.map((category) => ({
    category: category.id,
  }));
}

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Cuadernos</h1>
      <br />
      <Suspense fallback={<SpinnerScreen />}>
        <CatalogStore category={category} />
      </Suspense>
    </main>
  );
}
