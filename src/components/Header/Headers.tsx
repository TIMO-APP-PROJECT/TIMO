'use client';

import logo from '../../../public/images/logo-img.png';
import Image from 'next/image';

export default function Headers({ right }: { right?: React.ReactNode }) {
  return (
    <header className="pt-safe-50 h-17 flex items-center justify-between ">
      <Image
        src={logo}
        alt="logo"
        width={70}
        height={20}
        className="object-contain"
      />
      {right}
    </header>
  );
}
