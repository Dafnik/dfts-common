import {d_timeLeft} from './time-left';

describe('timeLeft', () => {
  it('timeLeft', () => {
    const date1 = new Date('2020-07-19');
    date1.setHours(8);
    const date2 = new Date('2020-07-19');
    date2.setHours(date1.getHours() + 1);
    expect(d_timeLeft(date2, date1)).toBe('1h');
    date2.setHours(date1.getHours() + 3);
    expect(d_timeLeft(date2, date1)).toBe('3h');
    date2.setHours(date1.getHours() + 12);
    expect(d_timeLeft(date2, date1)).toBe('1d');
    date2.setDate(date1.getDate() + 1);
    expect(d_timeLeft(date2, date1)).toBe('2d');
    date2.setDate(date1.getDate() + 30);
    expect(d_timeLeft(date2, date1)).toBe('31d');
    date2.setDate(date1.getDate() + 31);
    expect(d_timeLeft(date2, date1)).toBe('2mo');
    const date = new Date();
    date.setHours(date.getHours() + 1);
    expect(d_timeLeft(date)).toBe('1h');
  });
});
