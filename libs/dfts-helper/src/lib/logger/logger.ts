import {LogType} from './loggerInfo.js';
import {getLogMessage} from './log.header.js';

export class Logger {
  public readonly className: string;

  constructor(className?: string) {
    if (!className) {
      className = 'generic logger';
    }

    this.className = className;
  }

  private _log(props: {logType: LogType; methodeName: string; description: string; objects?: unknown[]; group?: boolean}): Logger {
    const header = getLogMessage(props.logType, this.className, props.methodeName, props.description);

    if (props.group) {
      console.group(header);
    } else {
      switch (props.logType) {
        case 'LOG':
          console.log(header, ...(props.objects ?? []));
          break;
        case 'INFO':
          console.info(header, ...(props.objects ?? []));
          break;
        case 'WARNING':
          console.warn(header, ...(props.objects ?? []));
          break;
        case 'ERROR':
          console.error(header, ...(props.objects ?? []));
          break;
        default:
          throw Error('Not implemented switch case');
          break;
      }
    }
    LogHelper.add(header);
    return this;
  }

  /**
   * Starts log group and logs to console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   */
  group(methodeName: string, description: string): Logger {
    return this._log({logType: 'LOG', methodeName, description, group: true});
  }

  groupEnd(): Logger {
    console.groupEnd();
    return this;
  }

  /**
   * Logs to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown[]} objects Optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  log(methodeName: string, description: string, ...objects: unknown[]): Logger {
    return this._log({logType: 'LOG', methodeName, description, objects: objects});
  }

  /**
   * Log info to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown[]} objects Optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  info(methodeName: string, description: string, ...objects: unknown[]): Logger {
    return this._log({logType: 'INFO', methodeName, description, objects});
  }

  /**
   * Log warning to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown[]} objects Optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  warning(methodeName: string, description: string, ...objects: unknown[]): Logger {
    return this._log({logType: 'WARNING', methodeName, description, objects});
  }

  /**
   * Log error the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown[]} object Optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  error(methodeName: string, description: string, ...objects: unknown[]): Logger {
    return this._log({logType: 'ERROR', methodeName, description, objects});
  }
}

export const loggers: Map<string, Logger> = new Map();
export let genericLogger: Logger | undefined;

export function loggerOf(className?: string): Logger {
  if (!className) {
    if (!genericLogger) {
      genericLogger = new Logger(undefined);
    }
    return genericLogger;
  }
  let logger = loggers.get(className);
  if (!logger) {
    logger = new Logger(className);
    loggers.set(className, logger);
  }
  return logger;
}

export class LogHelper {
  private static maximalLogSize = 5000;
  private static overflowRemoveCount = 200;

  private static log: string[] = [];

  /**
   * Gets a copy of the log
   * @return {string[]} Copy of the log
   */
  static getLog(): string[] {
    return this.log.slice();
  }

  private static setLog(log: string[]): void {
    this.log = log;
  }

  /**
   * Adds a string to the log
   * @param {string} log A string to add to the log
   */
  static add(log: string): void {
    if (this.log.length > this.maximalLogSize) {
      this.log.slice(0, this.overflowRemoveCount);
    }
    this.log.push(log);
  }

  /**
   * Remove a line in the log
   * @param {number} index The line to be removed
   */
  static remove(index: number): void {
    this.log.slice(index, 1);
  }

  /**
   * Removes the complete log
   */
  static removeAll(): void {
    this.setLog([]);
  }

  /**
   * Gets the log size
   * @return {number} Returns the log size
   */
  static size(): number {
    return this.log.length;
  }

  /**
   * Checks if entries exists
   * @return {boolean}Returns <code>true</code> if local storage is empty, <code>false</code> if not
   */
  static isEmpty(): boolean {
    return this.size() === 0;
  }

  /**
   * Checks if entries exists
   * @return {boolean} Returns <code>false</code> if local storage is empty, <code>true</code> if not
   */
  static hasEntries(): boolean {
    return !this.isEmpty();
  }
}
