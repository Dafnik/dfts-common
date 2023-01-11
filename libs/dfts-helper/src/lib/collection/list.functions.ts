import {IEntity} from '../entities/entity.interface';
import {EntityList} from './entity-list';
import {List} from './list';
import {StringOrNumber} from '../types';

export function listOf<T>(...items: T[]): List<T> {
  return new List<T>(items);
}

export function eListOf<T extends IEntity<StringOrNumber>>(...items: T[]): EntityList<T> {
  return new EntityList<T>(items);
}
