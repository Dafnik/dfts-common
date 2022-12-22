import {NgModule} from '@angular/core';
import {DfxCut} from './cut';
import {DfxLowerCaseExceptFirstLetters} from './lower-case-except-first-letters';
import {DfxTruncate} from './truncate';
import {DfxUpperCaseFirstLetter} from './upper-case-first-letter';
import {DfxIsEmail} from './is-email';
import {DfxIsUrl} from './is-url';
import {DfxStripWhitespace} from './strip-whitespace';

const PIPES = [DfxCut, DfxIsEmail, DfxIsUrl, DfxLowerCaseExceptFirstLetters, DfxStripWhitespace, DfxTruncate, DfxUpperCaseFirstLetter];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxStringModule {}
