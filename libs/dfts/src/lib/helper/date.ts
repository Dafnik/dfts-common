import {StringOrNumberOr, UndefinedOr, UndefinedOrNullOr} from '../types';
import {isDate} from './type';
import {toDate} from './converter';

export type DateInput = UndefinedOrNullOr<StringOrNumberOr<Date>>;

export const coerceDate = (date: DateInput): Date => (isDate(date) ? date : toDate(date));

export function formatDateWithHoursMinutesAndSeconds(date: string | number | Date): string;
export function formatDateWithHoursMinutesAndSeconds(date: null | undefined): undefined;
export function formatDateWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string>;
/**
 * Returns a string formatted in 'YYYY-MM-DD HH:mm:ss'
 * <br/>If string or date is null, returns <code>undefined</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function formatDateWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string> {
  if (!date) {
    return undefined;
  }

  const d = coerceDate(date);

  const hour = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return `${formatDateBeginning(d)} ${[hour, minutes, seconds].join(':')}`;
}

export function formatDate(date: string | number | Date): string;
export function formatDate(date: null | undefined): undefined;
export function formatDate(date: DateInput): UndefinedOr<string>;
/**
 * Returns a string formatted in 'YYYY-MM-DD'
 * If string or date is null, returns <code>null</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function formatDate(date: DateInput): UndefinedOr<string> {
  return date ? formatDateBeginning(coerceDate(date)) : undefined;
}

function formatDateBeginning(date: DateInput): string {
  const d = coerceDate(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return [year, month, day].join('-');
}

export const timespan = (dateNow: DateInput, dateFuture: DateInput): string => {
  dateNow = coerceDate(dateNow);
  dateFuture = coerceDate(dateFuture);

  const delta = Math.abs(dateFuture.getTime() - dateNow.getTime()) / 1000;

  const days = Math.floor(delta / 86400);
  const hours = Math.floor((delta - days * 86400) / 3600);
  const minutes = Math.floor((delta - days * 86400 - hours * 3600) / 60);
  const seconds = Math.floor(delta - days * 86400 - hours * 3600 - minutes * 60);

  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
};

/**
 * @deprecated
 */
export class DateHelper {
  static getFormattedWithHoursMinutesAndSeconds(date: string | number | Date): string;
  static getFormattedWithHoursMinutesAndSeconds(date: null | undefined): undefined;

  /**
   * Returns a string formatted in 'YYYY-MM-DD HH:mm:ss'
   * If string or date is null, returns <code>null</code>
   * @param {string|Date|undefined|null} date
   * @return string|undefined
   */
  static getFormattedWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string> {
    return formatDateWithHoursMinutesAndSeconds(date);
  }

  static getFormatted(date: string | number | Date): string;
  static getFormatted(date: null | undefined): undefined;
  /**
   * Returns a string formatted in 'YYYY-MM-DD'
   * If string or date is null, returns <code>null</code>
   * @param {string|Date|undefined|null} date
   * @return string|undefined
   */
  static getFormatted(date: DateInput): UndefinedOr<string> {
    return formatDate(date);
  }

  static getTimeSpan(dateNow: DateInput, dateFuture: DateInput): string {
    return timespan(dateNow, dateFuture);
  }
}
