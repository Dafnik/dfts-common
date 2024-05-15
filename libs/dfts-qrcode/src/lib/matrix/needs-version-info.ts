/**
 * Checks if the QR code needs the version embedded.
 *
 * @param {number} version - The version number of the QR code.
 * @returns {boolean} True when the version information has to be embedded.
 */
export function needsVersionInfo(version: number): boolean {
  return version > 6;
}
