/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';

import { NgbCell, NgbCellDef, NgbColumnDef, NgbFooterCell, NgbFooterCellDef, NgbHeaderCell, NgbHeaderCellDef } from './cell';
import { NgbFooterRow, NgbFooterRowDef, NgbHeaderRow, NgbHeaderRowDef, NgbNoDataRow, NgbRow, NgbRowDef } from './row';
import { NgbRecycleRows, NgbTable } from './table';
import { NgbTextColumn } from './text-column';

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
  imports: [CdkTableModule, ...EXPORTED_DECLARATIONS],
  exports: [EXPORTED_DECLARATIONS],
})
export class DfxTableModule {}
