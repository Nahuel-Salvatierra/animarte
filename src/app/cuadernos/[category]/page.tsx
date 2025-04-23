import DriveBookStore from '@/components/DriveBookStore';

type Params = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;

  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Cuadernos</h1>
      <br />
      <DriveBookStore category={category} />
    </main>
  );
}
