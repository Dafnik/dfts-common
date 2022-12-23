/**
 * Splits a given string into an array of words with a maximum length.
 *
 * @param {string} text - The string to split into chunks.
 * @param {number} chunkLength - The maximum length of each chunk.
 * @return {string[]} An array of strings.
 */
export const s_chunks = (text: string, chunkLength: number): string[] => {
  const input = text.trim().split(' ');
  const output: string[] = [];
  let currentChunk = '';
  for (const word of input) {
    const temp = `${currentChunk} ${word}`.trim();
    if (temp.length <= chunkLength) {
      currentChunk = temp;
    } else {
      output.push(currentChunk);
      currentChunk = word;
    }
  }
  if (currentChunk) {
    output.push(currentChunk);
  }
  return output;
};
