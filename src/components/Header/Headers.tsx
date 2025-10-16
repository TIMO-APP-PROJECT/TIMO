'use client';

import { startOfWeek } from 'date-fns';
import logo from '../../../public/images/logo-img.png';
import Image from 'next/image';

export default function Headers({ right }: { right?: React.ReactNode }) {
  console.log('#', startOfWeek(new Date(), { weekStartsOn: 1 }));

  return (
    <header className="h-17 flex items-center justify-between">
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
