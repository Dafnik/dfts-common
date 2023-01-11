import {Once} from './once';

describe('Once decorator', () => {
  it('should only allow a method to be called once', () => {
    class TestClass {
      @Once
      testMethod() {
        return 'Hello, world!';
      }
    }

    const testObj = new TestClass();
    const result1 = testObj.testMethod();
    const result2 = testObj.testMethod();

    expect(result1).toEqual('Hello, world!');
    expect(result2).toEqual('Hello, world!');
  });

  it('should return the same value each time the decorated method is called', () => {
    class TestClass {
      @Once
      testMethod() {
        return Math.random();
      }
    }

    const testObj = new TestClass();
    const result1 = testObj.testMethod();
    const result2 = testObj.testMethod();

    expect(result1).toEqual(result2);
  });

  it('should work correctly when the decorated method is called with different arguments', () => {
    class TestClass {
      @Once
      testMethod(arg1: any, arg2: any) {
        return arg1 + arg2;
      }
    }

    const testObj = new TestClass();
    const result1 = testObj.testMethod(1, 2);
    const result2 = testObj.testMethod(3, 4);

    expect(result1).toEqual(3);
    expect(result2).toEqual(3);
  });

  it('should work correctly when the decorated method returns different types of values', () => {
    class TestClass {
      count = 0;

      @Once
      testMethod() {
        this.count += 1;
        return this.count % 2 === 0 ? 'even' : 'odd';
      }
    }

    const testObj = new TestClass();
    const result1 = testObj.testMethod();
    const result2 = testObj.testMethod();

    expect(result1).toEqual('odd');
    expect(result2).toEqual('odd');
  });
});
