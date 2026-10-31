'use client';

import dynamic from 'next/dynamic';

import SpinnerScreen from '@/components/Spinner';

const ClientWrapper = dynamic(() => import('./components/ClientWrapper'), {
  ssr: false,
  loading: () => <SpinnerScreen />,
});

export default function Page() {
  return (
    <div className="p-5 h-[90vh] gap-4 flex flex-col container">
      <ClientWrapper />
    </div>
  );
}
