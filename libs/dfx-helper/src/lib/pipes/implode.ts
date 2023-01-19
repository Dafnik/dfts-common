import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {IMap, s_imploder, UndefinedOrNullOr} from 'dfts-helper';

@Pipe({
  name: 'implode',
  standalone: true,
  pure: true,
})
export class DfxImplode implements PipeTransform {
  transform(
    strings: UndefinedOrNullOr<string[]>,
    separator?: UndefinedOrNullOr<string>,
    maxLength?: UndefinedOrNullOr<number>,
    suffix?: UndefinedOrNullOr<string>
  ): string {
    return s_imploder(strings).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

@Pipe({
  name: 'implodeMapped',
  standalone: true,
  pure: true,
})
export class DfxImplodeMapped implements PipeTransform {
  transform<T>(
    strings: UndefinedOrNullOr<T[]>,
    mapFn: IMap<T, string>,
    separator?: UndefinedOrNullOr<string>,
    maxLength?: UndefinedOrNullOr<number>,
    suffix?: UndefinedOrNullOr<string>
  ): string {
    return s_imploder().mappedSource(strings, mapFn).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

@Pipe({
  name: 'implodePluck',
  standalone: true,
  pure: true,
})
export class DfxImplodePlucked implements PipeTransform {
  transform<T>(
    strings: UndefinedOrNullOr<T[]>,
    key: UndefinedOrNullOr<keyof T>,
    separator?: UndefinedOrNullOr<string>,
    maxLength?: UndefinedOrNullOr<number>,
    suffix?: UndefinedOrNullOr<string>
  ): string {
    return s_imploder().pluckedSource(strings, key).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

const PIPES = [DfxImplode, DfxImplodeMapped, DfxImplodePlucked];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxImplodeModule {}
