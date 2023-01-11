import {RememberResult} from './remember-result';

describe('RememberResult', () => {
  beforeEach(() => {
    CallChecker.reset();
  });
  it('expect to call', () => {
    expect(Test.test('test')).toBe('test');
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
    CallChecker.reset();
    expect(Test.test('test2')).toBe('test2');
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
    CallChecker.reset();
    expect(Test.test('test')).toBe('test');
    expect(CallChecker.hasBeenCalled()).toBeFalsy();
  });
  it('expect to not call', () => {
    Test.test('test21');
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
    CallChecker.reset();
    Test.test('test20');
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
    CallChecker.reset();
    Test.test('test20');
    Test.test('test20');
    expect(CallChecker.hasBeenCalled()).toBeFalsy();
  });
  it('expect to call (parameter less method)', () => {
    Test.test2();
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
    CallChecker.reset();
    Test.test2();
    expect(CallChecker.hasBeenCalled()).toBeTruthy();
  });
});

class Test {
  @RememberResult()
  public static test(test: string): string {
    CallChecker.call();
    return test;
  }

  @RememberResult()
  public static test2(): void {
    CallChecker.call();
  }
}

class CallChecker {
  private static called = false;

  public static call() {
    this.called = true;
  }

  public static hasBeenCalled(): boolean {
    return this.called;
  }

  public static reset(): void {
    this.called = false;
  }
}
