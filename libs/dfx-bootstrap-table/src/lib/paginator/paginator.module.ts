import { NgModule } from '@angular/core';

import { NgbPaginator } from './paginator';
import { NGB_PAGINATOR_INTL_PROVIDER } from './paginator-intl.service';

@NgModule({
  imports: [NgbPaginator],
  exports: [NgbPaginator],
  providers: [NGB_PAGINATOR_INTL_PROVIDER],
})
export class DfxPaginationModule {}
