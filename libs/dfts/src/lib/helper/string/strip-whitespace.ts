import {UndefinedOrNullOr} from '../../types';

export const stripWhitespace = (text: UndefinedOrNullOr<string>): string => text?.trim().replace(/^\s+/, '').replace(/\s+$/, '') ?? '';
