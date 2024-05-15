import { MODE_ALPHANUMERIC, MODE_KANJI, MODE_NUMERIC, MODE_OCTET } from './const';

/**
 * Returns the number of bits required for the length of data.
 * (cf. Table 3 in JIS X 0510:2004 p. 16)
 *
 * @param {number} ver - The version number of the QR code.
 * @param {number} mode - The encoding mode (numeric, alphanumeric, octet, kanji).
 * @returns {number} The number of bits required for the length of data.
 */
export function getNumberOfBitsOfData(ver: number, mode: number): 10 | 12 | 14 | 9 | 11 | 13 | 8 | 16 | -100 {
  switch (mode) {
    case MODE_NUMERIC:
      return ver < 10 ? 10 : ver < 27 ? 12 : 14;
    case MODE_ALPHANUMERIC:
      return ver < 10 ? 9 : ver < 27 ? 11 : 13;
    case MODE_OCTET:
      return ver < 10 ? 8 : 16;
    case MODE_KANJI:
      return ver < 10 ? 8 : ver < 27 ? 10 : 12;
  }
  return -100;
}
