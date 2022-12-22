import {LogType} from './loggerInfo';
import {getLogHeader} from './log.header';

export class Logger {
  public readonly className: string;

  constructor(className?: string) {
    if (!className) {
      className = 'generic logger';
    }

    this.className = className;
  }

  private _log(logType: LogType, methodeName: string, description: string, object?: unknown, group = false): Logger {
    const header = getLogHeader(logType, this.className, methodeName, description);

    if (object) {
      console.log(header, object);
    } else if (group) {
      console.group(header);
    } else {
      console.log(header);
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
    return this._log('LOG', methodeName, description, undefined, true);
  }

  groupEnd(): Logger {
    console.groupEnd();
    return this;
  }

  /**
   * Logs to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown} object An optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  log(methodeName: string, description: string, object?: unknown): Logger {
    return this._log('LOG', methodeName, description, object);
  }

  /**
   * Log info to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown} object An optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  info(methodeName: string, description: string, object?: unknown): Logger {
    return this._log('INFO', methodeName, description, object);
  }

  /**
   * Log warning to the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown} object An optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  warning(methodeName: string, description: string, object?: unknown): Logger {
    return this._log('WARNING', methodeName, description, object);
  }

  /**
   * Log error the console
   * @param {string} methodeName The methods where the logging takes place
   * @param {string} description The log message or description
   * @param {unknown} object An optional objects which gets printed to the console
   * @return {Logger} Returns logger
   */
  error(methodeName: string, description: string, object?: unknown): Logger {
    return this._log('ERROR', methodeName, description, object);
  }
}

export function loggerOf(className?: string): Logger {
  if (!className) {
    if (!LogHelper.genericLogger) {
      LogHelper.genericLogger = new Logger(undefined);
    }
    return LogHelper.genericLogger;
  }
  let logger = LogHelper.loggers.get(className);
  if (!logger) {
    logger = new Logger(className);
    LogHelper.loggers.set(className, logger);
  }
  return logger;
}

export class LogHelper {
  public static loggers: Map<string, Logger> = new Map();
  public static genericLogger?: Logger;

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
