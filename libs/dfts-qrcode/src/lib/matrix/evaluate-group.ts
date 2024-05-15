// N1+(k-5) points for each consecutive row of k same-colored modules,
// where k >= 5. no overlapping row counts.
const PENALTY_CONSECUTIVE = 3;

// N3 points for each pattern with >4W:1B:1W:3B:1W:1B or
// 1B:1W:3B:1W:1B:>4W, or their multiples (e.g. highly unlikely,
// but 13W:3B:3W:9B:3W:3B counts).
const PENALTY_FINDER_LIKE = 40;

/**
 * Evaluates a group of modules and assigns a penalty score based on certain patterns.
 *
 * @param {number[]} groups - An array representing the group of modules.
 * @returns {number} The penalty score for the group.
 */
export function evaluateGroup(groups: number[]): number {
  // assumes [W,B,W,B,W,...,B,W]
  let score = 0;

  for (let i = 0; i < groups.length; i++) {
    if (groups[i] >= 5) score += PENALTY_CONSECUTIVE + (groups[i] - 5);
  }

  for (let i = 5; i < groups.length; i += 2) {
    const p = groups[i];
    if (
      groups[i - 1] == p &&
      groups[i - 2] == 3 * p &&
      groups[i - 3] == p &&
      groups[i - 4] == p &&
      (groups[i - 5] >= 4 * p || groups[i + 1] >= 4 * p)
    ) {
      // this part differs from zxing...
      score += PENALTY_FINDER_LIKE;
    }
  }

  return score;
}
