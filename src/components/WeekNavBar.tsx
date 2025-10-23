'use client';

import { getWeekDays } from '@/lib/week-helpers';
import clsx from 'clsx';
import { addWeeks, format, isSameDay, subWeeks } from 'date-fns';
import { useState } from 'react';
import { Button } from './Button';
import { AnimatePresence, motion } from 'framer-motion';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300, // 나갈 때 위치
    opacity: 0,
  }),
};

function WeekNavBar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [direction, setDirection] = useState<number>(0);
  const weekDays = getWeekDays(selectedDate);

  const handleClick = (day: Date): void => {
    setSelectedDate(day);
  };

  const goToPreviousWeek = (): void => {
    setDirection(-1);
    setSelectedDate(subWeeks(selectedDate, 1));
  };

  const goToNextWeek = (): void => {
    setDirection(1);
    setSelectedDate(addWeeks(selectedDate, 1));
  };

  return (
    <div className="py-[10px]">
      <div className="relative h-17 overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={weekDays[0].toISOString()}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute top-0 left-0 h-17 grid grid-cols-7 w-full select-none cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                goToNextWeek();
              } else if (info.offset.x > 50) {
                goToPreviousWeek();
              }
            }}
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WeekNavBar;
