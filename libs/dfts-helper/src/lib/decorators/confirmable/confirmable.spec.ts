import { Confirmable } from './confirmable';

describe('Confirmable', () => {
  it('should return the original method if the user confirms the action', () => {
    // mock the confirm function to return true when called
    window.confirm = jest.fn().mockImplementation(() => true);

    // call the test method and expect it to return the expected value
    expect(TestClass.testMethode('hello')).toEqual('hello');
  });

  it('should return null if the user does not confirm the action', () => {
    // mock the confirm function to return false when called
    window.confirm = jest.fn().mockImplementation(() => false);

    // call the test method and expect it to return null
    expect(TestClass.testMethode('hello')).toBeNull();
  });
});

class TestClass {
  @Confirmable('Are you sure?')
  static testMethode(value: any): any {
    return value;
  }
}
