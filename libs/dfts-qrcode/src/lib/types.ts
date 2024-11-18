export type QRCodeVersion =
  | -1
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40;

export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type QRCodeMode = 'numeric' | 'alphanumeric' | 'octet';

export type ColorValueHex = `#${string}`;

export type QRCodeOptions = {
  version?: QRCodeVersion;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  mask?: number;
  margin?: number;
  scale?: number;
  width?: number;
  colors?: {
    light?: ColorValueHex;
    dark?: ColorValueHex;
  };
};

export type generateMatrixOptions = {
  version?: QRCodeVersion;
  mode?: QRCodeMode;
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  mask?: number;
};

export type generateOptions = generateMatrixOptions & {
  size?: number;
  margin?: number;
  colors?: {
    colorLight?: ColorValueHex;
    colorDark?: ColorValueHex;
  };
};

export type generateWithImageOptions = {
  image?: {
    src?: string;
    height?: number;
    width?: number;
  };
};

export type generateWithAccessibleOptions = {
  alt?: string;
  ariaLabel?: string;
  title?: string;
};
