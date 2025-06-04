import { IHasID, IHasName } from '.';

export type HasIDAndName<T> = IHasID<T> & IHasName;
