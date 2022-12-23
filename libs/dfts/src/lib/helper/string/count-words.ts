/**
 * Counts the number of words in a string.
 * @param {string} text - The text to be processed.
 * @returns {number} - The number of words in the text.
 */
export const s_countWords = (text: string): number => (text.match(new RegExp('\\w+', 'g')) || []).length;
