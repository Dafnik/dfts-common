export const VERSIONS = [
  null,
  [[10, 7, 17, 13], [1, 1, 1, 1], []],
  [
    [16, 10, 28, 22],
    [1, 1, 1, 1],
    [4, 16],
  ],
  [
    [26, 15, 22, 18],
    [1, 1, 2, 2],
    [4, 20],
  ],
  [
    [18, 20, 16, 26],
    [2, 1, 4, 2],
    [4, 24],
  ],
  [
    [24, 26, 22, 18],
    [2, 1, 4, 4],
    [4, 28],
  ],
  [
    [16, 18, 28, 24],
    [4, 2, 4, 4],
    [4, 32],
  ],
  [
    [18, 20, 26, 18],
    [4, 2, 5, 6],
    [4, 20, 36],
  ],
  [
    [22, 24, 26, 22],
    [4, 2, 6, 6],
    [4, 22, 40],
  ],
  [
    [22, 30, 24, 20],
    [5, 2, 8, 8],
    [4, 24, 44],
  ],
  [
    [26, 18, 28, 24],
    [5, 4, 8, 8],
    [4, 26, 48],
  ],
  [
    [30, 20, 24, 28],
    [5, 4, 11, 8],
    [4, 28, 52],
  ],
  [
    [22, 24, 28, 26],
    [8, 4, 11, 10],
    [4, 30, 56],
  ],
  [
    [22, 26, 22, 24],
    [9, 4, 16, 12],
    [4, 32, 60],
  ],
  [
    [24, 30, 24, 20],
    [9, 4, 16, 16],
    [4, 24, 44, 64],
  ],
  [
    [24, 22, 24, 30],
    [10, 6, 18, 12],
    [4, 24, 46, 68],
  ],
  [
    [28, 24, 30, 24],
    [10, 6, 16, 17],
    [4, 24, 48, 72],
  ],
  [
    [28, 28, 28, 28],
    [11, 6, 19, 16],
    [4, 28, 52, 76],
  ],
  [
    [26, 30, 28, 28],
    [13, 6, 21, 18],
    [4, 28, 54, 80],
  ],
  [
    [26, 28, 26, 26],
    [14, 7, 25, 21],
    [4, 28, 56, 84],
  ],
  [
    [26, 28, 28, 30],
    [16, 8, 25, 20],
    [4, 32, 60, 88],
  ],
  [
    [26, 28, 30, 28],
    [17, 8, 25, 23],
    [4, 26, 48, 70, 92],
  ],
  [
    [28, 28, 24, 30],
    [17, 9, 34, 23],
    [4, 24, 48, 72, 96],
  ],
  [
    [28, 30, 30, 30],
    [18, 9, 30, 25],
    [4, 28, 52, 76, 100],
  ],
  [
    [28, 30, 30, 30],
    [20, 10, 32, 27],
    [4, 26, 52, 78, 104],
  ],
  [
    [28, 26, 30, 30],
    [21, 12, 35, 29],
    [4, 30, 56, 82, 108],
  ],
  [
    [28, 28, 30, 28],
    [23, 12, 37, 34],
    [4, 28, 56, 84, 112],
  ],
  [
    [28, 30, 30, 30],
    [25, 12, 40, 34],
    [4, 32, 60, 88, 116],
  ],
  [
    [28, 30, 30, 30],
    [26, 13, 42, 35],
    [4, 24, 48, 72, 96, 120],
  ],
  [
    [28, 30, 30, 30],
    [28, 14, 45, 38],
    [4, 28, 52, 76, 100, 124],
  ],
  [
    [28, 30, 30, 30],
    [29, 15, 48, 40],
    [4, 24, 50, 76, 102, 128],
  ],
  [
    [28, 30, 30, 30],
    [31, 16, 51, 43],
    [4, 28, 54, 80, 106, 132],
  ],
  [
    [28, 30, 30, 30],
    [33, 17, 54, 45],
    [4, 32, 58, 84, 110, 136],
  ],
  [
    [28, 30, 30, 30],
    [35, 18, 57, 48],
    [4, 28, 56, 84, 112, 140],
  ],
  [
    [28, 30, 30, 30],
    [37, 19, 60, 51],
    [4, 32, 60, 88, 116, 144],
  ],
  [
    [28, 30, 30, 30],
    [38, 19, 63, 53],
    [4, 28, 52, 76, 100, 124, 148],
  ],
  [
    [28, 30, 30, 30],
    [40, 20, 66, 56],
    [4, 22, 48, 74, 100, 126, 152],
  ],
  [
    [28, 30, 30, 30],
    [43, 21, 70, 59],
    [4, 26, 52, 78, 104, 130, 156],
  ],
  [
    [28, 30, 30, 30],
    [45, 22, 74, 62],
    [4, 30, 56, 82, 108, 134, 160],
  ],
  [
    [28, 30, 30, 30],
    [47, 24, 77, 65],
    [4, 24, 52, 80, 108, 136, 164],
  ],
  [
    [28, 30, 30, 30],
    [49, 25, 81, 68],
    [4, 28, 56, 84, 112, 140, 168],
  ],
];

