'use client';

import { Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function FloatingHomeButton() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  if (pathname === '/') {
    return null;
  }

  return (
    <Link
      href="/"
      className="fixed left-4 bottom-4 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Ir a la página principal"
    >
      <div className="relative">
        <div
          className={`absolute inset-0 bg-primary/20 rounded-full blur-xl transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`relative flex items-center justify-center w-14 h-14 bg-background border-2 border-primary/20 rounded-full shadow-lg transition-all duration-300 hover:border-primary hover:shadow-xl hover:scale-110 ${
            isHovered ? 'bg-primary/5' : ''
          }`}
        >
          <Home
            className={`w-6 h-6 text-primary transition-all duration-300 ${
              isHovered ? 'scale-110' : ''
            }`}
          />
        </div>
        <div
          className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap bg-foreground text-background px-3 py-1.5 rounded-md text-sm font-medium shadow-lg pointer-events-none transition-all duration-300 ${
            isHovered
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 translate-x-2'
          }`}
        >
          Ir al inicio
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
        </div>
      </div>
    </Link>
  );
}
