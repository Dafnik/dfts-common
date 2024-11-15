export interface ErrorCorrectionLevel {
  bit: number;
}

export const L: ErrorCorrectionLevel = { bit: 1 };
export const M: ErrorCorrectionLevel = { bit: 0 };
export const Q: ErrorCorrectionLevel = { bit: 3 };
export const H: ErrorCorrectionLevel = { bit: 2 };

export function errorCorrectionLevelFromString(str: string) {
  const lcStr = str.toLowerCase();

  switch (lcStr) {
    case 'l':
    case 'low':
      return L;

    case 'm':
    case 'medium':
      return M;

    case 'q':
    case 'quartile':
      return Q;

    case 'h':
    case 'high':
      return H;

    default:
      throw new Error('Unknown EC Level: ' + str);
  }
}

export function isValidErrorCorrectionLevel(level: ErrorCorrectionLevel | string | undefined | null): level is ErrorCorrectionLevel {
  return !!level && typeof level !== 'string' && level.bit >= 0 && level.bit < 4;
}

export function from(value: ErrorCorrectionLevel | string | undefined | null, defaultValue: ErrorCorrectionLevel): ErrorCorrectionLevel {
  if (isValidErrorCorrectionLevel(value)) {
    return value;
  }

  return value ? errorCorrectionLevelFromString(value) : defaultValue;
}
