/**
 * Converts a time in minutes to a human-readable string.
 * @param {number} time - The time in minutes.
 * @returns {string} - The time in the format "Xm" where X is the number of minutes, or "> 1m" if the time is less than 0.5 minutes.
 */
export const n_humanizeTime = (time: number): string => (time < 0.5 ? '> 1m' : time >= 0.5 && time < 1.5 ? '1m' : `${Math.ceil(time)}m`);
