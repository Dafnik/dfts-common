/**
 * Returns the size of entire QR code for the given version.
 *
 * @param {number} version - The version number of the QR code.
 * @returns {number} The size of entire QR code for the given version.
 */
export function getSizeByVersion(version: number): number {
  return 4 * version + 17;
}
