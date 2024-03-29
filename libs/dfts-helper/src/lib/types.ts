import { IHasID } from './entities/has-id.interface';
import { IHasName } from './entities/has-name.interface';

export type UndefinedOr<T> = T | undefined;
export type NullOr<T> = T | null;
export type UndefinedOrNullOr<T> = UndefinedOr<NullOr<T>>;

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

export interface IMap<itemType, mappedType> {
  (item: itemType, index: number, list: itemType[]): mappedType;
}

export type DateInput = UndefinedOrNullOr<string | number | Date>;
