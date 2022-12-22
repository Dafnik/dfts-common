import {AEntity} from '../entities/abstract-entity';
import {ManyOrUndefinedOrNullOr, UndefinedOrNullOr} from '../types';

declare global {
  interface Array<T> {
    /**
     * Removes item(s) from list
     * @return Array<T>
     */
    remove(items: ManyOrUndefinedOrNullOr<T>): Array<T>;
    /**
     * Shuffles array
     * @return Array<T>
     */
    shuffle(): Array<T>;

    /**
     * Returns <code>key</code> of objects in array
     * @param key extends keyof T
     * @return New array of keys
     */
    pluck(key: keyof T): Array<T[keyof T]>;

    containsDuplicates(): boolean;
  }
}

Array.prototype.remove = function <T>(items: ManyOrUndefinedOrNullOr<T>): Array<T> {
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
  return this;
};

Array.prototype.shuffle = function <T>(): Array<T> {
  for (let i = this.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [(this as Array<T>)[i], (this as Array<T>)[j]] = [(this as Array<T>)[j], (this as Array<T>)[i]];
  }
  return this;
};

Array.prototype.pluck = function <T, keyType extends keyof T>(key: keyType): Array<T[keyType]> {
  return (this as Array<T>).map((item) => item[key]);
};

Array.prototype.containsDuplicates = function (): boolean {
  return this.length !== new Set(this).size;
};

export class ArrayHelper {
  /**
   * @deprecated
   * Returns <code>true</code> if the array contains duplicates, <code>false</code> if not
   * @param {any[]} array
   * @return boolean
   */
  static containsDuplicates(array?: unknown[]): boolean {
    return array?.length !== new Set(array).size;
  }

  static containsEntity<T extends AEntity<number | string>>(array: T[], value: UndefinedOrNullOr<T>): boolean {
    if (!value) {
      return false;
    }
    for (const entity of array) {
      if (entity.hashCode() === value.hashCode()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Adds object to array if the object is absent
   * @param {T[]} array
   * @param {T|undefined} value
   * @return {T[]}
   */
  static addIfAbsent<T>(array: T[], value: UndefinedOrNullOr<T>): T[] {
    if (value && !array.includes(value)) {
      array.push(value);
    }
    return array;
  }

  /**
   * Adds entity to array if the entity is absent
   * @param {T[]} array
   * @param {T|undefined} value
   * @return {T[]}
   */
  static addEntityIfAbsent<T extends AEntity<number | string>>(array: T[], value: UndefinedOrNullOr<T>): T[] {
    if (value) {
      if (!this.containsEntity(array, value)) {
        array.push(value);
      }
    }
    return array;
  }

  /**
   * Adds object to array if the object is absent
   * @param {T[]} array
   * @param {T|undefined} value
   * @return {T[]}
   */
  static addIfPresent<T>(array: T[], value: UndefinedOrNullOr<T>): T[] {
    if (value && array.includes(value)) {
      array.push(value);
    }
    return array;
  }

  /**
   * Removes object from array if the object is present
   * @param {T[]} array
   * @param {T|undefined} value
   * @return {T[]}
   */
  static removeIfPresent<T>(array: T[], value: UndefinedOrNullOr<T>): T[] {
    if (value && array.includes(value)) {
      array.splice(array.indexOf(value), 1);
    }
    return array;
  }

  /**
   * Removes entity from array if the entity is present
   * @param {T[]} array
   * @param {T|undefined} value
   * @return {T[]}
   */
  static removeEntityIfPresent<T extends AEntity<number | string>>(array: T[], value: UndefinedOrNullOr<T>): T[] {
    if (this.containsEntity(array, value) && value) {
      array.splice(array.indexOf(value), 1);
    }
    return array;
  }

  /**
   * Removes entities from array if the entities are present
   * @param {T[]} array
   * @param {T[]} values
   * @return {T[]}
   */
  static removeEntitiesIfPresent<T extends AEntity<number | string>>(array: T[], values: T[]): T[] {
    const toRemove = [];
    for (const entity of array) {
      for (const value of values) {
        if (entity.hashCode() == value.hashCode()) {
          toRemove.push(entity);
        }
      }
    }
    for (const entity of toRemove) {
      array.splice(array.indexOf(entity), 1);
    }
    return array;
  }

  /**
   * Calls computeFunction with object if object is absent
   * @param {T[]} array
   * @param {T|undefined} toCheck
   * @param {(value: T)} computeFunction
   */
  static computeIfAbsent<T>(array: T[], toCheck: UndefinedOrNullOr<T>, computeFunction: (value: T) => void): void {
    if (toCheck && !array.includes(toCheck)) {
      computeFunction(toCheck);
    }
  }

  /**
   * Calls computeFunction with object if object is present
   * @param {T[]} array
   * @param {T|undefined} toCheck
   * @param {(value: T)} computeFunction
   */
  static computeIfPresent<T>(array: T[], toCheck: UndefinedOrNullOr<T>, computeFunction: (value: T) => void): void {
    if (toCheck && array.includes(toCheck)) {
      computeFunction(toCheck);
    }
  }
}
