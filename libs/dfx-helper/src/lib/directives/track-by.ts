import {Directive, Host, Input, NgIterable, NgModule} from '@angular/core';
import {NgForOf} from '@angular/common';
import {StringOrNumber} from '@dfts-common/dfts-helper';

@Directive({
  selector: '[ngForTrackByProperty]',
  standalone: true,
})
export class DfxTrackByProperty<T, U extends NgIterable<T> = NgIterable<T>> {
  @Input('ngForTrackByProperty') propertyName!: keyof T;

  // We don't use this, we just need it so Ivy will give us a type for T
  @Input() ngForOf!: U & NgIterable<T>;

  constructor(@Host() ngFor: NgForOf<T, U>) {
    ngFor.ngForTrackBy = (index: number, item: T) => item[this.propertyName];
  }
}

@Directive({
  selector: '[ngForTrackById]',
  standalone: true,
})
export class DfxTrackById<T extends {id: StringOrNumber}> {
  constructor(@Host() ngFor: NgForOf<T>) {
    ngFor.ngForTrackBy = (_: number, item: T) => item.id;
  }
}

@Directive({
  selector: '[ngForTrackByIndex]',
  standalone: true,
})
export class DfxTrackByIndex {
  constructor(@Host() ngFor: NgForOf<unknown>) {
    ngFor.ngForTrackBy = (index: number) => index;
  }
}

@NgModule({
  imports: [DfxTrackById, DfxTrackByProperty, DfxTrackByIndex],
  exports: [DfxTrackById, DfxTrackByProperty, DfxTrackByIndex],
})
export class DfxTrackByModule {}
