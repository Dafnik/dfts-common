export class ConfigError extends Error {
  override readonly name = 'ConfigError';
}

export class ModuleNotFoundError extends Error {
  override readonly name = 'ModuleNotFoundError';

  constructor(readonly specifier: string) {
    super(`Module not found: ${specifier}`);
  }
}

export interface ReadIssue {
  kind: 'read';
  path: string;
  message: string;
}

export interface MissingIconIssue {
  kind: 'missing';
  icon: string;
  attempted: string[];
  message: string;
}

export interface ModuleLoadIssue {
  kind: 'load';
  icon: string;
  specifier: string;
  message: string;
}

export interface AmbiguousIconIssue {
  kind: 'ambiguous';
  icon: string;
  specifiers: string[];
  message: string;
}

export interface WriteIssue {
  kind: 'write';
  path: string;
  message: string;
}

export type JobIssue = ReadIssue | MissingIconIssue | ModuleLoadIssue | AmbiguousIconIssue | WriteIssue;

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
