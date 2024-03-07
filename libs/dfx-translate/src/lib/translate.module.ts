import { NgModule } from '@angular/core';
import { DfxTr, DfxTrB, DfxTrA } from './pipes';

@NgModule({
  imports: [DfxTr, DfxTrB, DfxTrA],
  exports: [DfxTr, DfxTrB, DfxTrA],
})
export class DfxTranslateModule {}
