import {d_formatWithHoursMinutesAndSeconds} from './format-date-with-hours-minutes-seconds';

describe('format-date-with-hours-minutes-seconds', () => {
  it('getFormattedWithHoursMinutesAndSeconds', () => {
    let date = new Date('2020-07-20');
    date.setHours(10);
    date.setMinutes(30);
    date.setSeconds(22);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-07-20 10:30:22');
    date = new Date('2020-01-01');
    date.setHours(1);
    date.setMinutes(1);
    date.setSeconds(1);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-01-01 01:01:01');
    date = new Date('2020-1-1');
    date.setHours(1);
    date.setMinutes(1);
    date.setSeconds(1);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-01-01 01:01:01');
    date = new Date('2020-9-9');
    date.setHours(1);
    date.setMinutes(1);
    date.setSeconds(1);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-09-09 01:01:01');
    date = new Date('2020-09-09');
    date.setHours(9);
    date.setMinutes(9);
    date.setSeconds(9);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-09-09 09:09:09');
    date = new Date('2020-12-12');
    date.setHours(12);
    date.setMinutes(12);
    date.setSeconds(12);
    expect(d_formatWithHoursMinutesAndSeconds(date)).toBe('2020-12-12 12:12:12');
    expect(d_formatWithHoursMinutesAndSeconds(undefined)).toBe(undefined);
  });
});
