/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {NgModule} from '@angular/core';
import {NgbRecycleRows, NgbTable} from './table';
import {CdkTableModule} from '@angular/cdk/table';
import {NgbCell, NgbCellDef, NgbColumnDef, NgbFooterCell, NgbFooterCellDef, NgbHeaderCell, NgbHeaderCellDef} from './cell';
import {NgbFooterRow, NgbFooterRowDef, NgbHeaderRow, NgbHeaderRowDef, NgbNoDataRow, NgbRow, NgbRowDef} from './row';
import {NgbTextColumn} from './text-column';

const EXPORTED_DECLARATIONS = [
  // Table
  NgbTable,
  NgbRecycleRows,

  // Template defs
  NgbHeaderCellDef,
  NgbHeaderRowDef,
  NgbColumnDef,
  NgbCellDef,
  NgbRowDef,
  NgbFooterCellDef,
  NgbFooterRowDef,

  // Cell directives
  NgbHeaderCell,
  NgbCell,
  NgbFooterCell,

  // Row directives
  NgbHeaderRow,
  NgbRow,
  NgbFooterRow,
  NgbNoDataRow,

  NgbTextColumn,
];

@NgModule({
  imports: [CdkTableModule],
  exports: [EXPORTED_DECLARATIONS],
  declarations: EXPORTED_DECLARATIONS,
})
export class DfxTableModule {}
