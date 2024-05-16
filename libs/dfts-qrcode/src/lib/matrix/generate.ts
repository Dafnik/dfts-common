import {
  ALPHANUMERIC_OUT_REGEXP,
  ECC_LEVELS_MAP,
  GF256_GEN_POLY,
  MODE_ALPHANUMERIC,
  MODE_NUMERIC,
  MODE_OCTET,
  MODES_MAP,
  NUMERIC_REGEXP,
  VERSIONS,
} from './const';
import { encode } from './encode';
import { getNumberOfAvailableBitsForData } from './get-number-of-available-bits-for-data';
import { augmentECCs } from './augment-eccs';
import { createBaseMatrix } from './create-base-matrix';
import { fillDataInMatrix } from './fill-data-in-matrix';
import { maskMatrixData } from './mask-matrix-data';
import { fillFormatInformationInMatrix } from './fill-format-information-in-matrix';
import { evaluateMatrix } from './evaluate-matrix';
import { validateData } from './validate-data';
import { getMaxDataLength } from './get-max-data-length';
import { generateMatrixOptions } from '../types';

/**
 * Generates a QR code matrix for the given data and options.
 *
 * @param {string | number} data - The data to be encoded.
 * @param {generateMatrixOptions} options - The options for generating the QR code matrix.
 * @returns {number[][]} The QR code matrix.
 * @throws {string} Throws an error if:
 *
 *                   - The data format is invalid.
 *                   - The ECC level is invalid.
 *                   - The data is too large for the specified version and ECC level.
 *                   - The version is invalid.
 *                   - The mask is invalid.
 */
export function generateQrCodeMatrix(data: string | number, options: generateMatrixOptions = {}): number[][] {
  const eccLevel = ECC_LEVELS_MAP[options.errorCorrectionLevel ?? 'L'],
    mask = options.mask ?? 1;
  let mode = options.mode ? MODES_MAP[options.mode] : -1,
    ver = options.version ?? -1;

  if (mode < 0) {
    if (typeof data === 'number' || data.match(NUMERIC_REGEXP)) {
      mode = MODE_NUMERIC;
    } else if (data.match(ALPHANUMERIC_OUT_REGEXP)) {
      // while encode supports case-insensitive
      // encoding, we restrict the data to be
      // uppercased when auto-selecting the mode.
      mode = MODE_ALPHANUMERIC;
    } else {
      mode = MODE_OCTET;
    }
  }

  const newData = validateData(mode, data);
  if (newData === undefined) throw 'QrCode: Invalid data format';

  if (eccLevel < 0 || eccLevel > 3) throw 'QrCode: Invalid ECC level';

  if (ver < 0) {
    for (ver = 1; ver <= 40; ver++) {
      if (newData.length <= getMaxDataLength(ver, mode, eccLevel)) break;
    }
    if (ver > 40) throw 'QrCode: Data to large';
  } else if (ver < 1 || ver > 40) {
    throw 'QrCode: Invalid version';
  }

  if (mask != -1 && (mask < 0 || mask > 8)) throw 'QrCode: Invalid mask';

  return generate(newData, ver, mode, eccLevel, mask);
}

/**
 * Returns the fully encoded QR code matrix which contains the given data.
 * It also chooses the best mask automatically when the mask is -1.
 *
 * @param {string | number[]} data - The data to be encoded.
 * @param {number} version - The QR code version.
 * @param {number} mode - The encoding mode (numeric, alphanumeric, octet).
 * @param {number} eccLevel - The error correction level.
 * @param {number} mask - The mask to be applied (-1 for automatic selection).
 * @returns {number[][]} The fully encoded QR code matrix.
 */
function generate(data: string | number[], version: number, mode: number, eccLevel: number, mask: number): number[][] {
  const v = VERSIONS[version] ?? [[-100]];
  let buffer = encode(version, mode, data, getNumberOfAvailableBitsForData(version, eccLevel) >> 3);
  buffer = augmentECCs(buffer, v[1][eccLevel], GF256_GEN_POLY[v[0][eccLevel]]);

  const result = createBaseMatrix(version),
    matrix = result.matrix,
    reserved = result.reserved;

  fillDataInMatrix(matrix, reserved, buffer);

  if (mask < 0) {
    // find the best mask
    maskMatrixData(matrix, reserved, 0);
    fillFormatInformationInMatrix(matrix, eccLevel, 0);

    let bestMask = 0,
      bestScore = evaluateMatrix(matrix);

    maskMatrixData(matrix, reserved, 0);

    for (mask = 1; mask < 8; mask++) {
      maskMatrixData(matrix, reserved, mask);
      fillFormatInformationInMatrix(matrix, eccLevel, mask);
      const score = evaluateMatrix(matrix);
      if (bestScore > score) {
        bestScore = score;
        bestMask = mask;
      }
      maskMatrixData(matrix, reserved, mask);
    }
    mask = bestMask;
  }

  maskMatrixData(matrix, reserved, mask);
  fillFormatInformationInMatrix(matrix, eccLevel, mask);
  return matrix;
}
