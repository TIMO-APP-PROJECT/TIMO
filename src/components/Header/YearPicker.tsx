'use client';

import { formatLocalTime } from '@/lib/time';
import React, { useMemo, useState } from 'react';

export default function YearPicker() {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const nowISO = useMemo(() => new Date().toISOString(), []);
  const todayLabel = formatLocalTime(nowISO, 'MMMM dd');

  const handleClick = (): void => {
    console.log('year button clicked');
  };

  return (
    <div
      className="grid grid-rows-[1fr_1fr] h-9 w-[80px]
        justify-items-end text-right leading-none"
    >
      <div className="text-sm font-semibold text-[#787878]">{todayLabel}</div>
      <button type="button" onClick={handleClick}>
        <span className="text-sm font-semibold text-[#C6C6C6]">{year}</span>
      </button>
    </div>
  );
}
