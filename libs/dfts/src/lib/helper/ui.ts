import {coerceDate, DateInput} from './date';
import {stripWhitespace} from './string/strip-whitespace';

export class UIHelper {
  private static currentDate: Date | undefined;
  private static WORDS_PER_MIN = 275; // wpm
  private static IMAGE_READ_TIME = 12; // in seconds

  static getApproxCurrentDate(): Date {
    if (this.currentDate == null) {
      this.currentDate = new Date();
    }
    return this.currentDate;
  }

  /**
   * Returns a string with hours, days or months left until date
   * @param {Date} date Date to calculate time left to
   * @param {Date} start Start date (default getApproxCurrentDate())
   * @return string
   */
  static getTimeLeft(date: DateInput, start?: DateInput): string {
    date = coerceDate(date);
    start = coerceDate(start);

    const days = Math.round((date.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.round(Math.abs(date.getTime() - start.getTime()) / (60 * 60 * 1000));
      return hours + 'h';
    } else if (days > 31) {
      const months = date.getFullYear() * 12 + date.getMonth() - (start.getFullYear() * 12 + start.getMonth());
      return months + 'mo';
    } else {
      return days + 'd';
    }
  }

  //region Read time
  private static imageReadTime(count: number, customImageTime: number = UIHelper.IMAGE_READ_TIME): number {
    let seconds;

    if (count > 10) {
      seconds = (count / 2) * (customImageTime + 3) + (count - 10) * 3; // n/2(a+b) + 3 sec/image
    } else {
      seconds = (count / 2) * (2 * customImageTime + (1 - count)); // n/2[2a+(n-1)d]
    }
    return seconds / 60;
  }

  private static wordsCount(text: string) {
    const pattern = '\\w+';
    const reg = new RegExp(pattern, 'g');
    return (text.match(reg) || []).length;
  }

  // Chinese / Japanese / Korean
  private static otherLanguageReadTime(text: string) {
    const pattern = '[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f]';
    const reg = new RegExp(pattern, 'g');
    return text.replace(reg, '');
  }

  private static wordsReadTime(text: string, wordsPerMin = UIHelper.WORDS_PER_MIN) {
    const formattedString = UIHelper.otherLanguageReadTime(text);
    const wordCount = UIHelper.wordsCount(formattedString);
    return wordCount / wordsPerMin;
  }

  private static humanizeTime(time: number): string {
    if (time < 0.5) {
      return '> 1m';
    }
    if (time >= 0.5 && time < 1.5) {
      return '1m';
    }
    return `${Math.ceil(time)}m`;
  }

  /* istanbul ignore next */
  static getReadTime(text: string, imageCounter: number = 0): string {
    const imageTime = this.imageReadTime(imageCounter);
    const strippedString = stripWhitespace(text);
    const wordTime = this.wordsReadTime(strippedString);
    return this.humanizeTime(imageTime + wordTime);
  }

  //endregion
}
