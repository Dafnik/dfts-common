import { thr_sleep } from '../thread';
import { Stopwatch } from './stopwatch';

describe('Stopwatch class', () => {
  it('should correctly report whether the stopwatch has been started', () => {
    const stopwatch = new Stopwatch();
    expect(stopwatch.hasStarted()).toEqual(false);

    stopwatch.start();
    expect(stopwatch.hasStarted()).toEqual(true);
  });

  it('should correctly report whether the stopwatch is running', () => {
    const stopwatch = new Stopwatch();
    expect(stopwatch.isRunning()).toEqual(false);

    stopwatch.start();
    expect(stopwatch.isRunning()).toEqual(true);

    stopwatch.stop();
    expect(stopwatch.isRunning()).toEqual(false);
  });

  it('should correctly report whether the stopwatch is stopped', () => {
    const stopwatch = new Stopwatch();
    expect(stopwatch.isStopped()).toEqual(false);

    stopwatch.start();
    expect(stopwatch.isStopped()).toEqual(false);

    stopwatch.stop();
    expect(stopwatch.isStopped()).toEqual(true);
  });
  it('should correctly handle not started', () => {
    const stopwatch = new Stopwatch();
    expect(function () {
      stopwatch.stop();
    }).toThrow('Stopwatch not started');

    expect(function () {
      stopwatch.lap('Test');
    }).toThrow('Stopwatch not started');
  });
  it('should correctly handle multiple starts and stops', () => {
    const stopwatch = new Stopwatch();
    expect(stopwatch.isRunning()).toEqual(false);

    stopwatch.start();
    expect(stopwatch.isRunning()).toEqual(true);

    stopwatch.stop();
    expect(stopwatch.isRunning()).toEqual(false);

    stopwatch.reset();
    stopwatch.start();
    expect(stopwatch.isRunning()).toEqual(true);

    stopwatch.stop();
    expect(stopwatch.isRunning()).toEqual(false);
    stopwatch.reset();
  });
  it('should correctly calculate elapsed time', () => {
    const stopwatch = new Stopwatch(true);
    expect(stopwatch.getTime()).toBeGreaterThanOrEqual(0);

    stopwatch.stop();
    expect(stopwatch.getTime()).toBeGreaterThanOrEqual(0);
  });

  it('should correctly add laps to the stopwatch', async () => {
    const stopwatch = new Stopwatch(true);
    const lap1 = stopwatch.lap('Lap 1');
    expect(stopwatch.getLaps().size).toEqual(1);
    expect(stopwatch.getLaps().get(lap1.getTime())).toEqual('Lap 1');

    await thr_sleep(100);

    const lap2 = stopwatch.lap('Lap 2');
    expect(stopwatch.getLaps().size).toEqual(2);
    expect(stopwatch.getLaps().get(lap2.getTime())).toEqual('Lap 2');
  });

  it('should correctly reset the stopwatch', () => {
    const stopwatch = new Stopwatch(true);
    stopwatch.lap('Lap 1');
    stopwatch.stop();
    stopwatch.reset();
    expect(stopwatch.getLaps().size).toEqual(0);
    expect(stopwatch.hasStarted()).toEqual(false);
    expect(stopwatch.isRunning()).toEqual(false);
    expect(stopwatch.isStopped()).toEqual(false);
  });
});
