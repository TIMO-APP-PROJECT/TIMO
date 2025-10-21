'use client';

import { getWeekDays } from '@/lib/week-helpers';
import clsx from 'clsx';
import { addWeeks, format, isSameDay, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useState } from 'react';
import { Button } from './Button';

function WeekNavBar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);
  const weekDays = getWeekDays(selectedDate);

  const handleClick = (day: Date): void => {
    setSelectedDate(day);
  };

  const goToPreviousWeek = (): void => {
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const goToNextWeek = (): void => {
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setTouchEnd(0);
    setTouchStart(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart === 0) return;
    setTouchEnd(e.clientX);
  };

  const handleSwipeEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNextWeek();
    }

    if (isRightSwipe) {
      goToPreviousWeek();
    }
  };

  const onTouchEnd = () => {
    handleSwipeEnd();
  };

  const onMouseUp = () => {
    handleSwipeEnd();
  };

  const onMouseLeave = () => {
    if (touchStart !== 0) {
      handleSwipeEnd();
    }
  };

  return (
    <div className="py-[10px]">
      <div
        className="h-17 grid grid-cols-7 w-full select-none cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
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
