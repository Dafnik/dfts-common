import {StringOrNumberOr, UndefinedOrNullOr} from '../../types.js';
import {d_is} from './is/is.js';

/**
 * Converts the given date to a Date object. If the date is undefined, null, or an empty string, returns the current date.
 * @param {(undefined|null|string|number|Date)} date - The date to be converted to a Date object.
 * @returns {Date} The Date object.
 */
export const d_from = (date: UndefinedOrNullOr<StringOrNumberOr<Date>>): Date => (date ? (d_is(date) ? date : new Date(date)) : new Date());
