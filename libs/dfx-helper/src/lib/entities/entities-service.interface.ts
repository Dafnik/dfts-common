import { Observable } from 'rxjs';
import { IHasID } from 'dfts-helper';

export interface HasGetAll<T> {
  getAll$(): Observable<T[]>;
}

export interface HasGetByParent<EntityType, ParentType extends IHasID<ParentType['id']>> {
  getByParent$(id: ParentType['id']): Observable<EntityType[]>;
}

export interface HasGetSingle<T extends IHasID<T['id']>> {
  getSingle$(id: T['id']): Observable<T>;
}

export interface HasGetSelected<SelectedDTOType extends IHasID<SelectedDTOType['id']>> {
  setSelected(it: SelectedDTOType | undefined): void;

  getSelected$: Observable<SelectedDTOType | undefined>;
}

export interface HasDelete<T extends IHasID<T['id']>> {
  delete$(id: T['id']): Observable<unknown>;
}

export type HasCreate<CreateDTOType, ResponseType extends IHasID<ResponseType['id']>> = {
  create$(dto: CreateDTOType): Observable<ResponseType>;
};

export interface HasUpdate<UpdateDTOType extends IHasID<UpdateDTOType['id']>, ResponseType extends IHasID<ResponseType['id']>> {
  update$(dto: UpdateDTOType): Observable<ResponseType>;
}
