/**
 * Returns a random integer number
 * @param {number} min Minimum number of random number
 * @param {number} max Maximum number of random number
 * @return number
 */
export function n_generate_int(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * Returns a random float number
 * @param {number} min Minimum number of random number
 * @param {number} max Maximum number of random number
 * @param {number} decimals Decimals of new random float
 * @return number
 */
export function n_generate_float(min: number, max: number, decimals: number): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);

  return parseFloat(str);
}
