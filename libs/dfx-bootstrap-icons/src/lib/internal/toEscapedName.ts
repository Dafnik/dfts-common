
export function toEscapedName(input: string): string {
  // Define a mapping of number-to-word
  const numberToWord: { [key: string]: string } = {
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
  };

  // Split the input string into words
  const words: string[] = input.split('-');

  // Check if the first word starts with a number
  const firstWord: string = words[0];
  if (/[0-9]/.test(firstWord[0])) {
    // Replace the first character with its word form
    words[0] = numberToWord[firstWord[0]] + firstWord.slice(1);
  }

  // Rejoin the words with hyphens to form the final formatted string
  const formattedString: string = words.join('-');

  // Lowercase first letter
  return toCamelCase(formattedString.charAt(0).toLowerCase() + formattedString.slice(1));
}

function toCamelCase(input: string, separator = '-'): string {
  if (!input) throw Error('missing argument');

  const val = input.trim();
  if (!val.includes(separator)) return val;

  let res = '';
  let iterator = 0;

  for (iterator; iterator < input.length; iterator += 1) {
    const char = input.charAt(iterator).trim();

    if (iterator === 0) {
      res += char.toLowerCase();
      // eslint-disable-next-line no-continue
      continue;
    }

    if (char === separator) {
      res += input
        .charAt(iterator + 1)
        .trim()
        .toUpperCase();
      iterator += 1;
      // eslint-disable-next-line no-continue
      continue;
    }

    // eslint-disable-next-line no-restricted-globals
    if (iterator > 0 && !isNaN(Number(+input.charAt(iterator - 1)))) {
      res += char.toUpperCase();
      // eslint-disable-next-line no-continue
      continue;
    }

    if (iterator > 0) res += char;
  }
  return res.trim();
}
