import {IHasID} from './entities/has-id.interface';
import {IHasName} from './entities/has-name.interface';
import {IList} from './collection/list.interface';

export type UnknownOr<T> = T | unknown;
export type UndefinedOr<T> = T | undefined;
export type NullOr<T> = T | null;
export type UndefinedOrNullOr<T> = UndefinedOr<NullOr<T>>;
export type NullOrUndefinedOr<T> = UndefinedOrNullOr<T>;
export type ManyOr<T> = T | T[];
export type ManyOrUndefinedOr<T> = UndefinedOr<ManyOr<T>>;
export type ManyOrNullOr<T> = NullOr<ManyOr<T>>;
export type ManyOrUndefinedOrNullOr<T> = UndefinedOrNullOr<ManyOr<T>>;

export type StringOr<T> = string | T;
export type StringOrNumber = StringOr<number>;
export type StringOrNumberOr<T> = StringOrNumber | T;

export type typeOfArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export type HasIDAndName<T> = IHasID<T> & IHasName;
export type HasNumberIDAndName = HasIDAndName<number>;
export type HasStringIDAndName = HasIDAndName<string>;

export interface IBuilder<T> {
  build(): T;
}

export interface IPredicate<T> {
  (item: T): boolean;
}

export interface ICompute<T> {
  (item: T): void;
}

export interface ICall {
  (): void;
}

export interface IMapList<itemType, mappedType> {
  (item: itemType, index: number, list: IList<itemType>): mappedType;
}

export interface IMap<itemType, mappedType> {
  (item: itemType, index: number, list: itemType[]): mappedType;
}

export type DateInput = UndefinedOrNullOr<StringOrNumberOr<Date>>;
