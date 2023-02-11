import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {IMap, s_imploder, UndefinedOrNullOr} from 'dfts-helper';

@Pipe({
  name: 's_implode',
  standalone: true,
  pure: true,
})
export class DfxImplodePipe implements PipeTransform {
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
  name: 's_implodeMapped',
  standalone: true,
  pure: true,
})
export class ImplodeMappedPipe implements PipeTransform {
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

const PIPES = [DfxImplodePipe, ImplodeMappedPipe];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxImplodeModule {}
