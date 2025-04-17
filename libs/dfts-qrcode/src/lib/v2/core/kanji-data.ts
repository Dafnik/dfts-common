import { AbstractData } from './abstract-data';
import { BitBuffer } from './bit-buffer';
import { KANJI } from './mode';
import { toSJIS } from './utils';

export class KanjiData extends AbstractData {
  constructor(private data: string) {
    super(KANJI);
  }

  override getLength(): number {
    return this.data.length;
  }
  override getBitsLength(): number {
    return getKanjiBitsLength(this.data.length);
  }
  override write(bitBuffer: BitBuffer): void {
    let i;

    // In the Shift JIS system, Kanji characters are represented by a two byte combination.
    // These byte values are shifted from the JIS X 0208 values.
    // JIS X 0208 gives details of the shift coded representation.
    for (i = 0; i < this.data.length; i++) {
      let value = toSJIS(this.data[i]);

      // For characters with Shift JIS values from 0x8140 to 0x9FFC:
      if (value >= 0x8140 && value <= 0x9ffc) {
        // Subtract 0x8140 from Shift JIS value
        value -= 0x8140;

        // For characters with Shift JIS values from 0xE040 to 0xEBBF
      } else if (value >= 0xe040 && value <= 0xebbf) {
        // Subtract 0xC140 from Shift JIS value
        value -= 0xc140;
      } else {
        throw new Error('Invalid SJIS character: ' + this.data[i] + '\n' + 'Make sure your charset is UTF-8');
      }

      // Multiply most significant byte of result by 0xC0
      // and add least significant byte to product
      value = ((value >>> 8) & 0xff) * 0xc0 + (value & 0xff);

      // Convert result to a 13-bit binary string
      bitBuffer.put(value, 13);
    }
  }
}

export function getKanjiBitsLength(length: number): number {
  return length * 13;
}
