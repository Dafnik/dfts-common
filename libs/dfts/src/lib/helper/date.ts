import {DateInput, UndefinedOr} from '../types';
import {d_format} from './date/format-date';
import {d_formatWithHoursMinutesAndSeconds} from './date/format-date-with-hours-minutes-seconds';
import {d_timespan} from './date/timespan';

/**
 * @deprecated
 */
export class DateHelper {
  /**
   * @deprecated
   * @param date
   */
  static getFormattedWithHoursMinutesAndSeconds(date: string | number | Date): string;
  /**
   * @deprecated
   * @param date
   */
  static getFormattedWithHoursMinutesAndSeconds(date: null | undefined): undefined;

  /**
   * @deprecated
   * Returns a string formatted in 'YYYY-MM-DD HH:mm:ss'
   * If string or date is null, returns <code>null</code>
   * @param {string|Date|undefined|null} date
   * @return string|undefined
   */
  static getFormattedWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string> {
    return d_formatWithHoursMinutesAndSeconds(date);
  }

  static getFormatted(date: string | number | Date): string;
  static getFormatted(date: null | undefined): undefined;
  /**
   * @deprecated
   * Returns a string formatted in 'YYYY-MM-DD'
   * If string or date is null, returns <code>null</code>
   * @param {string|Date|undefined|null} date
   * @return string|undefined
   */
  static getFormatted(date: DateInput): UndefinedOr<string> {
    return d_format(date);
  }

  /**
   * @deprecated
   * @param dateNow
   * @param dateFuture
   */
  static getTimeSpan(dateNow: DateInput, dateFuture: DateInput): string {
    return d_timespan(dateNow, dateFuture);
  }
}
