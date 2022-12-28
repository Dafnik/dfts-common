import {DateInput, UndefinedOr} from '../../types';
import {formatDateBeginning} from './format-date-beginning';
import {d_from} from './from';

export function d_formatWithHoursMinutesAndSeconds(date: string | number | Date): string;
export function d_formatWithHoursMinutesAndSeconds(date: null | undefined): undefined;
export function d_formatWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string>;
/**
 * Returns a string formatted in 'YYYY-MM-DD HH:mm:ss'
 * <br/>If string or date is null, returns <code>undefined</code>
 * @param {string|Date|undefined|null} date
 * @return string|undefined
 */
export function d_formatWithHoursMinutesAndSeconds(date: DateInput): UndefinedOr<string> {
  if (!date) {
    return undefined;
  }

  const d = d_from(date);

  const hour = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');

  return `${formatDateBeginning(d)} ${[hour, minutes, seconds].join(':')}`;
}
