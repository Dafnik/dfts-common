/*
 * Public API Surface of dfts
 */

export * from './lib/collection/entity-list';
export * from './lib/collection/list.abstract';
export * from './lib/collection/list.functions';
export * from './lib/collection/list.interface';
export * from './lib/collection/list';

export * from './lib/decorators/confirmable';
export * from './lib/decorators/delay';
export * from './lib/decorators/measure-time';
export * from './lib/decorators/once';
export * from './lib/decorators/remember-result';
export * from './lib/decorators/run-outside-change-detection';
export * from './lib/decorators/throttle';

export * from './lib/entities/abstract-entity';
export * from './lib/entities/abstract-entity-with-name';
export * from './lib/entities/entity.interface';
export * from './lib/entities/entity';
export * from './lib/entities/has-id.interface';
export * from './lib/entities/has-name.interface';

export {a_computeIfAbsent} from './lib/helper/array/compute-if-absent';
export {a_computeIfPresent} from './lib/helper/array/compute-if-present';
export {a_containsDuplicates} from './lib/helper/array/contains-duplicates';
export {a_forEachIf} from './lib/helper/array/for-each-if';
export {a_hasEntries} from './lib/helper/array/has-entries';
export {a_isEmpty} from './lib/helper/array/is-empty';
export {a_pluck} from './lib/helper/array/pluck';
export {a_pushIf} from './lib/helper/array/push-if';
export {a_pushIfAbsent} from './lib/helper/array/push-if-absent';
export {a_remove} from './lib/helper/array/remove';
export {a_removeIf} from './lib/helper/array/remove-if';
export {a_shuffle} from './lib/helper/array/shuffle';

export {b_from} from './lib/helper/boolean/from';
export {b_fromStorage} from './lib/helper/boolean/from-storage';
export {b_is} from './lib/helper/boolean/is';

export {d_format} from './lib/helper/date/format-date';
export {d_formatWithHoursMinutesAndSeconds} from './lib/helper/date/format-date-with-hours-minutes-seconds';
export {d_from} from './lib/helper/date/from';
export {d_fromStorage} from './lib/helper/date/from-storage';
export {d_is} from './lib/helper/date/is';
export {d_timeLeft} from './lib/helper/date/time-left';
export {d_timespan} from './lib/helper/date/timespan';

export {n_from} from './lib/helper/number/from';
export {n_fromStorage} from './lib/helper/number/from-storage';
export {n_generate_int, n_generate_float} from './lib/helper/number/generator';
export {n_humanizeTime} from './lib/helper/number/humanize-time';
export {n_is} from './lib/helper/number/is';
export {n_isNumeric} from './lib/helper/number/is-numeric';

export {o_fromStorage} from './lib/helper/object/from-storage';
export {o_is} from './lib/helper/object/is';

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
export {st_exists} from './lib/helper/storage/exists';
export {st_remove} from './lib/helper/storage/remove';
export {st_set} from './lib/helper/storage/set';

export {StringHelper} from './lib/helper/string/_string';
export {s_chunks} from './lib/helper/string/chunk';
export {s_countWords} from './lib/helper/string/count-words';
export {s_cut} from './lib/helper/string/cut';
export {s_isEmail, s_isNoEmail} from './lib/helper/string/email';
export {s_from} from './lib/helper/string/from';
export {s_fromStorage} from './lib/helper/string/from-storage';
export {s_generate} from './lib/helper/string/generator';
export {s_imploder, ImploderBuilder} from './lib/helper/string/imploder';
export {s_is} from './lib/helper/string/is';
export {s_readTime} from './lib/helper/string/read-time';
export {s_stripWhitespace} from './lib/helper/string/strip-whitespace';
export {s_lowerCaseAllExceptFirstLetter, s_upperCaseFirstLetter} from './lib/helper/string/transformers';
export {s_truncate} from './lib/helper/string/truncate';
export {s_isUrl, s_isNoUrl} from './lib/helper/string/url';

export {i_complete, i_cookieEnabled, i_screenSize, i_mobile, BrowserInfo} from './lib/helper/browser';
export {cl_copy, cl_read} from './lib/helper/clipboard';
export {c_nullToUndefined, c_undefinedToNull, c_unchecked} from './lib/helper/converter';
export {Stopwatch} from './lib/helper/stopwatch';
export {thr_sleep, thr_block} from './lib/helper/thread';

export {getLogMessage} from './lib/logger/log.header';
export {loggerOf, Logger, LogHelper} from './lib/logger/logger';

export {IGenericImplTrait} from './lib/traits/generic-impl-trait';

export * from './lib/types';
