import {Pipe, PipeTransform} from '@angular/core';
import {UndefinedOrNullOr, upperCaseFirstLetter} from 'dfts';

@Pipe({
  name: 'upperCaseFirstLetter',
  standalone: true,
  pure: true,
})
export class DfxUpperCaseFirstLetter implements PipeTransform {
  transform(text: UndefinedOrNullOr<string>): string {
    return upperCaseFirstLetter(text);
  }
}
