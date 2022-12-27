import {AEntity} from '../entities/abstract-entity';
import {UndefinedOrNullOr} from '../types';

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

  /**
   * @deprecated
   * @param array
   * @param value
   */
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
   * @deprecated
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
