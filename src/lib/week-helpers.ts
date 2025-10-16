import { addDays, startOfWeek } from 'date-fns';

export function getStartOfWeek(date: Date): Date {
  const startDate = startOfWeek(date, { weekStartsOn: 1 });
  return startDate;
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = getStartOfWeek(date);

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}
