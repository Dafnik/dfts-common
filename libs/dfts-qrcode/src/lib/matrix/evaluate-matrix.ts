import { evaluateGroup } from './evaluate-group';

// N2 points for each 2x2 block of same-colored modules.
// overlapping block does count.
const PENALTY_TWO_BY_TWO = 3;
// N4*k points for every (5*k)% deviation from 50% black density.
// i.e. k=1 for 55~60% and 40~45%, k=2 for 60~65% and 35~40%, etc.
const PENALTY_DENSITY = 10;

/**
 * Evaluates the resulting matrix and returns the score (lower is better).
 * (cf. JIS X 0510:2004 sec 8.8.2)
 *
 * The evaluation procedure tries to avoid the problematic patterns naturally
 * occurring from the original matrix. For example, it penalizes the patterns
 * which just look like the finder pattern which will confuse the decoder.
 * We choose the mask which results in the lowest score among 8 possible ones.
 *
 * Note: ZXing seems to use the same procedure and in many cases its choice
 * agrees with ours, but sometimes it does not. Practically it doesn't matter.
 *
 * @param {number[][]} matrix - The matrix to be evaluated.
 * @returns {number} The score of the matrix evaluation (lower is better).
 */
export function evaluateMatrix(matrix: number[][]): number {
  const matrixLength = matrix.length;
  let score = 0,
    numberOfBlackSquares = 0;

  for (let i = 0; i < matrixLength; i++) {
    const row = matrix[i];
    let groups: number[];

    // evaluate the current row
    groups = [0]; // the first empty group of white
    for (let j = 0; j < matrixLength; ) {
      let k = 0;
      for (; j < matrixLength && row[j]; k++) {
        j++;
      }
      groups.push(k);
      for (k = 0; j < matrixLength && !row[j]; k++) {
        j++;
      }
      groups.push(k);
    }
    score += evaluateGroup(groups);

    // evaluate the current column
    groups = [0];
    for (let j = 0; j < matrixLength; ) {
      let k = 0;
      for (; j < matrixLength && matrix[j][i]; k++) {
        j++;
      }
      groups.push(k);
      for (k = 0; j < matrixLength && !matrix[j][i]; k++) {
        j++;
      }
      groups.push(k);
    }
    score += evaluateGroup(groups);

    // check the 2x2 box and calculate the density
    const nextRow = matrix[i + 1] || [];
    numberOfBlackSquares += row[0];
    for (let j = 1; j < matrixLength; j++) {
      const p = row[j];
      numberOfBlackSquares += p;
      // at least comparison with next row should be strict...
      if (row[j - 1] == p && nextRow[j] === p && nextRow[j - 1] === p) {
        score += PENALTY_TWO_BY_TWO;
      }
    }
  }

  score += PENALTY_DENSITY * ((Math.abs(numberOfBlackSquares / matrixLength / matrixLength - 0.5) / 0.05) | 0);
  return score;
}
