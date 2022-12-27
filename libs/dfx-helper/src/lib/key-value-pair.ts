import {HttpParams} from '@angular/common/http';
import {loggerOf, s_from, UndefinedOrNullOr} from 'dfts';

export class KeyValuePair {
  private static logger = loggerOf('KeyValuePair');

  constructor(public readonly key: string, public readonly value: string | boolean | number | undefined | null) {}

  static parse(
    url: UndefinedOrNullOr<string>,
    keyValuePairs: UndefinedOrNullOr<KeyValuePair[]>,
    disableParsingMatchingCheck = false
  ): string | undefined {
    if (!url) {
      return undefined;
    }
    if (keyValuePairs) {
      if (
        keyValuePairs
          .map((keyValuePair) => {
            return keyValuePair.key;
          })
          .containsDuplicates()
      ) {
        this.logger.error('parse', 'KeyValuePairs contains duplicates', keyValuePairs);
        throw 'KeyValuePairs contains duplicates';
      }

      for (const keyValuePair of keyValuePairs) {
        const key = '{' + keyValuePair.key + '}';
        if (!disableParsingMatchingCheck && !url.includes(key)) {
          this.logger.error('parse', 'Url does not match all KeyValuePairs; URL: "' + url + '"', keyValuePairs);
          throw 'Url does not match all KeyValuePairs';
        }
        if (keyValuePair.value !== undefined && keyValuePair.value !== null) {
          url = url.replace(key, s_from(keyValuePair.value));
        }
      }
    }

    if (!disableParsingMatchingCheck && (url?.includes('{') || url.includes('}'))) {
      this.logger.error('parse', 'KeyValuePairs does not match all keys in url; URL: "' + url + '"', keyValuePairs);
      throw 'KeyValuePairs does not match all keys in url';
    }

    return url;
  }

  static parseIntoHttpParams(keyValuePairs: UndefinedOrNullOr<KeyValuePair[]>): HttpParams | undefined {
    if (keyValuePairs === undefined || keyValuePairs === null || keyValuePairs.length === 0) {
      return undefined;
    }

    if (
      keyValuePairs
        .map((keyValuePair) => {
          return keyValuePair.key;
        })
        .containsDuplicates()
    ) {
      this.logger.error('parse', 'KeyValuePairs contains duplicates', keyValuePairs);
      throw 'KeyValuePairs contains duplicates';
    }

    let params = new HttpParams();
    for (const keyValuePair of keyValuePairs) {
      if (keyValuePair.value !== undefined && keyValuePair.value !== null) {
        params = params.append(keyValuePair.key, keyValuePair.value);
      }
    }
    return params;
  }
}
