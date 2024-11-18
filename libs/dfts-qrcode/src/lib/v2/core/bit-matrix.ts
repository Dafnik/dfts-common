export type BitType = 0 | 1;

export class BitMatrix {
  public readonly data: Uint8Array;
  private readonly reservedBit: Uint8Array;

  constructor(public readonly size: number) {
    this.data = new Uint8Array(size * size);
    this.reservedBit = new Uint8Array(size * size);
  }

  /**
   * Set bit value at specified location
   * If reserved flag is set, this bit will be ignored during masking process
   *
   * @param {Number}  row
   * @param {Number}  col
   * @param {Boolean} value
   * @param {Boolean} reserved
   */
  set(row: number, col: number, value: BitType, reserved: boolean): void {
    const index = row * this.size + col;
    this.data[index] = value;
    if (reserved) {
      this.reservedBit[index] = 1;
    }
  }

  /**
   * Returns bit value at specified location
   *
   * @param  {Number}  row
   * @param  {Number}  col
   * @return {Boolean}
   */
  get(row: number, col: number): BitType {
    return this.data[row * this.size + col] as BitType;
  }

  /**
   * Applies xor operator at specified location
   * (used during masking process)
   *
   * @param {Number}  row
   * @param {Number}  col
   * @param {Boolean} value
   */
  xor(row: number, col: number, value: 0 | 1) {
    this.data[row * this.size + col] ^= value;
  }

  /**
   * Check if bit at specified location is reserved
   *
   * @param {Number}   row
   * @param {Number}   col
   * @return {Boolean}
   */
  isReserved(row: number, col: number): 0 | 1 {
    return this.reservedBit[row * this.size + col] as BitType;
  }
}
