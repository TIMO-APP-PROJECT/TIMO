'use client';

import { getWeekDays } from '@/lib/week-helpers';
import clsx from 'clsx';
import { addWeeks, format, isSameDay, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { Button } from './Button';

function WeekNavBar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const weekDays = getWeekDays(selectedDate);

  const handleClick = (day: Date): void => {
    console.log('day button clicked');
    setSelectedDate(day);
  };

  const goToPreviousWeek = (): void => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const goToNextWeek = (): void => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  return (
    <div className="py-[10px]">
      <div className="h-17 grid grid-cols-7 w-full">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const dayFormat = format(day, 'EEEEE');
          const dateFormat = format(day, 'd');

          return (
            <Button
              key={day.toISOString()}
              onClick={() => handleClick(day)}
              className={clsx(
                'h-17 w-10 rounded-3xl font-pretendard',
                isSelected
                  ? 'bg-[linear-gradient(164.54deg,#1A1B1E_10.45%,#565A5F_88.47%)] text-white'
                  : 'bg-white text-[#979797]'
              )}
            >
              <div className="font-normal text-xs">{dayFormat}</div>
              <div className="font-bold text-lg">{dateFormat}</div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekNavBar;
