import { generateECPolynomial, mod } from './polynomial';

export class ReedSolomonEncoder {
  private readonly genPoly: Uint8Array;

  constructor(private degree: number) {
    this.genPoly = generateECPolynomial(this.degree);
  }

  encode(data: Uint8Array): Uint8Array {
    // Calculate EC for this data block
    // extends data size to data+genPoly size
    const paddedData = new Uint8Array(data.length + this.degree);
    paddedData.set(data);

    // The error correction codewords are the remainder after dividing the data codewords
    // by a generator polynomial
    const remainder = mod(paddedData, this.genPoly);

    // return EC data blocks (last n byte, where n is the degree of genPoly)
    // If coefficients number in remainder are less than genPoly degree,
    // pad with 0s to the left to reach the needed number of coefficients
    const start = this.degree - remainder.length;
    if (start > 0) {
      const buff = new Uint8Array(this.degree);
      buff.set(remainder, start);

      return buff;
    }

    return remainder;
  }
}
