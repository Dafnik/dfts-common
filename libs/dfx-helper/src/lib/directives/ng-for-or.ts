import {Directive, inject, Input} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import {UndefinedOrNullOr} from '@dfts-common/dfts-helper';

@Directive({
  selector: '[ngForOr]',
  standalone: true,
  hostDirectives: [
    {
      directive: NgFor,
      inputs: ['ngForOf'],
    },
    {
      directive: NgIf,
      inputs: ['ngIfElse:ngForEmpty'],
    },
  ],
})
export class NgForOr<T> {
  private ngIf = inject(NgIf);

  @Input() set ngForOf(ngFor: UndefinedOrNullOr<T[]>) {
    this.ngIf.ngIf = ngFor && ngFor.length !== 0;
  }
}
