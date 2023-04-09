import {AEntity, AEntityWithNumberID, AEntityWithStringID} from './abstract-entity/abstract-entity.js';
import {AEntityWithName, AEntityWithNumberIDAndName, AEntityWithStringIDAndName} from './abstract-entity-with-name.js';
import {StringOrNumber} from '../types.js';

export class Entity extends AEntity<StringOrNumber> {
  constructor(id: StringOrNumber, originalJsonDto?: unknown) {
    super(id, originalJsonDto);
  }
}

export class EntityWithNumberID extends AEntityWithNumberID {
  constructor(id: number, originalJsonDto?: unknown) {
    super(id, originalJsonDto);
  }
}

export class EntityWithStringID extends AEntityWithStringID {
  constructor(id: string, originalJsonDto?: unknown) {
    super(id, originalJsonDto);
  }
}

export class EntityWithName extends AEntityWithName<StringOrNumber> {
  constructor(id: StringOrNumber, name: string, originalJsonDto?: unknown) {
    super(id, name, originalJsonDto);
  }
}

export class EntityWithNumberIDAndName extends AEntityWithNumberIDAndName {
  constructor(id: number, name: string, originalJsonDto?: unknown) {
    super(id, name, originalJsonDto);
  }
}

export class EntityWithStringIDAndName extends AEntityWithStringIDAndName {
  constructor(id: string, name: string, originalJsonDto?: unknown) {
    super(id, name, originalJsonDto);
  }
}
