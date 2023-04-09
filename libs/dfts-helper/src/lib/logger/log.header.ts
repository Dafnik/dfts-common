import {LogType, maxClassNameLength, maxMethodeNameLength} from './loggerInfo.js';
import {d_formatWithHoursMinutesAndSeconds} from '../helper/date/format-date-with-hours-minutes-seconds/format-date-with-hours-minutes-seconds.js';

export function getLogMessage(logType: LogType, className: string, methodeName: string, description: string): string {
  const date = new Date();
  const milli = date.getMilliseconds();
  const milliS = milli > 99 ? milli : milli > 9 ? milli + ' ' : milli + '  ';

  let logText = 'Unknown ';
  switch (logType) {
    case 'LOG':
      logText = 'LOG     ';
      break;
    case 'INFO':
      logText = 'INFO    ';
      break;
    case 'WARNING':
      logText = 'WARNING ';
      break;
    case 'ERROR':
      logText = 'ERROR   ';
      break;
    default:
      console.error('ERROR: Unknown log type');
      break;
  }

  className = className.slice(0, maxClassNameLength);
  for (; className.length < maxClassNameLength; ) {
    className += ' ';
  }
  methodeName = methodeName.slice(0, maxMethodeNameLength);
  for (; methodeName.length < maxMethodeNameLength; ) {
    methodeName += ' ';
  }

  return `${d_formatWithHoursMinutesAndSeconds(date)}:${milliS} | ${logText} | ${className} | ${methodeName} | ${description}`;
}
