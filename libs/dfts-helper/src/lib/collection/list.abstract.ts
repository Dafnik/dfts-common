import {IList} from './list.interface.js';
import {ICompute, IMapList, IPredicate, ManyOrUndefinedOrNullOr, UndefinedOrNullOr} from '../types.js';
import {c_unchecked} from '../helper/converter/converter.js';

export abstract class ACommonList<listType extends IList<T>, T> extends Array<T> implements IList<T> {
  protected constructor(items?: ManyOrUndefinedOrNullOr<T>) {
    super();
    if (items) {
      this.add(items);
    }
  }

  thisAsT(): listType {
    return c_unchecked(this);
  }

  abstract create(list?: listType): listType;

  abstract createSimpleList<U>(): IList<U>;

  clone(): listType {
    return this.create(this.thisAsT());
  }

  getItems(): T[] {
    return this;
  }

  removeAll(): void {
    this.splice(0, this.length);
  }

  size(): number {
    return this.length;
  }

  isEmpty(): boolean {
    return this.size() === 0;
  }

  hasEntries(): boolean {
    return !this.isEmpty();
  }

  set(items: ManyOrUndefinedOrNullOr<T>): listType {
    this.removeAll();
    return this.add(items);
  }

  add(items: ManyOrUndefinedOrNullOr<T>): listType {
    if (Array.isArray(items)) {
      for (const item of items) {
        this.push(item);
      }
    } else if (items) {
      this.push(items);
    }
    return this.thisAsT();
  }

  addIf(items: ManyOrUndefinedOrNullOr<T>, filterFn: IPredicate<T>): listType {
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && filterFn(item)) {
          this.add(item);
        }
      }
    } else {
      if (items && filterFn(items)) {
        this.add(items);
      }
    }
    return this.thisAsT();
  }

  addIfAbsent(items: ManyOrUndefinedOrNullOr<T>): listType {
    return this.addIf(items, (item) => this.containsNone(item));
  }

  remove(items: ManyOrUndefinedOrNullOr<T>): listType {
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item) {
          const itemIndex = this.indexOf(item);
          if (itemIndex !== -1) {
            this.splice(itemIndex, 1);
          }
        }
      }
    } else if (items) {
      const itemIndex = this.indexOf(items);
      if (itemIndex !== -1) {
        this.splice(itemIndex, 1);
      }
    }
    return this.thisAsT();
  }

  removeIf(items: ManyOrUndefinedOrNullOr<T>, filterFn: IPredicate<T>): listType {
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && filterFn(item)) {
          const itemIndex = this.indexOf(item);
          if (itemIndex !== -1) {
            this.splice(itemIndex, 1);
          }
        }
      }
    } else if (items && filterFn(items)) {
      const itemIndex = this.indexOf(items);
      if (itemIndex !== -1) {
        this.splice(itemIndex, 1);
      }
    }
    return this.thisAsT();
  }

  removeIfPresent(items: ManyOrUndefinedOrNullOr<T>): listType {
    return this.removeIf(items, (item) => {
      return this.containsAny(item);
    });
  }

  containsDuplicates(): boolean {
    return this.length !== new Set(this).size;
  }

  containsAny(item: UndefinedOrNullOr<T>): boolean {
    if (!item) {
      return false;
    }
    return this.includes(item);
  }

  containsNone(item: UndefinedOrNullOr<T>): boolean {
    if (!item) {
      return false;
    }
    return !this.includes(item);
  }

  override map<mappedType>(callbackFn: IMapList<T, mappedType>): IList<mappedType> {
    const result = this.createSimpleList<mappedType>();
    for (let index = 0; index < this.length; index++) {
      result.add(callbackFn(this[index], index, this.thisAsT()));
    }
    return result;
  }

  pluck<keyType extends keyof T>(key: keyType): IList<T[keyType]> {
    return this.map((item) => item[key]);
  }

  forEachIf(callbackFn: ICompute<T>, filterFn: IPredicate<T>): listType {
    for (const item of this) {
      if (item && filterFn(item)) {
        callbackFn(item);
      }
    }
    return this.thisAsT();
  }

  computeIfPresent(items: ManyOrUndefinedOrNullOr<T>, callbackFn: ICompute<T>): listType {
    return this.computeIf(items, callbackFn, (item) => this.containsAny(item));
  }

  computeIfAbsent(items: ManyOrUndefinedOrNullOr<T>, callbackFn: ICompute<T>): listType {
    return this.computeIf(items, callbackFn, (item) => this.containsNone(item));
  }

  private computeIf(items: ManyOrUndefinedOrNullOr<T>, callbackFn: ICompute<T>, filterFn: IPredicate<T>): listType {
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item && filterFn(item)) {
          callbackFn(item);
        }
      }
    } else if (items && filterFn(items)) {
      callbackFn(items);
    }
    return this.thisAsT();
  }

  shuffle(): listType {
    for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
    }
    return this.thisAsT();
  }
}
