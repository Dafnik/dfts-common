import {UndefinedOrNullOr} from '../../types';

export const s_upperCaseFirstLetter = (text: UndefinedOrNullOr<string>): string =>
  text ? `${text.slice(0, 1).toUpperCase()}${text.slice(1)}` : '';

export const s_lowerCaseAllExceptFirstLetter = (text: UndefinedOrNullOr<string>): string =>
  text?.replace(/\S*/g, (word) => `${word.slice(0, 1)}${word.slice(1).toLowerCase()}`) ?? '';
