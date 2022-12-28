import {HttpClient} from '@angular/common/http';
import {distinctUntilChanged, Observable, share, startWith, Subject, tap} from 'rxjs';
import {IEntity, o_fromStorage, st_set, StringOrNumber, UndefinedOr} from '@dfts-common/dfts-helper';

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
    return this.selectedChange.pipe(distinctUntilChanged(), startWith(o_fromStorage<EntityType>(this.selectedStorageKey)), share());
  }

  getSelected(): UndefinedOr<EntityType> {
    if (this.selected == undefined) {
      const selected = o_fromStorage<EntityType>(this.selectedStorageKey);
      if (selected) {
        this.selected = selected;
        this.selectedChange.next(this.selected);
      }
    }
    return this.selected;
  }

  setSelected(selected: UndefinedOr<EntityType>): void {
    this.selected = selected;
    st_set(this.selectedStorageKey, this.selected);
    this.selectedChange.next(this.selected);
  }
}
