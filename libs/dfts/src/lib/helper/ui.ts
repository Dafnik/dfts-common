import {s_readTime} from './string/read-time';
import {DateInput} from '../types';
import {d_timeLeft} from './date/time-left';

export class UIHelper {
  /**
   * @deprecated
   * Returns a string with hours, days or months left until date
   * @param {Date} date Date to calculate time left to
   * @param {Date} start Start date (default getApproxCurrentDate())
   * @return string
   */
  static getTimeLeft(date: DateInput, start?: DateInput): string {
    return d_timeLeft(date, start);
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
