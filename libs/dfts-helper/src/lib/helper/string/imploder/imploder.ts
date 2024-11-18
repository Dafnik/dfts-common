import { s_from } from '../from/from';

export function s_imploder(): ImploderBuilder {
  return new ImploderBuilder();
}

export class ImploderBuilder {
  private _maxLength?: number | null;
  private _offset?: number | null;
  private _separator?: string | null;
  private _suffix?: string | null;
  private _forceSuffix?: boolean | null;
  private _source?: string[] | null;

  source<T extends string>(source: T[] | null | undefined, mapFn?: (it: T) => string): this;

  source<T>(source: T[] | null | undefined, mapFn: (it: T) => string): this;

  source<T>(source: T[] | null | undefined, mapFn?: (it: T) => string): this {
    if (source) {
      if (source.every((it) => typeof it === 'string')) {
        this._source = source as string[];
      } else if (mapFn) {
        this._source = source.map(mapFn);
      } else {
        throw 'mapFn required on none string arrays';
      }
    }
    return this;
  }

  /**
   * @DEPRECATED Please use .source([], (it: T) => string)
   */
  mappedSource<T>(source?: T[] | null, mapFn?: (it: T) => string): this {
    if (mapFn && source) {
      this._source = source.map(mapFn);
    } else if (source && source.every((it: T) => typeof it === 'string' || typeof it === 'boolean' || typeof it === 'number')) {
      this._source = source.map((it) => s_from(it as string | boolean | number));
    }
    return this;
  }

  maxLength(maxLength?: number | null): this {
    this._maxLength = maxLength;
    return this;
  }

  offset(offset?: number | null): this {
    this._offset = offset;
    return this;
  }

  separator(separator?: string | null): this {
    this._separator = separator;
    return this;
  }

  suffix(suffix?: string | null): this {
    this._suffix = suffix;
    return this;
  }

  forceSuffix(forceSuffix?: boolean | null): this {
    this._forceSuffix = forceSuffix;
    return this;
  }

  build(): string {
    if (!this._source) {
      return '';
    }

    let source = this._source;
    if (this._offset) {
      source = source.slice(this._offset, source.length);
    }

    const joinedSource = source.join(this._separator ?? '');

    if (this._maxLength && joinedSource.length > this._maxLength) {
      return `${joinedSource.slice(0, this._maxLength)}${this._suffix ?? ''}`;
    }
    return `${joinedSource}${this._forceSuffix ? (this._suffix ?? '') : ''}`;
  }
}
