import { AbstractData } from './abstract-data';
import { BitBuffer } from './bit-buffer';
import { BYTE } from './mode';

const textEncoder = new TextEncoder();

export class ByteData extends AbstractData {
  private readonly data: Uint8Array;

  constructor(data: string) {
    super(BYTE);

    if (typeof data === 'string') {
      this.data = textEncoder.encode(data);
    } else {
      this.data = new Uint8Array(data);
    }
  }

  override getLength(): number {
    return this.data.length;
  }
  override getBitsLength(): number {
    return getByteBitsLength(this.data.length);
  }
  override write(bitBuffer: BitBuffer): void {
    for (let i = 0, l = this.data.length; i < l; i++) {
      bitBuffer.put(this.data[i], 8);
    }
  }
}

export function getByteBitsLength(length: number): number {
  return length * 8;
}
