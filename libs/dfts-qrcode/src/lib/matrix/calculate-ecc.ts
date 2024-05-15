import { GF256_INVENTORY_MAP, GF256_MAP } from './const';

/**
 * Calculates ECC code words for given code words and generator polynomial.
 *
 * This is quite similar to CRC calculation as both Reed-Solomon and CRC use
 * the certain kind of cyclic codes, which is effectively the division of
 * zero-augmented polynomial by the generator polynomial. The only difference
 * is that Reed-Solomon uses GF(2^8), instead of CRC's GF(2), and Reed-Solomon
 * uses a different generator polynomial than CRC's.
 *
 * @param {number[]} poly - The array of code words for which ECC words are to be calculated.
 * @param {number[]} genPoly - The generator polynomial used for ECC calculation.
 * @returns {number[]} The array of calculated ECC code words.
 */
export function calculateECC(poly: number[], genPoly: number[]): number[] {
  const modulus = poly.slice(0),
    polyLength = poly.length,
    genPolyLength = genPoly.length;

  for (let i = 0; i < genPolyLength; i++) {
    modulus.push(0);
  }

  for (let i = 0; i < polyLength; ) {
    const quotient = GF256_INVENTORY_MAP[modulus[i++]];
    if (quotient >= 0) {
      for (let j = 0; j < genPolyLength; j++) {
        modulus[i + j] ^= GF256_MAP[(quotient + genPoly[j]) % 255];
      }
    }
  }
  return modulus.slice(polyLength);
}
