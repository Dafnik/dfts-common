/**
 * @license
 * Original work Copyright Google LLC All Rights Reserved.
 * Modified work Copyright DatePoll-Systems
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { NgModule } from '@angular/core';

import { NgbSort } from './sort';
import { NgbSortHeader } from './sort-header';

const EXPORTED_DECLARATIONS = [NgbSort, NgbSortHeader];

@NgModule({
  imports: EXPORTED_DECLARATIONS,
  exports: EXPORTED_DECLARATIONS,
})
export class DfxSortModule {}
