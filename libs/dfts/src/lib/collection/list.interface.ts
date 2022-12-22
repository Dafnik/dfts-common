import {ICompute, IMapList, IPredicate, ManyOrUndefinedOrNullOr, UndefinedOrNullOr} from '../types';
import {IGenericImplTrait} from '../traits/generic-impl-trait';

export interface IList<T> extends Array<T>, IGenericImplTrait<IList<T>> {
  getItems(): T[];

  /**
   * Returns new list of the same type
   */
  create(list?: IList<T>): IList<T>;

  createSimpleList<U>(): IList<U>;

  /**
   * Returns new (cloned) list
   */
  clone(): IList<T>;

  /**
   * Removes all items in list
   */
  removeAll(): void;

  /**
   * Get the length or size of list
   */
  size(): number;

  /**
   * Check if list is empty. Use <code>hasEntries()</code> to check if list has entries
   * @return boolean Returns <code>true</code> if list is empty, <code>false</code> if not
   */
  isEmpty(): boolean;

  /**
   * Check if list has entries. Use <code>isEmpty()</code> to check if list is empty
   * @return boolean Returns <code>ture</code> if list has entries, <code>false</code> if not
   */
  hasEntries(): boolean;

  /**
   * Sets all item(s) in list
   * @return IList<T> This list
   */
  set(items: ManyOrUndefinedOrNullOr<T>): IList<T>;

  /**
   * Adds item(s) to list
   * @return IList<T> This list
   */
  add(items: ManyOrUndefinedOrNullOr<T>): IList<T>;

  /**
   * Adds item(s) to list if filter fulfills
   * @return IList<t> This list
   */
  addIf(items: ManyOrUndefinedOrNullOr<T>, filterFn: IPredicate<T>): IList<T>;

  /**
   * Adds item(s) to list if item(s) is absent
   * @return IList<t> This list
   */
  addIfAbsent(items: ManyOrUndefinedOrNullOr<T>): IList<T>;

  /**
   * Removes item(s) from list if filter fulfills
   * @return IList<T> This list
   */
  removeIf(items: ManyOrUndefinedOrNullOr<T>, filterFn: IPredicate<T>): IList<T>;

  /**
   * Removes item(s) from list if the item(s) are present
   * @return IList<T> This list
   */
  removeIfPresent(items: ManyOrUndefinedOrNullOr<T>): IList<T>;

  /**
   * Checks list for duplicates
   * @return Returns <code>true</code> if this list contains duplicates, <code>false</code> if not
   */
  containsDuplicates(): boolean;

  /**
   * Checks if list contains item
   * @return Returns <code>true</code> if list contains the item, <code>false</code> if not
   */
  containsAny(item: UndefinedOrNullOr<T>): boolean;

  /**
   * Checks if list does not contain item
   * @return Returns <code>true</code> if list does not contain item, <code>false</code> if not
   */
  containsNone(item: UndefinedOrNullOr<T>): boolean;

  /**
   * Calls callbackFn on each item
   * @return New list of callback result
   */
  map<mappedType>(callbackFn: IMapList<T, mappedType>): IList<mappedType>;

  /**
   * Calls callbackFn on each item if filter fulfills
   * @return This list
   */
  forEachIf(callbackFn: ICompute<T>, filterFn: IPredicate<T>): IList<T>;

  /**
   * Calls callbackFn on each item if item(s) are present
   * @return This list
   */
  computeIfPresent(items: ManyOrUndefinedOrNullOr<T>, callbackFn: ICompute<T>): IList<T>;

  /**
   * Calls callbackFn on each item if item(s) are absent
   * @return This list
   */
  computeIfAbsent(items: ManyOrUndefinedOrNullOr<T>, callbackFn: ICompute<T>): IList<T>;
}
