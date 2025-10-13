import { formatInTimeZone } from 'date-fns-tz';

// const now = new Date();
// const utcISO = now.toISOString();

const TIMEZONE = 'Asia/Seoul';

export function getUTCNowISO() {
  return new Date().toISOString();
}

// UTC -> 로컬 시간 문자열
export function formatLocalTime(utcISO: string, format = 'yyyy-mm-dd HH:mm') {
  return formatInTimeZone(utcISO, TIMEZONE, format);
}
