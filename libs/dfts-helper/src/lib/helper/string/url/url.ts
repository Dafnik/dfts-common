import {UndefinedOrNullOr} from '../../../types.js';

const isUrlRegEx = new RegExp(
  '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$',
  'i'
);

/**
 * Returns <code>true</code> if the given string is an url, <code>false</code> if not
 * @param {string} url
 * @return boolean
 */
export const s_isUrl = (url?: UndefinedOrNullOr<string>): boolean => isUrlRegEx.test(url ?? '');

export const s_isNoUrl = (url?: UndefinedOrNullOr<string>): boolean => !isUrlRegEx.test(url ?? '');
