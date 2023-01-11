import {EntityWithNumberID, EntityWithNumberIDAndName, EntityWithStringID, EntityWithStringIDAndName} from '../entity';
import {AEntityWithNumberID, AEntityWithStringID} from './abstract-entity';

describe('Abstract Entity', () => {
  it('hashCode', () => {
    let test = new EntityWithNumberID(2);
    expect(test.hashCode()).toBe(2);
    test = new EntityWithNumberID(333333);
    expect(test.hashCode()).toBe(333333);
  });
  it('toString', () => {
    let test = new EntityWithNumberID(2);
    expect(test.toString()).toBe('id: "2";');
    test = new EntityWithNumberIDAndName(2, 'Huber');
    expect(test.toString()).toBe('id: "2"; name: "Huber";');
  });
  it('equals', () => {
    const test = new EntityWithNumberID(2);
    const test1 = new EntityWithNumberID(2);
    const test2 = new EntityWithNumberID(22);
    const test3 = new EntityWithNumberIDAndName(2, 'Test');
    const test4 = new TestEntity2(2);
    expect(test.equals(test1)).toBeTruthy();
    expect(test.equals({id: 2})).toBeFalsy();
    expect(test.equals([2])).toBeFalsy();
    expect(test.equals(test3)).toBeFalsy();
    expect(test.equals(test2)).toBeFalsy();
    expect(test.equals(test4)).toBeFalsy();
    expect(test.equals(null)).toBeFalsy();
    expect(test.equals(2)).toBeFalsy();
    expect(test.equals('dasdfasdf')).toBeFalsy();
  });
});

describe('AbstractEntityWithStringID', () => {
  it('hashCode', () => {
    let test = new EntityWithStringID('2');
    expect(test.hashCode()).toBe('2');
    test = new EntityWithStringID('222222222222222222222222222');
    expect(test.hashCode()).toBe('222222222222222222222222222');
  });
  it('toString', () => {
    let test = new EntityWithStringID('2');
    expect(test.toString()).toBe('id: "2";');
    test = new EntityWithStringIDAndName('2', 'Huber');
    expect(test.toString()).toBe('id: "2"; name: "Huber";');
  });
  it('equals', () => {
    const test = new EntityWithStringID('2');
    const test1 = new EntityWithStringID('2');
    const test2 = new EntityWithStringID('22');
    const test3 = new EntityWithStringIDAndName('2', 'Test');
    const test4 = new TestEntity3('2');
    expect(test.equals(test1)).toBeTruthy();
    expect(test.equals({id: 2})).toBeFalsy();
    expect(test.equals([2])).toBeFalsy();
    expect(test.equals(test3)).toBeFalsy();
    expect(test.equals(test2)).toBeFalsy();
    expect(test.equals(test4)).toBeFalsy();
    expect(test.equals(null)).toBeFalsy();
    expect(test.equals(2)).toBeFalsy();
    expect(test.equals('dasdfasdf')).toBeFalsy();
  });
});

class TestEntity2 extends AEntityWithNumberID {
  constructor(id: number) {
    super(id);
  }
}

class TestEntity3 extends AEntityWithStringID {
  constructor(id: string) {
    super(id);
  }
}
