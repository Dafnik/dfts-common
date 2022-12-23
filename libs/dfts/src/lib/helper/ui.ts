import {coerceDate, DateInput} from './date';
import {s_readTime} from './string/read-time';

/**
 * Returns a string with hours, days or months left until date
 * @param {Date} date Date to calculate time left to
 * @param {Date} start Start date (default getApproxCurrentDate())
 * @return string
 */
export const getTimeLeft = (date: DateInput, start?: DateInput): string => {
  date = coerceDate(date);
  start = coerceDate(start);

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

export class UIHelper {
  /**
   * @deprecated
   * Returns a string with hours, days or months left until date
   * @param {Date} date Date to calculate time left to
   * @param {Date} start Start date (default getApproxCurrentDate())
   * @return string
   */
  static getTimeLeft(date: DateInput, start?: DateInput): string {
    return getTimeLeft(date, start);
  }

  /**
   * @deprecated
   * @param text
   * @param imageCounter
   */
  static getReadTime(text: string, imageCounter = 0): string {
    return s_readTime(text, imageCounter);
  }
}
