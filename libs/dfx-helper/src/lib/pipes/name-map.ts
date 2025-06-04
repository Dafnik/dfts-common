import { Pipe, PipeTransform } from '@angular/core';

import { IHasName } from 'dfts-helper';

@Pipe({
  name: 'a_mapName',
  standalone: true,
  pure: true,
})
export class DfxArrayMapNamePipe implements PipeTransform {
  transform(it: IHasName[] | undefined | null): string[] | undefined {
    return it?.map((it) => it.name);
  }
}

@Pipe({
  name: 'o_mapName',
  standalone: true,
  pure: true,
})
export class DfxMapNamePipe implements PipeTransform {
  transform(it: IHasName | undefined | null): string {
    return it?.name ?? '';
  }
}
