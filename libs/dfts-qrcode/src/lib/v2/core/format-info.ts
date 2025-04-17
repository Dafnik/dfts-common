import { getBCHDigit } from './utils';
import { ErrorCorrectionLevel } from './error-correction-level';

const G15 = (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1 << 1) | (1 << 0);
const G15_MASK = (1 << 14) | (1 << 12) | (1 << 10) | (1 << 4) | (1 << 1);
const G15_BCH = getBCHDigit(G15);

/**
 * Returns format information with relative error correction bits
 *
 * The format information is a 15-bit sequence containing 5 data bits,
 * with 10 error correction bits calculated using the (15, 5) BCH code.
 *
 * @param  {ErrorCorrectionLevel} errorCorrectionLevel Error correction level
 * @param  {Number} mask                 Mask pattern
 * @return {Number}                      Encoded format information bits
 */
export function getEncodedBits(errorCorrectionLevel: ErrorCorrectionLevel, mask: number): number {
  const data = (errorCorrectionLevel.bit << 3) | mask;
  let d = data << 10;

  while (getBCHDigit(d) - G15_BCH >= 0) {
    d ^= G15 << (getBCHDigit(d) - G15_BCH);
  }

  // xor final data with mask pattern in order to ensure that
  // no combination of Error Correction Level and data mask pattern
  // will result in an all-zero data string
  return ((data << 10) | d) ^ G15_MASK;
}
