/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Directive, HostBinding, Input} from '@angular/core';
import {
  CdkCell,
  CdkCellDef,
  CdkColumnDef,
  CdkFooterCell,
  CdkFooterCellDef,
  CdkHeaderCell,
  CdkHeaderCellDef,
  CdkTable,
} from '@angular/cdk/table';

/**
 * Cell definition for the mat-table.
 * Captures the template of a column's data row cell as well as cell-specific properties.
 */
@Directive({
  selector: '[ngbCellDef]',
  providers: [{provide: CdkCellDef, useExisting: NgbCellDef}],
})
export class NgbCellDef<T> extends CdkCellDef {
  // leveraging syntactic-sugar syntax when we use *matCellDef
  @Input() ngbCellDefTable?: CdkTable<T>;

  // ngTemplateContextGuard flag to help with the Language Service
  static ngTemplateContextGuard<T>(dir: NgbCellDef<T>, ctx: unknown): ctx is {$implicit: T; index: number} {
    return true;
  }
}

/**
 * Header cell definition for the mat-table.
 * Captures the template of a column's header cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[ngbHeaderCellDef]',
  providers: [{provide: CdkHeaderCellDef, useExisting: NgbHeaderCellDef}],
})
export class NgbHeaderCellDef extends CdkHeaderCellDef {}

/**
 * Footer cell definition for the mat-table.
 * Captures the template of a column's footer cell and as well as cell-specific properties.
 */
@Directive({
  selector: '[ngbFooterCellDef]',
  providers: [{provide: CdkFooterCellDef, useExisting: NgbFooterCellDef}],
})
export class NgbFooterCellDef extends CdkFooterCellDef {}

/**
 * Column definition for the mat-table.
 * Defines a set of cells available for a table column.
 */
@Directive({
  selector: '[ngbColumnDef]',
  providers: [
    {provide: CdkColumnDef, useExisting: NgbColumnDef},
    {provide: 'NGB_SORT_HEADER_COLUMN_DEF', useExisting: NgbColumnDef},
  ],
})
export class NgbColumnDef extends CdkColumnDef {
  /** Unique name for this column. */
  @Input('ngbColumnDef')
  override get name(): string {
    return this._name;
  }

  override set name(name: string) {
    this._setNameInput(name);
  }
}

/** Header cell template container that adds the right classes and role. */
@Directive({
  selector: 'ngb-header-cell, th[ngb-header-cell]',
})
export class NgbHeaderCell extends CdkHeaderCell {}

/** Footer cell template container that adds the right classes and role. */
@Directive({
  selector: 'ngb-footer-cell, td[ngb-footer-cell]',
})
export class NgbFooterCell extends CdkFooterCell {}

/** Cell template container that adds the right classes and role. */
@Directive({
  selector: 'ngb-cell, td[ngb-cell]',
})
export class NgbCell extends CdkCell {
  @HostBinding('style.white-space')
  @Input()
  whiteSpace = 'nowrap';
}
