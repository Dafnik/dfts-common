/**
 * Augments BCH(p+q,q) code to the polynomial over GF(2), given the proper generator polynomial.
 * Both the input and output are in binary numbers, and unlike calculateECC,
 * the generator polynomial should include the 1 bit for the highest degree.
 *
 * Actual polynomials used for this procedure are as follows:
 * - p=10, q=5, generator polynomial=x^10+x^8+x^5+x^4+x^2+x+1 (JIS X 0510:2004 Appendix C)
 * - p=18, q=6, generator polynomial=x^12+x^11+x^10+x^9+x^8+x^5+x^2+1 (ibid. Appendix D)
 *
 * @param {number} poly - The input polynomial.
 * @param {number} p - The value of p in BCH(p+q,q) code.
 * @param {number} genPoly - The generator polynomial for the BCH code.
 * @param {number} q - The value of q in BCH(p+q,q) code.
 * @return {number} The augmented BCH code.
 */
export function augmentBCH(poly: number, p: number, genPoly: number, q: number): number {
  let modulus = poly << q;
  for (let i = p - 1; i >= 0; --i) {
    if ((modulus >> (q + i)) & 1) modulus ^= genPoly << i;
  }
  return (poly << q) | modulus;
}
