'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [imageError, setImageError] = useState(false);
  
  // Update this path to match your logo filename
  // Place your logo file in: public/realself-logo.png (or .jpg, .svg)
  const logoPath = '/realself-logo.png';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <nav className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            {!imageError ? (
              <Image
                src={logoPath}
                alt="RealSelf"
                width={150}
                height={40}
                className="h-8 sm:h-10 md:h-12 w-auto"
                priority
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <span className="text-2xl sm:text-3xl md:text-4xl font-black text-black tracking-tight uppercase">
                REALSELF
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}

