import {StringOrNumber} from '../types';
import {AEntity} from './abstract-entity';
import {IEntityWithName, IEntityWithNumberIDAndName, IEntityWithStringIDAndName} from './entity.interface';

export abstract class AEntityWithName<idType extends StringOrNumber> extends AEntity<idType> implements IEntityWithName<idType> {
  protected constructor(id: idType, public name: string, originalJsonDto?: any) {
    super(id, originalJsonDto);
  }
}

export abstract class AEntityWithNumberIDAndName extends AEntityWithName<number> implements IEntityWithNumberIDAndName {
  protected constructor(id: number, name: string, originalJsonDto?: any) {
    super(id, name, originalJsonDto);
  }
}

export abstract class AEntityWithStringIDAndName extends AEntityWithName<string> implements IEntityWithStringIDAndName {
  protected constructor(id: string, name: string, originalJsonDto?: any) {
    super(id, name, originalJsonDto);
  }
}
