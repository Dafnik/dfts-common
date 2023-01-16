/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {ChangeDetectionStrategy, Component, Directive, Input, ViewEncapsulation} from '@angular/core';
import {
  CDK_ROW_TEMPLATE,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef,
  CdkTable,
} from '@angular/cdk/table';

/**
 * Header row definition for the mat-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[ngbHeaderRowDef]',
  providers: [{provide: CdkHeaderRowDef, useExisting: NgbHeaderRowDef}],
  inputs: ['columns: ngbHeaderRowDef'],
})
export class NgbHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the mat-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[ngbFooterRowDef]',
  providers: [{provide: CdkFooterRowDef, useExisting: NgbFooterRowDef}],
  inputs: ['columns: ngbFooterRowDef'],
})
export class NgbFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the mat-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[ngbRowDef]',
  providers: [{provide: CdkRowDef, useExisting: NgbRowDef}],
  inputs: ['columns: ngbRowDefColumns', 'when: ngbRowDefWhen'],
})
export class NgbRowDef<T> extends CdkRowDef<T> {
  @Input() ngbRowDefTable?: CdkTable<T>;

  static ngTemplateContextGuard<T>(dir: NgbRowDef<T>, ctx: unknown): ctx is {$implicit: T; index: number} {
    return true;
  }
}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-header-row, tr[ngb-header-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbHeaderRow',
  providers: [{provide: CdkHeaderRow, useExisting: NgbHeaderRow}],
})
export class NgbHeaderRow extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-footer-row, tr[ngb-footer-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbFooterRow',
  providers: [{provide: CdkFooterRow, useExisting: NgbFooterRow}],
})
export class NgbFooterRow extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-row, tr[ngb-row]',
  template: CDK_ROW_TEMPLATE,
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbRow',
  providers: [{provide: CdkRow, useExisting: NgbRow}],
})
export class NgbRow extends CdkRow {}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
  selector: 'ng-template[ngbNoDataRow]',
  providers: [{provide: CdkNoDataRow, useExisting: NgbNoDataRow}],
})
export class NgbNoDataRow extends CdkNoDataRow {
  override _contentClassName = 'ngb-no-data-row';
}
