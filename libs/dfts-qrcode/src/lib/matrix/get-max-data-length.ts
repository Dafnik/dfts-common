import { getNumberOfAvailableBitsForData } from './get-number-of-available-bits-for-data';
import { getNumberOfBitsOfData } from './get-number-of-bits-of-data';
import { MODE_ALPHANUMERIC, MODE_KANJI, MODE_NUMERIC, MODE_OCTET } from './const';

/**
 * Returns the maximum length of data possible in a given configuration.
 *
 * @param {number} ver - The version number of the QR code.
 * @param {number} mode - The encoding mode (numeric, alphanumeric, octet, kanji).
 * @param {number} eccLevel - The error correction level.
 * @returns {number} The maximum length of data possible.
 */
export function getMaxDataLength(ver: number, mode: number, eccLevel: number): number {
  const numberOfBits = getNumberOfAvailableBitsForData(ver, eccLevel) - 4 - getNumberOfBitsOfData(ver, mode); // 4 for mode bits
  switch (mode) {
    case MODE_NUMERIC:
      return ((numberOfBits / 10) | 0) * 3 + (numberOfBits % 10 < 4 ? 0 : numberOfBits % 10 < 7 ? 1 : 2);
    case MODE_ALPHANUMERIC:
      return ((numberOfBits / 11) | 0) * 2 + (numberOfBits % 11 < 6 ? 0 : 1);
    case MODE_OCTET:
      return (numberOfBits / 8) | 0;
    case MODE_KANJI:
      return (numberOfBits / 13) | 0;
  }
  return -100;
}
