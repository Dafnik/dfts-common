import { StringOrNumber } from '../types';

/**
 * @since 3.2.5
 */
export type IHasID<idType> = {
  id: idType;
};

/**
 * @since 3.2.5
 */
export type IHasNumberID = IHasID<number>;

/**
 * @since 3.2.5
 */
export type IHasStringID = IHasID<string>;

export type IHasStringOrNumberID = IHasID<StringOrNumber>;