export const MODE_NUMERIC = 1,
  MODE_ALPHANUMERIC = 2,
  MODE_OCTET = 4,
  MODE_KANJI = 8;

// ECC levels (cf. Table 22 in JIS X 0510:2004 p. 45)
export const ECC_LEVEL_L = 1,
  ECC_LEVEL_M = 0,
  ECC_LEVEL_Q = 3,
  ECC_LEVEL_H = 2;

// mode constants (cf. Table 2 in JIS X 0510:2004 p. 16)
export const MODE_TERMINATOR = 0;
export const MODES_MAP: { [x: string]: number } = {
  numeric: MODE_NUMERIC,
  alphanumeric: MODE_ALPHANUMERIC,
  octet: MODE_OCTET,
};

// validation regexps
export const NUMERIC_REGEXP = /^\d*$/;
export const ALPHANUMERIC_REGEXP = /^[A-Za-z0-9 $%*+\-./:_]*$/;
export const ALPHANUMERIC_OUT_REGEXP = /^[A-Z0-9 $%*+\-./:_]*$/;

export const ECC_LEVELS_MAP: { [x: string]: number } = {
  L: ECC_LEVEL_L,
  M: ECC_LEVEL_M,
  Q: ECC_LEVEL_Q,
  H: ECC_LEVEL_H,
};

// generator polynomials up to degree 30
// (should match with polynomials in JIS X 0510:2004 Appendix A)
//
// generator polynomial of degree K is product of (x-\alpha^0), (x-\alpha^1),
// ..., (x-\alpha^(K-1)). by convention, we omit the K-th coefficient (always 1)
// from the result; also other coefficients are written in terms of the exponent
// to \alpha to avoid the redundant calculation. (see also calculateecc below.)
export const GF256_GEN_POLY: number[][] = [[]];

// alphanumeric character mapping (cf. Table 5 in JIS X 0510:2004 p. 19)
export const ALPHANUMERIC_MAP: { [x: string]: number } = {};

// GF(2^8)-to-integer mapping with a reducing polynomial x^8+x^4+x^3+x^2+1
// invariant: GF256_MAP[GF256_INVMAP[i]] == i for all i in [1,256]
export const GF256_MAP: number[] = [],
  GF256_INVENTORY_MAP = [-1];

for (let i = 0, v = 1; i < 255; i++) {
  GF256_MAP.push(v);
  GF256_INVENTORY_MAP[v] = i;
  v = (v * 2) ^ (v >= 128 ? 0x11d : 0);
}

for (let i = 0; i < 30; i++) {
  const prevpoly = GF256_GEN_POLY[i],
    poly: number[] = [];
  for (let j = 0; j <= i; j++) {
    const a = j < i ? GF256_MAP[prevpoly[j]] : 0;
    const b = GF256_MAP[(i + (prevpoly[j - 1] || 0)) % 255];
    poly.push(GF256_INVENTORY_MAP[a ^ b]);
  }
  GF256_GEN_POLY.push(poly);
}

for (let i = 0; i < 45; i++) {
  ALPHANUMERIC_MAP['0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.charAt(i)] = i;
}

// mask functions in terms of row # and column #
// (cf. Table 20 in JIS X 0510:2004 p. 42)
export const MASK_FUNCTIONS: ((i: number, j: number) => boolean)[] = [
  (i: number, j: number): boolean => (i + j) % 2 === 0,
  (i: number, j: number): boolean => i % 2 === 0,
  (i: number, j: number): boolean => j % 3 === 0,
  (i: number, j: number): boolean => (i + j) % 3 === 0,
  (i: number, j: number): boolean => (((i / 2) | 0) + ((j / 3) | 0)) % 2 === 0,
  (i: number, j: number): boolean => ((i * j) % 2) + ((i * j) % 3) === 0,
  (i: number, j: number): boolean => (((i * j) % 2) + ((i * j) % 3)) % 2 === 0,
  (i: number, j: number): boolean => (((i + j) % 2) + ((i * j) % 3)) % 2 === 0,
];
