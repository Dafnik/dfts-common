import { ALPHANUMERIC_MAP, MODE_ALPHANUMERIC, MODE_NUMERIC, MODE_OCTET, MODE_TERMINATOR } from './const';
import { getNumberOfBitsOfData } from './get-number-of-bits-of-data';

/**
 * Returns the code words (sans ECC bits) for given data and configurations.
 * Requires data to be preprocessed by `validateData`. No length check is
 * performed, and everything has to be checked before calling this function.
 *
 * @param {number} version - The version number of the QR code.
 * @param {number} mode - The mode of encoding (numeric, alphanumeric, octet).
 * @param {string | number[]} data - The data to encode.
 * @param {number} maxBufferLength - The maximum buffer length.
 * @returns {number[]} The code words for the given data.
 */
export function encode(version: number, mode: number, data: string | number[], maxBufferLength: number): number[] {
  const buffer: number[] = [];
  let bits = 0,
    remaining = 8;
  const dataLength = data.length;

  // this function is intentionally no-op when n=0.
  const pack = function (x: number, n: number) {
    if (n >= remaining) {
      buffer.push(bits | (x >> (n -= remaining)));
      while (n >= 8) buffer.push((x >> (n -= 8)) & 255);
      bits = 0;
      remaining = 8;
    }
    if (n > 0) bits |= (x & ((1 << n) - 1)) << (remaining -= n);
  };

  const dataNumberOfBits = getNumberOfBitsOfData(version, mode);
  pack(mode, 4);
  pack(dataLength, dataNumberOfBits);

  switch (mode) {
    case MODE_NUMERIC: {
      const stringData = data as string;
      let i = 2;
      for (; i < dataLength; i += 3) {
        pack(parseInt(stringData.substring(i - 2, i + 1), 10), 10);
      }
      pack(parseInt(stringData.substring(i - 2), 10), [0, 4, 7][dataLength % 3]);
      break;
    }
    case MODE_ALPHANUMERIC: {
      const stringData = data as string;
      let i = 1;
      for (; i < dataLength; i += 2) {
        pack(ALPHANUMERIC_MAP[stringData.charAt(i - 1)] * 45 + ALPHANUMERIC_MAP[stringData.charAt(i)], 11);
      }
      if (dataLength % 2 == 1) {
        pack(ALPHANUMERIC_MAP[stringData.charAt(i - 1)], 6);
      }
      break;
    }
    case MODE_OCTET: {
      const arrayData = data as number[];
      let i = 0;
      for (; i < dataLength; i++) {
        pack(arrayData[i], 8);
      }
      break;
    }
  }

  // final bits. it is possible that adding terminator causes the buffer
  // to overflow, but then the buffer truncated to the maximum size will
  // be valid as the truncated terminator mode bits and padding is
  // identical in appearance (cf. JIS X 0510:2004 sec 8.4.8).
  pack(MODE_TERMINATOR, 4);
  if (remaining < 8) buffer.push(bits);

  // the padding to fill up the remaining space. we should not add any
  // words when the overflow already occurred.
  while (buffer.length + 1 < maxBufferLength) buffer.push(0xec, 0x11);
  if (buffer.length < maxBufferLength) buffer.push(0xec);
  return buffer;
}
