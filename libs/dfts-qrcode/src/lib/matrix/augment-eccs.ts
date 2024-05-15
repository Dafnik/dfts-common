import { calculateECC } from './calculate-ecc';

/**
 * Augments ECC code words to given code words. The resulting words are
 * ready to be encoded in the matrix.
 *
 * The actual augmenting procedure follows JIS X 0510:2004 sec 8.7.
 * The code is simplified using the fact that the size of each code & ECC
 * blocks is almost the same; for example, when we have 4 blocks and 46 data words,
 * the number of code words in those blocks are 11, 11, 12, 12 respectively.
 *
 * @param {number[]} poly - The array of code words to which ECC words are to be augmented.
 * @param {number} blockNumber - The number of blocks into which the code words are divided.
 * @param {number[]} genPoly - The generator polynomial used for calculating ECC words.
 * @returns {number[]} The augmented array of code words ready for encoding in the matrix.
 */
export function augmentECCs(poly: number[], blockNumber: number, genPoly: number[]): number[] {
  const subSizes: number[] = [],
    subSize: number = (poly.length / blockNumber) | 0,
    pivot: number = blockNumber - (poly.length % blockNumber),
    eccs: number[][] = [];

  let subSize0 = 0;

  for (let i = 0; i < pivot; i++) {
    subSizes.push(subSize0);
    subSize0 += subSize;
  }
  for (let i = pivot; i < blockNumber; i++) {
    subSizes.push(subSize0);
    subSize0 += subSize + 1;
  }
  subSizes.push(subSize0);

  for (let i = 0; i < blockNumber; i++) {
    eccs.push(calculateECC(poly.slice(subSizes[i], subSizes[i + 1]), genPoly));
  }

  const result: number[] = [];
  const numberOfItemsPerBlock = (poly.length / blockNumber) | 0;
  for (let i = 0; i < numberOfItemsPerBlock; i++) {
    for (let j = 0; j < blockNumber; j++) {
      result.push(poly[subSizes[j] + i]);
    }
  }
  for (let j = pivot; j < blockNumber; j++) {
    result.push(poly[subSizes[j + 1] - 1]);
  }
  for (let i = 0; i < genPoly.length; i++) {
    for (let j = 0; j < blockNumber; j++) {
      result.push(eccs[j][i]);
    }
  }
  return result;
}
