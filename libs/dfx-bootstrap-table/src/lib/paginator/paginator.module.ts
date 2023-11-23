import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { NgbPaginator } from "./paginator";
import { NGB_PAGINATOR_INTL_PROVIDER } from "./paginator-intl.service";

@NgModule({
  imports: [FormsModule],
  exports: [NgbPaginator],
  declarations: [NgbPaginator],
  providers: [NGB_PAGINATOR_INTL_PROVIDER],
})
export class DfxPaginationModule {}
