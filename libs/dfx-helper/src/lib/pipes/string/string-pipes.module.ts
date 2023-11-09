import { NgModule } from '@angular/core';
import { DfxCutPipe } from './cut';
import { DfxLowerCaseExceptFirstLettersPipe } from './lower-case-except-first-letters';
import { DfxTruncatePipe } from './truncate';
import { DfxUpperCaseFirstLetterPipe } from './upper-case-first-letter';
import { DfxIsEmailPipe } from './is-email';
import { DfxIsUrlPipe } from './is-url';
import { DfxStripWhitespacePipe } from './strip-whitespace';

const PIPES = [
  DfxCutPipe,
  DfxIsEmailPipe,
  DfxIsUrlPipe,
  DfxLowerCaseExceptFirstLettersPipe,
  DfxStripWhitespacePipe,
  DfxTruncatePipe,
  DfxUpperCaseFirstLetterPipe,
];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxStringModule {}
