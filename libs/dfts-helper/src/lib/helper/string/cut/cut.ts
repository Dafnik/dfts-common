/**
 * Returns the whole text if the length does not exceed the maxLength, else the text will be sliced and a suffix will be added
 * @param {string} text The text to check for slicing
 * @param {number} maxLength Maximal length of the text
 * @param {string|null|undefined} suffix Suffix to add if text length exceeds the <code>maxLength</code>, default <code>'...'</code>; Set to <code>null</code> to disable suffix.
 * @return string
 */
export const s_cut = (text: string | undefined | null, maxLength = 10, suffix: string | undefined | null = '...'): string =>
  text ? (text.length < maxLength ? text : `${text.slice(0, maxLength)}${suffix ?? ''}`) : '';
