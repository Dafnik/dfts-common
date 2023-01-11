import {DateInput} from '../../../types';
import {d_from} from '../from';

/**
 * Calculates the difference between two dates in terms of days, hours, minutes, and seconds.
 * @param {DateInput} dateNow - The current date.
 * @param {DateInput} dateFuture - The future date to compare with.
 * @returns {string} A string representation of the timespan in the format "Xd, Yh, Zm, As", where X is the number
 * of days, Y is the number of hours, Z is the number of minutes, and A is the number of seconds.
 */
export const d_timespan = (dateNow: DateInput, dateFuture: DateInput): string => {
  dateNow = d_from(dateNow);
  dateFuture = d_from(dateFuture);

  const delta = Math.abs(dateFuture.getTime() - dateNow.getTime()) / 1000;

  const days = Math.floor(delta / 86400);
  const daysMultiplied = days * 86400;
  const hours = Math.floor((delta - daysMultiplied) / 3600);
  const hoursMultiplied = hours * 3600;
  const minutes = Math.floor((delta - daysMultiplied - hoursMultiplied) / 60);
  const seconds = Math.floor(delta - daysMultiplied - hoursMultiplied - minutes * 60);

  return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
};
