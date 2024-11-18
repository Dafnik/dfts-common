/**
 * Check if QR Code version is valid
 *
 * @param  {Number}  version QR Code version
 * @return {Boolean}         true if valid version, false otherwise
 */
export function isValidVersion(version: number | string): boolean {
  if (typeof version === 'string') {
    const num = Number(version);
    return !isNaN(num) && num >= 1 && num <= 40;
  }
  return !isNaN(version) && version >= 1 && version <= 40;
}
