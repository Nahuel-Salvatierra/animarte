import DriveBookStore from "@/components/DriveBookStore";

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Cuadernos</h1>
      <br />
      <DriveBookStore />
    </main>
  );
}
