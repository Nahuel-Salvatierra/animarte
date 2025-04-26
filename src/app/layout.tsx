import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ToastContainer } from 'react-toastify';

import './globals.css';

import { NavBar } from '@/components/NavBar/NavBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Animarte',
  description: 'Fabricantes de cuadernos personalizados, agendas y más',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="w-full flex sticky top-0 z-50 bg-primary">
          <NavBar />
        </div>
        <div className="flex flex-col w-full items-center">
          <ToastContainer theme="dark" />
          {children}
        </div>
      </body>
    </html>
  );
}
