import { UndefinedOrNullOr } from '../../../types';

const isEmailRegEx = new RegExp(
  /^(([^<>()\\.,;:\s@"]+(\.[^<>()\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/,
);

/**
 * Returns <code>true</code> if the given string is an email, <code>false</code> if not
 * @param {string} email
 * @return boolean
 */
export const s_isEmail = (email: UndefinedOrNullOr<string>): boolean => isEmailRegEx.test(email ?? '');

/**
 * Returns <code>false</code> if the given string is an email, <code>true</code> if not
 * @param {string} email
 * @return boolean
 */
export const s_isNoEmail = (email: UndefinedOrNullOr<string>): boolean => !isEmailRegEx.test(email ?? '');
