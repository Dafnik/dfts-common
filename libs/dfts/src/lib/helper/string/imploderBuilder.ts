import {IBuilder, IMap, UndefinedOrNullOr} from '../../types';

export const imploderBuilder = (source?: UndefinedOrNullOr<string[]>): ImploderBuilder => {
  return new ImploderBuilder().source(source);
};

export class ImploderBuilder implements IBuilder<string> {
  private _maxLength?: UndefinedOrNullOr<number>;
  private _offset?: UndefinedOrNullOr<number>;
  private _separator?: UndefinedOrNullOr<string>;
  private _suffix?: UndefinedOrNullOr<string>;
  private _source?: UndefinedOrNullOr<string[]>;

  source(source?: UndefinedOrNullOr<string[]>): this {
    this._source = source;
    return this;
  }

  mappedSource<T>(source?: UndefinedOrNullOr<T[]>, mapFn?: IMap<T, string>): this {
    if (mapFn && source) {
      this._source = source.map(mapFn);
    }
    return this;
  }

  maxLength(maxLength?: UndefinedOrNullOr<number>): this {
    this._maxLength = maxLength;
    return this;
  }

  offset(offset?: UndefinedOrNullOr<number>): this {
    this._offset = offset;
    return this;
  }

  separator(separator?: UndefinedOrNullOr<string>): this {
    this._separator = separator;
    return this;
  }

  suffix(suffix?: UndefinedOrNullOr<string>): this {
    this._suffix = suffix;
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

    const toReturn = source.join(this._separator ?? '');

    if (this._maxLength && toReturn.length > this._maxLength) {
      return `${toReturn.slice(0, this._maxLength)}${this._suffix ?? ''}`;
    }
    return toReturn;
  }
}
