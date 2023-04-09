import {n_humanizeTime} from './humanize-time.js';

describe('humanizeTime', () => {
  it('should return "1m" for a time of 0.5 minutes or greater', () => {
    expect(n_humanizeTime(0.5)).toBe('1m');
    expect(n_humanizeTime(1)).toBe('1m');
  });

  it('should return "> 1m" for a time less than 0.5 minutes', () => {
    expect(n_humanizeTime(0.1)).toBe('> 1m');
    expect(n_humanizeTime(0)).toBe('> 1m');
  });
});
