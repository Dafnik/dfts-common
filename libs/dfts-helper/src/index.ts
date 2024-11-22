/*
 * Public API Surface of dfts
 */

export * from './lib/decorators/confirmable/confirmable';
export * from './lib/decorators/delay/delay';
export * from './lib/decorators/measure-time/measure-time';
export * from './lib/decorators/once/once';
export * from './lib/decorators/remember-result/remember-result';
export * from './lib/decorators/throttle';

export * from './lib/entities/has-id.interface';
export * from './lib/entities/has-name.interface';

export { a_forEachIfAbsent } from './lib/helper/array/for-each-if-absent/for-each-if-absent';
export { a_forEachIfPresent } from './lib/helper/array/for-each-if-present/for-each-if-present';
export { a_containsDuplicates } from './lib/helper/array/contains-duplicates/contains-duplicates';
export { a_forEachIf } from './lib/helper/array/for-each-if';
export { a_hasEntries } from './lib/helper/array/has-entries';
export { a_isEmpty } from './lib/helper/array/is-empty';
export { a_pluck } from './lib/helper/array/pluck';
export { a_pushIf } from './lib/helper/array/push-if';
export { a_pushIfAbsent } from './lib/helper/array/push-if-absent/push-if-absent';
export { a_remove } from './lib/helper/array/remove/remove';
export { a_removeIf } from './lib/helper/array/remove-if';
export { a_shuffle } from './lib/helper/array/shuffle';

export { b_from } from './lib/helper/boolean/from/from';
export { b_fromStorage } from './lib/helper/boolean/from-storage/from-storage';
export { b_is } from './lib/helper/boolean/is/is';

export { d_format } from './lib/helper/date/format-date/format-date';
export { d_formatWithHoursMinutesAndSeconds } from './lib/helper/date/format-date-with-hours-minutes-seconds/format-date-with-hours-minutes-seconds';
export { d_from } from './lib/helper/date/from';
export { d_fromStorage } from './lib/helper/date/from-storage/from-storage';
export { d_is } from './lib/helper/date/is/is';
export { d_timeLeft } from './lib/helper/date/time-left/time-left';
export { d_timespan } from './lib/helper/date/timespan/timespan';

export { n_from } from './lib/helper/number/from/from';
export { n_fromStorage } from './lib/helper/number/from-storage/from-storage';
export { n_generate_int, n_generate_float } from './lib/helper/number/generator/generator';
export { n_humanizeTime } from './lib/helper/number/humanize-time';
export { n_is } from './lib/helper/number/is/is';
export { n_isNumeric } from './lib/helper/number/is-numeric/is-numeric';

export { o_fromStorage } from './lib/helper/object/from-storage/from-storage';
export { o_is } from './lib/helper/object/is/is';

export {
  st_hasEntries,
  st_isEmpty,
  st_isFull,
  st_isNotFull,
  st_size,
  st_isAvailable,
  st_removeAll,
  st_fillUp,
} from './lib/helper/storage/common';
export { st_exists } from './lib/helper/storage/exists';
export { st_remove } from './lib/helper/storage/remove';
export { st_set } from './lib/helper/storage/set';

export { StringHelper } from './lib/helper/string/_string';
export { s_chunks } from './lib/helper/string/chunk/chunk';
export { s_countWords } from './lib/helper/string/count-words/count-words';
export { s_cut } from './lib/helper/string/cut/cut';
export { s_isEmail, s_isNoEmail } from './lib/helper/string/email/email';
export { s_from } from './lib/helper/string/from/from';
export { s_fromStorage } from './lib/helper/string/from-storage/from-storage';
export { s_generate } from './lib/helper/string/generator/generator';
export { s_imploder, ImploderBuilder } from './lib/helper/string/imploder/imploder';
export { s_is } from './lib/helper/string/is';
export { s_readTime } from './lib/helper/string/read-time/read-time';
export { s_stripWhitespace } from './lib/helper/string/strip-whitespace';
export { s_lowerCaseAllExceptFirstLetter, s_upperCaseFirstLetter } from './lib/helper/string/transformer/transformers';
export { s_truncate } from './lib/helper/string/truncate/truncate';
export { s_isUrl, s_isNoUrl } from './lib/helper/string/url/url';

export { i_complete, i_cookieEnabled, i_screenSize, i_mobile, BrowserInfo } from './lib/helper/browser';
export { cl_copy, cl_read } from './lib/helper/clipboard';
export { Stopwatch } from './lib/helper/stopwatch/stopwatch';
export { notNull, notNullAndUndefined } from './lib/helper/filter';
export { thr_sleep, thr_block } from './lib/helper/thread';

export { getLogMessage } from './lib/logger/log.header';
export { loggerOf, Logger, LogHelper } from './lib/logger/logger';

export * from './lib/types';
