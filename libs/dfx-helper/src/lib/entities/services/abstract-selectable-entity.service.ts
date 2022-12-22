import {HttpClient} from '@angular/common/http';
import {distinctUntilChanged, Observable, share, startWith, Subject, tap} from 'rxjs';
import {IEntity, StorageHelper, StringOrNumber, UndefinedOr} from 'dfts';

import {AEntityService} from './abstract-entity.service';

export abstract class ASelectableEntityService<idType extends StringOrNumber, EntityType extends IEntity<idType>> extends AEntityService<
  idType,
  EntityType
> {
  protected abstract selectedStorageKey: string;

  protected selected?: EntityType;
  selectedChange: Subject<UndefinedOr<EntityType>> = new Subject<UndefinedOr<EntityType>>();

  protected constructor(httpClient: HttpClient) {
    super(httpClient);

    this.allChange.pipe(
      tap((entities) => {
        for (const entity of entities) {
          if (this.selected?.id === entity.id) {
            this.setSelected(entity);
            break;
          }
        }
      })
    );
  }

  getSelected$(): Observable<UndefinedOr<EntityType>> {
    return this.selectedChange.pipe(
      distinctUntilChanged(),
      startWith(StorageHelper.getObject(this.selectedStorageKey) as EntityType | undefined),
      share()
    );
  }

  getSelected(): UndefinedOr<EntityType> {
    if (this.selected == undefined) {
      const selected = StorageHelper.getObject(this.selectedStorageKey) as EntityType;
      if (selected) {
        this.selected = selected;
        this.selectedChange.next(this.selected);
      }
    }
    return this.selected;
  }

  setSelected(selected: UndefinedOr<EntityType>): void {
    this.selected = selected;
    StorageHelper.set(this.selectedStorageKey, this.selected);
    this.selectedChange.next(this.selected);
  }
}
