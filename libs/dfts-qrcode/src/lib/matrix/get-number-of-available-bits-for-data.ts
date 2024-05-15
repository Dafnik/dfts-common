import { getNumberOfAvailableBitsByVersion } from './get-number-of-available-bits-by-version';
import { VERSIONS } from './const';

/**
 * Gets the number of bits available for data portions (i.e., excludes ECC
 * bits but includes mode and length bits) in a given version and ECC level.
 *
 * @param {number} version - The version number of the QR code.
 * @param {number} eccLevel - The error correction level.
 * @returns {number} The number of bits available for data portions.
 */
export function getNumberOfAvailableBitsForData(version: number, eccLevel: number): number {
  let numberOfAvailableBits = getNumberOfAvailableBitsByVersion(version) & ~7; // no sub-octet code words
  const v = VERSIONS[version];
  numberOfAvailableBits -= 8 * v![0][eccLevel] * v![1][eccLevel]; // ecc bits
  return numberOfAvailableBits;
}
