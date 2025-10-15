'use client';

import logo from '../../public/images/logo-img.png';
import Image from 'next/image';

export default function Headers({ right }: { right?: React.ReactNode }) {
  return (
    <header className="pt-safe-50 px-5 h-17 flex items-center justify-between">
      {/* <div className="flex items-center gap-2 justify-between"> */}
      <Image
        src={logo}
        alt="logo"
        width={70}
        height={20}
        className="object-contain"
      />
      {right}
      {/* </div> */}
    </header>
  );
}
