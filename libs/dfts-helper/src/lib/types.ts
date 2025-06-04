export type typeOfArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
  ? ElementType
  : never;

export interface IBuilder<T> {
  build(): T;
}

export interface IPredicate<T> {
  (item: T): boolean;
}

export interface ICompute<T> {
  (item: T): void;
}

export type DateInput = string | number | Date | null | undefined;
