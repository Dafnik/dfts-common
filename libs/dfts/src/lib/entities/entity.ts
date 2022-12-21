import {AEntity, AEntityWithNumberID, AEntityWithStringID} from './abstract-entity';
import {AEntityWithName, AEntityWithNumberIDAndName, AEntityWithStringIDAndName} from './abstract-entity-with-name';
import {StringOrNumber} from '../types';

export class Entity extends AEntity<StringOrNumber> {
  constructor(id: StringOrNumber, originalJsonDto: any) {
    super(id, originalJsonDto);
  }
}

export class EntityWithNumberID extends AEntityWithNumberID {
  constructor(id: number, originalJsonDto: any) {
    super(id, originalJsonDto);
  }
}

export class EntityWithStringID extends AEntityWithStringID {
  constructor(id: string, originalJsonDto: any) {
    super(id, originalJsonDto);
  }
}

export class EntityWithName extends AEntityWithName<StringOrNumber> {
  constructor(id: StringOrNumber, name: string, originalJsonDto: any) {
    super(id, name, originalJsonDto);
  }
}

export class EntityWithNumberIDAndName extends AEntityWithNumberIDAndName {
  constructor(id: number, name: string, originalJsonDto: any) {
    super(id, name, originalJsonDto);
  }
}

export class EntityWithStringIDAndName extends AEntityWithStringIDAndName {
  constructor(id: string, name: string, originalJsonDto: any) {
    super(id, name, originalJsonDto);
  }
}
