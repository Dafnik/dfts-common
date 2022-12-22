import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {IMap, imploderBuilder, UndefinedOrNullOr} from 'dfts';

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
    return imploderBuilder(strings).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

@Pipe({
  name: 'implodeMapped',
  standalone: true,
})
export class DfxImplodeMapped implements PipeTransform {
  transform<T>(
    strings: UndefinedOrNullOr<T[]>,
    mapFn: IMap<T, string>,
    separator?: UndefinedOrNullOr<string>,
    maxLength?: UndefinedOrNullOr<number>,
    suffix?: UndefinedOrNullOr<string>
  ): string {
    return imploderBuilder().mappedSource(strings, mapFn).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

const PIPES = [DfxImplode, DfxImplodeMapped];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxImplodeModule {}
