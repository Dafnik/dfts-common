import { DateInput } from '../../types';
import { d_from } from './from';

export function formatDateBeginning(date: DateInput): string {
  const d = d_from(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return [year, month, day].join('-');
}
