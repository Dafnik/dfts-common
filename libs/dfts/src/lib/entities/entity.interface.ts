import {StringOrNumber} from '../types';
import {IHasID} from './has-id.interface';
import {IHasName} from './has-name.interface';

export interface IEntity<idType extends StringOrNumber> extends IHasID<idType> {
  originalJsonDto?: any;

  toString(): string;

  hashCode(): idType;

  equals(object: any): boolean;
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
