export const s_imploder = (source?: string[] | null): ImploderBuilder => {
  return ImploderBuilder.get(source);
};

export class ImploderBuilder {
  private _maxLength?: number | null;
  private _offset?: number | null;
  private _separator?: string | null;
  private _suffix?: string | null;
  private _source?: string[] | null;

  static get(source?: string[] | null): ImploderBuilder {
    return new ImploderBuilder().source(source);
  }

  source(source?: string[] | null): this {
    this._source = source;
    return this;
  }

  mappedSource<T>(source?: T[] | null, mapFn?: (it: T) => string): this {
    if (mapFn && source) {
      this._source = source.map(mapFn);
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
