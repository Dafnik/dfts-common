import { LogType, maxClassNameLength, maxMethodeNameLength } from './loggerInfo';

export function getLogMessage(logType: LogType, className: string, methodeName: string, description: string): string {
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

  return `${logHeaderDateFormatter()} | ${logText} | ${className} | ${methodeName} | ${description}`;
}

function logHeaderDateFormatter(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  const millis = d.getMilliseconds().toString().padStart(2, '0');

  return `${[year, month, day].join('-')} ${[hour, minutes, seconds].join(':')}:${millis}`;
}
