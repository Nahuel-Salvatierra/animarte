import { Suspense } from 'react';

import DriveCoverStore from '@/components/DriveCoverStore';
import SpinnerScreen from '@/components/Spinner';

export default function CoverPage() {
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-3xl px-2 font-bold">Caratulas</h1>
      <br />
      <Suspense fallback={<SpinnerScreen />}>
        <DriveCoverStore category="cover" />
      </Suspense>
    </main>
  );
}
