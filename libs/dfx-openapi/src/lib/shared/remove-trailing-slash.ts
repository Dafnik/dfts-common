/**
 * Remove trailing slash from url
 */
export function removeTrailingSlash(url: string): string {
  if (url.endsWith('/')) {
    return url.substring(0, url.length - 1);
  }
  return url;
}
