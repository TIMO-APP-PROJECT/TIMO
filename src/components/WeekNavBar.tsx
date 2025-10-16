'use client';

import { getWeekDays } from '@/lib/week-helpers';
import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';

function WeekNavBar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const weekDays = getWeekDays(selectedDate);

  const handleClick = (): void => {
    console.log('day button clicked');
  };

  return (
    <div className="py-[10px]">
      <div className="h-17 grid grid-cols-7 w-full">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayFormat = format(day, 'EEEEE');
          const dateFormat = format(day, 'd');
          return (
            <button
              key={day.toISOString()}
              onClick={handleClick}
              className="h-17 w-10 "
            >
              <div>{dayFormat}</div>
              <div>{dateFormat}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekNavBar;
