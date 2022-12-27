import {DateInput} from '../../types';
import {d_from} from './from';

/**
 * Returns a string with hours, days or months left until date
 * @param {Date} date Date to calculate time left to
 * @param {Date} start Start date (default getApproxCurrentDate())
 * @return string
 */
export const d_timeLeft = (date: DateInput, start?: DateInput): string => {
  date = d_from(date);
  start = d_from(start);

  const days = Math.round((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) {
    const hours = Math.round(Math.abs(date.getTime() - start.getTime()) / (60 * 60 * 1000));
    return hours + 'h';
  } else if (days > 31) {
    const months = date.getFullYear() * 12 + date.getMonth() - (start.getFullYear() * 12 + start.getMonth());
    return months + 'mo';
  } else {
    return days + 'd';
  }
};
