import {StringOrNumber} from '../types.js';
import {IHasID} from './has-id.interface.js';
import {IHasName} from './has-name.interface.js';

export interface IEntity<idType extends StringOrNumber> extends IHasID<idType> {
  originalJsonDto?: unknown;

  toString(): string;

  hashCode(): idType;

  equals(object: unknown): boolean;
}

export type IEntityWithNumberID = IEntity<number>;

export type IEntityWithStringID = IEntity<string>;

/**
 * @since 3.2.5
 */
export type IEntityWithName<idType extends StringOrNumber> = IEntity<idType> & IHasName;

/**
 * @since 3.2.5
 */
export type IEntityWithNumberIDAndName = IEntityWithName<number>;

/**
 * @since 3.2.5
 */
export type IEntityWithStringIDAndName = IEntityWithName<string>;
