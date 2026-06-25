import type { JobRunResult } from '../core/icon-manager';
import type { Logger } from '../core/ports';

export class CliReporter {
  constructor(private readonly logger: Logger) {}

  report(result: JobRunResult, ignoreMissing: boolean, verbose: boolean): void {
    for (const issue of result.issues) {
      const message = `[${result.job}] ${issue.message}`;
      if (issue.kind === 'missing' && ignoreMissing) this.logger.info(message);
      else this.logger.error(message);
    }
    if (verbose && result.success) this.logger.info(`[${result.job}] Wrote ${result.iconCount} icon(s)`);
  }
}
