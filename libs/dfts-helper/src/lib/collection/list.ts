import {IList} from './list.interface.js';
import {ACommonList} from './list.abstract.js';
import {ManyOrUndefinedOrNullOr} from '../types.js';
import {listOf} from './list.functions.js';

export type IArrayList<T> = IList<T>;

export class List<T> extends ACommonList<List<T>, T> implements IArrayList<T> {
  constructor(items?: ManyOrUndefinedOrNullOr<T>) {
    super(items);
  }

  create(list?: List<T>): List<T> {
    return new List<T>(list);
  }

  createSimpleList<U>(): List<U> {
    return listOf<U>();
  }
}
