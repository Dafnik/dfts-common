/* eslint-disable no-useless-escape */
import { UndefinedOrNullOr } from '../../../types';

const isUrlRegEx =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
/**
 * Returns <code>true</code> if the given string is an url, <code>false</code> if not
 * @param {string} url
 * @return boolean
 */
export const s_isUrl = (url?: UndefinedOrNullOr<string>): boolean => isUrlRegEx.test(url ?? '');

export const s_isNoUrl = (url?: UndefinedOrNullOr<string>): boolean => !s_isUrl(url);
