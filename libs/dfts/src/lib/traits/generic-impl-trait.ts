export interface IGenericImplTrait<T extends IGenericImplTrait<T>> {
  thisAsT(): T;
}
