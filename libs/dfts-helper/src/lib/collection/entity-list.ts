import {IList} from './list.interface.js';
import {ACommonList} from './list.abstract.js';
import {IEntity} from '../entities/entity.interface.js';
import {ManyOrUndefinedOrNullOr, StringOrNumber, UndefinedOrNullOr} from '../types.js';
import {List} from './list.js';
import {listOf} from './list.functions.js';

export type IEntityList<T extends IEntity<StringOrNumber>> = IList<T>;

export class EntityList<T extends IEntity<StringOrNumber>> extends ACommonList<EntityList<T>, T> implements IEntityList<T> {
  constructor(items?: ManyOrUndefinedOrNullOr<T>) {
    super(items);
  }

  create(list?: EntityList<T>): EntityList<T> {
    return new EntityList<T>(list);
  }

  createSimpleList<U>(): List<U> {
    return listOf<U>();
  }

  override containsAny(item: UndefinedOrNullOr<T>): boolean {
    if (!item) {
      return false;
    }
    for (const entity of this) {
      if (entity.hashCode() === item.hashCode()) {
        return true;
      }
    }
    return false;
  }

  override containsNone(item: UndefinedOrNullOr<T>): boolean {
    if (!item) {
      return false;
    }
    for (const entity of this) {
      if (entity.hashCode() === item.hashCode()) {
        return false;
      }
    }
    return true;
  }

  override indexOf(searchElement: T, fromIndex = 0): number {
    for (let i = fromIndex; i < this.size(); i++) {
      if (this[i].hashCode() === searchElement.hashCode()) {
        return i;
      }
    }
    return -1;
  }
}
