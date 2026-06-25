import type { Logger } from '../core/ports';

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(message);
  }

  error(message: string): void {
    console.error(message);
  }
}
