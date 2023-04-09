import {IEntity} from '../entities/entity.interface.js';
import {EntityList} from './entity-list.js';
import {List} from './list.js';
import {StringOrNumber} from '../types.js';

export function listOf<T>(...items: T[]): List<T> {
  return new List<T>(items);
}

export function eListOf<T extends IEntity<StringOrNumber>>(...items: T[]): EntityList<T> {
  return new EntityList<T>(items);
}
