/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {
  CdkCellOutlet,
  CdkFooterRow,
  CdkFooterRowDef,
  CdkHeaderRow,
  CdkHeaderRowDef,
  CdkNoDataRow,
  CdkRow,
  CdkRowDef,
} from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Directive, ViewEncapsulation, booleanAttribute } from '@angular/core';

// We can't reuse `CDK_ROW_TEMPLATE` because it's incompatible with local compilation mode.
const ROW_TEMPLATE = `<ng-container cdkCellOutlet></ng-container>`;

/**
 * Header row definition for the ngb-table.
 * Captures the header row's template and other header properties such as the columns to display.
 */
@Directive({
  selector: '[ngbHeaderRowDef]',
  providers: [{ provide: CdkHeaderRowDef, useExisting: NgbHeaderRowDef }],
  inputs: [
    { name: 'columns', alias: 'ngbHeaderRowDef' },
    { name: 'sticky', alias: 'ngbHeaderRowDefSticky', transform: booleanAttribute },
  ],
  standalone: true,
})
export class NgbHeaderRowDef extends CdkHeaderRowDef {}

/**
 * Footer row definition for the ngb-table.
 * Captures the footer row's template and other footer properties such as the columns to display.
 */
@Directive({
  selector: '[ngbFooterRowDef]',
  providers: [{ provide: CdkFooterRowDef, useExisting: NgbFooterRowDef }],
  inputs: [
    { name: 'columns', alias: 'ngbFooterRowDef' },
    { name: 'sticky', alias: 'ngbFooterRowDefSticky', transform: booleanAttribute },
  ],
  standalone: true,
})
export class NgbFooterRowDef extends CdkFooterRowDef {}

/**
 * Data row definition for the ngb-table.
 * Captures the data row's template and other properties such as the columns to display and
 * a when predicate that describes when this row should be used.
 */
@Directive({
  selector: '[ngbRowDef]',
  providers: [{ provide: CdkRowDef, useExisting: NgbRowDef }],
  inputs: [
    { name: 'columns', alias: 'ngbRowDefColumns' },
    { name: 'when', alias: 'ngbRowDefWhen' },
  ],
  standalone: true,
})
export class NgbRowDef<T> extends CdkRowDef<T> {}

/** Header template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-header-row, tr[ngb-header-row]',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbHeaderRow',
  providers: [{ provide: CdkHeaderRow, useExisting: NgbHeaderRow }],
  imports: [CdkCellOutlet],
})
export class NgbHeaderRow extends CdkHeaderRow {}

/** Footer template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-footer-row, tr[ngb-footer-row]',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbFooterRow',
  providers: [{ provide: CdkFooterRow, useExisting: NgbFooterRow }],
  imports: [CdkCellOutlet],
})
export class NgbFooterRow extends CdkFooterRow {}

/** Data row template container that contains the cell outlet. Adds the right class and role. */
@Component({
  selector: 'ngb-row, tr[ngb-row]',
  template: ROW_TEMPLATE,
  host: {
    role: 'row',
  },
  // See note on CdkTable for explanation on why this uses the default change detection strategy.
  // tslint:disable-next-line:validate-decorators
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
  exportAs: 'ngbRow',
  providers: [{ provide: CdkRow, useExisting: NgbRow }],
  imports: [CdkCellOutlet],
})
export class NgbRow extends CdkRow {}

/** Row that can be used to display a message when no data is shown in the table. */
@Directive({
  selector: 'ng-template[ngbNoDataRow]',
  providers: [{ provide: CdkNoDataRow, useExisting: NgbNoDataRow }],
  standalone: true,
})
export class NgbNoDataRow extends CdkNoDataRow {
  override _cellSelector = 'td, ngb-cell, [ngb-cell], .ngb-cell';
}
