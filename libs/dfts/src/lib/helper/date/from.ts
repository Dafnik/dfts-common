import {StringOrNumberOr, UndefinedOrNullOr} from '../../types';
import {t_isDate} from '../type';

/**
 * Converts the given date to a Date object. If the date is undefined, null, or an empty string, returns the current date.
 * @param {(undefined|null|string|number|Date)} date - The date to be converted to a Date object.
 * @returns {Date} The Date object.
 */
export const d_from = (date: UndefinedOrNullOr<StringOrNumberOr<Date>>): Date =>
  date ? (t_isDate(date) ? date : new Date(date)) : new Date();
