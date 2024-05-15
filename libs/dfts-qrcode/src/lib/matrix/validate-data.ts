import { ALPHANUMERIC_REGEXP, MODE_ALPHANUMERIC, MODE_NUMERIC, MODE_OCTET, NUMERIC_REGEXP } from './const';

/**
 * Checks if the given data can be encoded in the given mode and returns
 * the converted data for further processing if possible. Otherwise, returns null.
 *
 * This function does not check the length of data; it is the duty of
 * the encode function (as it depends on the version and ECC level too).
 *
 * @param {number} mode - The encoding mode (numeric, alphanumeric, octet).
 * @param {string | number} data - The data to be validated and converted.
 * @returns {string | number[] | undefined} The validated and converted data, or undefined if not valid.
 */
export function validateData(mode: number, data: string | number): string | number[] | undefined {
  switch (mode) {
    case MODE_NUMERIC:
      if (typeof data === 'number') return data.toString();
      if (!data.match(NUMERIC_REGEXP)) return undefined;
      return data;

    case MODE_ALPHANUMERIC:
      const stringData = data as string;
      if (!stringData.match(ALPHANUMERIC_REGEXP)) return undefined;
      return stringData.toUpperCase();

    case MODE_OCTET: {
      const stringData = data as string;
      const newData: number[] = [];
      for (let i = 0; i < stringData.length; i++) {
        const char = stringData.charCodeAt(i);
        if (char < 0x80) {
          newData.push(char);
        } else if (char < 0x800) {
          newData.push(0xc0 | (char >> 6), 0x80 | (char & 0x3f));
        } else if (char < 0x10000) {
          newData.push(0xe0 | (char >> 12), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
        } else {
          newData.push(0xf0 | (char >> 18), 0x80 | ((char >> 12) & 0x3f), 0x80 | ((char >> 6) & 0x3f), 0x80 | (char & 0x3f));
        }
      }
      return newData;
    }
  }
  return undefined;
}
