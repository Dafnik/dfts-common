import { UndefinedOrNullOr } from '../../types';

export const s_stripWhitespace = (text: UndefinedOrNullOr<string>): string => text?.trim().replace(/\s/g, '') ?? '';
