import {MeasureTime} from './measure-time';
import {thr_block} from '../../helper/thread';

describe('MeasureTime', () => {
  it('5ms', () => {
    const spy = jest.spyOn(console, 'log');
    Test.test(5);
    expect(spy).toHaveBeenCalled();
  });
  it('5ms in minutes', () => {
    const spy = jest.spyOn(console, 'log');
    Test3.test(5);
    expect(spy).toHaveBeenCalled();
  });
  it('5ms in hours', () => {
    const spy = jest.spyOn(console, 'log');
    Test4.test(5);
    expect(spy).toHaveBeenCalled();
  });
  it('100ms', () => {
    const spy = jest.spyOn(console, 'log');
    Test.test(100);
    expect(spy).toHaveBeenCalled();
  });
  it('1s', () => {
    const spy = jest.spyOn(console, 'log');
    Test2.test(1000);
    expect(spy).toHaveBeenCalled();
  });
});

class Test {
  @MeasureTime()
  static test(ms: number): void {
    thr_block(ms);
  }
}

class Test2 {
  @MeasureTime('s')
  static test(ms: number): void {
    thr_block(ms);
  }
}

class Test3 {
  @MeasureTime('m')
  static test(ms: number): void {
    thr_block(ms);
  }
}

class Test4 {
  @MeasureTime('h')
  static test(ms: number): void {
    thr_block(ms);
  }
}
