import { NgModule, Pipe, PipeTransform } from '@angular/core';

import { s_imploder } from 'dfts-helper';

@Pipe({
  name: 's_implode',
  standalone: true,
  pure: true,
})
export class DfxImplodePipe implements PipeTransform {
  transform(
    strings: string[] | undefined | null,
    separator?: string | undefined | null,
    maxLength?: number | undefined | null,
    suffix?: string | undefined | null,
  ): string {
    return s_imploder().source(strings).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

@Pipe({
  name: 's_implodeMapped',
  standalone: true,
  pure: true,
})
export class ImplodeMappedPipe implements PipeTransform {
  transform<T>(
    strings: T[] | undefined | null,
    mapFn: (it: T) => string,
    separator?: string | undefined | null,
    maxLength?: number | undefined | null,
    suffix?: string | undefined | null,
  ): string {
    return s_imploder().source(strings, mapFn).maxLength(maxLength).separator(separator).suffix(suffix).build();
  }
}

const PIPES = [DfxImplodePipe, ImplodeMappedPipe];

@NgModule({
  imports: PIPES,
  exports: PIPES,
})
export class DfxImplodeModule {}
