import { NgModule } from '@angular/core';
import { DfxTr } from './pipes/tr';
import { DfxTrB } from './pipes/trb';
import { DfxTrA } from './pipes/tra';

@NgModule({
  imports: [DfxTr, DfxTrB, DfxTrA],
  exports: [DfxTr, DfxTrB, DfxTrA],
})
export class DfxTranslateModule {}
