import {UndefinedOr} from '../types';

/**
 * Stopwatch - Stops the time
 * <br> Use <code>start()</code> to start it and <code>stop()</code> to stop it. You can also reset it via
 * <code>reset()</code>.
 * <br> Check the Stopwatch status with: <code>hasStarted()</code>, <code>isRunning()</code> and <code>isStopped()</code>.
 * <br> Laps can be created with <code>lap(string)</code> and read with <code>getLaps()</code>, you can also
 * subscribe to <code>lapsChange</code>.
 * <br> The time can be read via <code>getTime()</code>, <code>getTimeInSeconds()</code>, <code>getTimeInMinutes()</code>
 * and <code>getTimeInHours()</code>.
 * @since 3.2.5
 */
export class Stopwatch {
  private startedAt: Date | undefined;
  private endedAt: Date | undefined;
  private laps: Map<number, UndefinedOr<string>> = new Map<number, UndefinedOr<string>>();

  constructor(start: boolean = false) {
    if (start) {
      this.start();
    }
  }

  hasStarted(): boolean {
    return !!this.startedAt;
  }

  isRunning(): boolean {
    return !!(this.startedAt && !this.endedAt);
  }

  isStopped(): boolean {
    return !!(this.startedAt && this.endedAt);
  }

  /**
   * Starts stopwatch (only once)
   * @return {Date} Date at which the stopwatch was started
   */
  start(): Date {
    if (!this.startedAt) {
      this.startedAt = new Date();
    }
    return this.startedAt;
  }

  /**
   * Stops stopwatch (only once)
   * @return {Date} Date at which the stopwatch was stopped
   */
  stop(): Date {
    if (!this.startedAt) {
      throw 'Stopwatch not started';
    }
    if (!this.endedAt) {
      this.endedAt = new Date();
    }
    return this.endedAt;
  }

  /**
   * Stops stopwatch and returns elapsed time in milliseconds
   * @return {number} Elapsed time in milliseconds
   */
  stopAndGetTime(): number {
    this.stop();
    return this.getTimeInSeconds();
  }

  /**
   * Stops stopwatch and returns elapsed time in seconds
   * @return {number} Elapsed time in seconds
   */
  stopAndGetTimeInSeconds(): number {
    this.stop();
    return this.getTimeInSeconds();
  }

  /**
   * Stops stopwatch and returns elapsed time in minutes
   * @return {number} Elapsed time in minutes
   */
  stopAndGetTimeInMinutes(): number {
    this.stop();
    return this.getTimeInMinutes();
  }

  /**
   * Stops stopwatch and returns elapsed time in hours
   * @return {number} Elapsed time in hours
   */
  stopAndGetTimeInHours(): number {
    this.stop();
    return this.getTimeInMinutes();
  }

  /**
   * Resets complete stopwatch
   */
  reset(): void {
    this.startedAt = undefined;
    this.endedAt = undefined;
    this.laps = new Map<number, UndefinedOr<string>>();
  }

  /**
   * @return {number} Elapsed time in milliseconds
   */
  getTime(): number {
    let endedAt = this.endedAt;
    if (!this.startedAt) {
      throw 'Stopwatch not started';
    }
    if (!endedAt) {
      endedAt = new Date();
    }
    return endedAt.getTime() - this.startedAt.getTime();
  }

  /**
   * @return {number} Elapsed time in seconds
   */
  getTimeInSeconds(): number {
    return this.getTime() / 1000;
  }

  /**
   * @return {number} Elapsed time in minutes
   */
  getTimeInMinutes(): number {
    return this.getTime() / 1000 / 60;
  }

  /**
   * @return {number} Elapsed time in hours
   */
  getTimeInHours(): number {
    return this.getTime() / 1000 / 60 / 60;
  }

  /**
   * Creates a lap with optional string, notifies all lap subscribers
   * @param {string} text
   * @return {Date} Date when the lap was set
   */
  lap(text?: string): Date {
    if (!this.startedAt) {
      throw 'Stopwatch not started';
    }
    const date = new Date();
    this.laps.set(date.getTime(), text);
    return date;
  }

  /**
   * Returns all laps
   * @return {Map<number, UndefinedOr<string>>} All laps
   */
  getLaps(): Map<number, UndefinedOr<string>> {
    return this.laps;
  }

  static createStarted(): Stopwatch {
    return new Stopwatch(true);
  }

  static createStopped(): Stopwatch {
    return new Stopwatch(false);
  }
}
