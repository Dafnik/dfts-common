import {DateInput, UndefinedOr} from '../../../types.js';
import {formatDateBeginning} from '../format-date-beginning.js';
import {d_from} from '../from.js';

export function d_format(date: string | number | Date): string;
export function d_format(date: null | undefined): undefined;
export function d_format(date: DateInput): UndefinedOr<string>;
/**
 * Returns a string formatted in 'YYYY-MM-DD'
 * If string or date is null, returns <code>null</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function d_format(date: DateInput): UndefinedOr<string> {
  return date ? formatDateBeginning(d_from(date)) : undefined;
}
