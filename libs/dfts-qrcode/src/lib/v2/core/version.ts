// Generator polynomial used to encode version information
import { getBCHDigit, getSymbolTotalCodewords } from './utils';
import { ALPHANUMERIC, BYTE, getCharCountIndicator, KANJI, MIXED, Mode, NUMERIC } from './mode';
import { ErrorCorrectionLevel, fromErrorCorrectionLevel, M } from './error-correction-level';
import { Segment } from './segments';
import { isValidVersion } from './version-check';
import { getTotalCodewordsCount } from './error-correction-code';
import { AbstractData } from './abstract-data';

const G18 = (1 << 12) | (1 << 11) | (1 << 10) | (1 << 9) | (1 << 8) | (1 << 5) | (1 << 2) | (1 << 0);
const G18_BCH = getBCHDigit(G18);

function getBestVersionForDataLength(mode: Mode, length: number, errorCorrectionLevel: ErrorCorrectionLevel): number {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
      return currentVersion;
    }
  }

  throw new Error('No version found for data length');
}

function getReservedBitsCount(mode: Mode, version: number): number {
  // Character count indicator + mode indicator bits
  return getCharCountIndicator(mode, version) + 4;
}

function getTotalBitsFromDataArray(segments: AbstractData[], version: number): number {
  let totalBits = 0;

  segments.forEach((data) => {
    const reservedBits = getReservedBitsCount(data.mode, version);
    totalBits += reservedBits + data.getBitsLength();
  });

  return totalBits;
}

function getBestVersionForMixedData(segments: AbstractData[], errorCorrectionLevel: ErrorCorrectionLevel): number {
  for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
    const length = getTotalBitsFromDataArray(segments, currentVersion);
    if (length <= getCapacity(currentVersion, errorCorrectionLevel, MIXED)) {
      return currentVersion;
    }
  }

  throw new Error('No version found for mixed data');
}

/**
 * Returns version number from a value.
 * If value is not a valid version, returns defaultValue
 *
 * @param  {Number|String} value        QR Code version
 * @param  {Number}        defaultValue Fallback value
 * @return {Number}                     QR Code version number
 */
export function versionFrom(value: number | string | undefined, defaultValue: number) {
  if (!value) {
    return defaultValue;
  }

  if (isValidVersion(value)) {
    return parseInt(typeof value === 'number' ? value.toString() : value, 10);
  }

  return defaultValue;
}

/**
 * Returns how much data can be stored with the specified QR code version
 * and error correction level
 *
 * @param  {Number} version              QR Code version (1-40)
 * @param  {Number} errorCorrectionLevel Error correction level
 * @param  {Mode}   mode                 Data mode
 * @return {Number}                      Quantity of storable data
 */
export function getCapacity(version: number, errorCorrectionLevel: ErrorCorrectionLevel, mode?: Mode): number {
  if (!isValidVersion(version)) {
    throw new Error('Invalid QR Code version');
  }

  // Use Byte mode as default
  if (typeof mode === 'undefined') mode = BYTE;

  // Total codewords for this QR code version (Data + Error correction)
  const totalCodewords = getSymbolTotalCodewords(version);

  // Total number of error correction codewords
  const ecTotalCodewords = getTotalCodewordsCount(version, errorCorrectionLevel);

  // Total number of data codewords
  const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;

  if (mode === MIXED) return dataTotalCodewordsBits;

  const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);

  // Return max number of storable codewords
  switch (mode) {
    case NUMERIC:
      return Math.floor((usableBits / 10) * 3);

    case ALPHANUMERIC:
      return Math.floor((usableBits / 11) * 2);

    case KANJI:
      return Math.floor(usableBits / 13);

    case BYTE:
    default:
      return Math.floor(usableBits / 8);
  }
}

/**
 * Returns the minimum version needed to contain the amount of data
 *
 * @param  {Segment} data                    Segment of data
 * @param  {Number} [errorCorrectionLevel=H] Error correction level
 * @return {Number}                          QR Code version
 */
export function getBestVersionForData(data: AbstractData | AbstractData[], errorCorrectionLevel: ErrorCorrectionLevel): number {
  let seg;

  const ecl = fromErrorCorrectionLevel(errorCorrectionLevel, M);

  if (Array.isArray(data)) {
    if (data.length > 1) {
      return getBestVersionForMixedData(data, ecl);
    }

    if (data.length === 0) {
      return 1;
    }

    seg = data[0];
  } else {
    seg = data;
  }

  return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
}

/**
 * Returns version information with relative error correction bits
 *
 * The version information is included in QR Code symbols of version 7 or larger.
 * It consists of an 18-bit sequence containing 6 data bits,
 * with 12 error correction bits calculated using the (18, 6) Golay code.
 *
 * @param  {Number} version QR Code version
 * @return {Number}         Encoded version info bits
 */
export function getEncodedBits(version: number): number {
  if (!isValidVersion(version) || version < 7) {
    throw new Error('Invalid QR Code version');
  }

  let d = version << 12;

  while (getBCHDigit(d) - G18_BCH >= 0) {
    d ^= G18 << (getBCHDigit(d) - G18_BCH);
  }

  return (version << 12) | d;
}
