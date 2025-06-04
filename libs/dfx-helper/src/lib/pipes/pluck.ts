import { Pipe, PipeTransform } from '@angular/core';

import { a_pluck } from 'dfts-helper';

@Pipe({
  name: 'a_pluck',
  standalone: true,
  pure: true,
})
export class DfxArrayPluck implements PipeTransform {
  transform<T>(it: T[], key: keyof T): T[keyof T][] {
    return a_pluck(it, key);
  }
}

@Pipe({
  name: 'o_pluck',
  standalone: true,
  pure: true,
})
export class DfxPluck implements PipeTransform {
  transform<T>(it: T, key: keyof T): T[keyof T] {
    return it[key];
  }
}
