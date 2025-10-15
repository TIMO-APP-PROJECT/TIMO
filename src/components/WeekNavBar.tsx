'use client';

import {
  format,
  formatDistance,
  formatRelative,
  parseISO,
  subDays,
} from 'date-fns';
import { ko } from 'date-fns/locale';

// interface {

// }

function WeekNavBar() {
  const today = new Date();
  console.log(today);
  console.log('iso', today.toISOString());
  // console.log('#', format(today, 'yyyy-MM-dd (EEE)', { locale: ko }));

  return (
    <div>
      <div>{'요일'}</div>
      <div>{'날짜'}</div>
    </div>
  );
}

export default WeekNavBar;
