/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
export function isValidVersion(version: number): boolean {
  return !isNaN(version) && version >= 1 && version <= 40;
}
