import { MASK_FUNCTIONS } from './const';

/**
 * XOR-masks the data portion of the matrix. Repeating the call with the same
 * arguments will revert the prior call (convenient in the matrix evaluation).
 *
 * @param {number[][]} matrix - The matrix whose data portion needs to be masked.
 * @param {number[][]} reserved - The reserved portion of the matrix.
 * @param {number} mask - The mask pattern to be applied.
 * @returns {number[][]} The matrix with masked data portion.
 */
export function maskMatrixData(matrix: number[][], reserved: number[][], mask: number): number[][] {
  const maskFunction = MASK_FUNCTIONS[mask];
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (!reserved[i][j]) {
        matrix[i][j] ^= maskFunction(i, j) ? 1 : 0;
      }
    }
  }
  return matrix;
}
