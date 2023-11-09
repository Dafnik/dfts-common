import { d_timespan } from './timespan';

describe('timespan', () => {
  it('should return the correct time span between two dates', () => {
    const dateNow = new Date();
    const dateFuture = new Date(Date.now() + 86400 * 1000);
    const timeSpan = d_timespan(dateNow, dateFuture);
    expect(timeSpan).toBe('1d, 0h, 0m, 0s');
  });

  it('should return the correct time span between two dates', () => {
    const dateNow = new Date('2022-12-06T12:00:00Z');
    const dateFuture = new Date('2022-12-07T12:00:00Z');
    const result = d_timespan(dateNow, dateFuture);
    expect(result).toEqual('1d, 0h, 0m, 0s');
  });
});
