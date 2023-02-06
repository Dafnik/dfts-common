import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
  NgbPaginator,
  NgbPaginatorEllipsis,
  NgbPaginatorFirst,
  NgbPaginatorLast,
  NgbPaginatorNext,
  NgbPaginatorNumber,
  NgbPaginatorPages,
  NgbPaginatorPrevious,
} from './pagination';
import {FormsModule} from '@angular/forms';

export {
  NgbPaginator,
  NgbPaginatorEllipsis,
  NgbPaginatorFirst,
  NgbPaginatorLast,
  NgbPaginatorNext,
  NgbPaginatorNumber,
  NgbPaginatorPrevious,
  NgbPaginatorPages,
} from './pagination';

const DIRECTIVES = [
  NgbPaginator,
  NgbPaginatorEllipsis,
  NgbPaginatorFirst,
  NgbPaginatorLast,
  NgbPaginatorNext,
  NgbPaginatorNumber,
  NgbPaginatorPrevious,
  NgbPaginatorPages,
];

@NgModule({declarations: DIRECTIVES, exports: DIRECTIVES, imports: [CommonModule, FormsModule]})
export class DfxPaginationModule {}
