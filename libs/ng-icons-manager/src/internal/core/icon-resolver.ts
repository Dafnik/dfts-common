import type { PackagePreferences } from '../../index';
import { ICON_REGISTRY, toSpecifier, type IconRegistry } from './icon-registry';
import { ModuleNotFoundError, errorMessage, type AmbiguousIconIssue, type MissingIconIssue, type ModuleLoadIssue } from './issues';
import type { ModuleLoader } from './ports';

interface IconMatch {
  packageName: string;
  specifier: string;
  svg: string;
}

interface AttemptResult {
  match?: IconMatch;
  issue?: ModuleLoadIssue;
}

type ResolutionIssue = MissingIconIssue | ModuleLoadIssue | AmbiguousIconIssue;

export interface IconResolutionResult {
  icons: Map<string, string>;
  issues: ResolutionIssue[];
}

export class IconResolver {
  private readonly modules = new Map<string, Promise<Record<string, unknown>>>();

  constructor(
    private readonly loader: ModuleLoader,
    private readonly registry: IconRegistry = ICON_REGISTRY,
  ) {}

  async resolve(iconNames: Iterable<string>, preferences: PackagePreferences): Promise<IconResolutionResult> {
    const results = await Promise.all([...iconNames].map((name) => this.icon(name, preferences)));
    const icons = new Map<string, string>();
    const issues: ResolutionIssue[] = [];

    for (const result of results) {
      if (result.svg !== undefined) icons.set(result.name, result.svg);
      issues.push(...result.issues);
    }
    return { icons, issues: uniqueIssues(issues) };
  }

  private async icon(name: string, preferences: PackagePreferences): Promise<{ name: string; svg?: string; issues: ResolutionIssue[] }> {
    const prefix = name.match(/^[a-z]+/)?.[0];
    const packages = prefix ? this.registry[prefix] : undefined;
    if (!prefix || !packages) return { name, issues: [missing(name, [])] };

    const entries = packages.flatMap(({ packageName, entrypoints }) =>
      entrypoints.map((entrypoint) => ({ packageName, specifier: toSpecifier(packageName, entrypoint) })),
    );
    const attempts = await Promise.all(entries.map(({ packageName, specifier }) => this.attempt(name, packageName, specifier)));
    const loadIssues = attempts.flatMap(({ issue }) => (issue ? [issue] : []));
    const matches = attempts.flatMap(({ match }) => (match ? [match] : []));

    if (matches.length === 0) {
      return {
        name,
        issues:
          loadIssues.length > 0
            ? loadIssues
            : [
                missing(
                  name,
                  entries.map(({ specifier }) => specifier),
                ),
              ],
      };
    }

    const candidates = distinctMatches(matches);
    if (candidates.length === 1) return { name, svg: candidates[0].svg, issues: loadIssues };

    const preferredPackage = prefix === 'mat' ? preferences.mat : undefined;
    const preferred = preferredPackage ? distinctMatches(matches.filter(({ packageName }) => packageName === preferredPackage)) : [];
    if (preferred.length === 1) return { name, svg: preferred[0].svg, issues: loadIssues };

    const specifiers = [...new Set(matches.map(({ specifier }) => specifier))].sort();
    return {
      name,
      issues: [
        ...loadIssues,
        {
          kind: 'ambiguous',
          icon: name,
          specifiers,
          message: `Icon "${name}" has different SVG exports in: ${specifiers.join(', ')}`,
        },
      ],
    };
  }

  private async attempt(name: string, packageName: string, specifier: string): Promise<AttemptResult> {
    try {
      const module = await this.module(specifier);
      const svg = readExport(module, name);
      return svg === undefined ? {} : { match: { packageName, specifier, svg } };
    } catch (error) {
      if (error instanceof ModuleNotFoundError) return {};
      return {
        issue: {
          kind: 'load',
          icon: name,
          specifier,
          message: `Failed to load ${specifier} while resolving "${name}": ${errorMessage(error)}`,
        },
      };
    }
  }

  private module(specifier: string): Promise<Record<string, unknown>> {
    const cached = this.modules.get(specifier);
    if (cached) return cached;

    const loaded = this.loader.load(specifier);
    this.modules.set(specifier, loaded);
    return loaded;
  }
}

function readExport(module: Record<string, unknown>, name: string): string | undefined {
  const direct = module[name];
  if (typeof direct === 'string') return direct;

  const fallback = module['default'];
  if (typeof fallback !== 'object' || fallback === null) return undefined;
  const nested = (fallback as Record<string, unknown>)[name];
  return typeof nested === 'string' ? nested : undefined;
}

function distinctMatches(matches: IconMatch[]): IconMatch[] {
  const bySvg = new Map<string, IconMatch>();
  for (const match of matches) if (!bySvg.has(match.svg)) bySvg.set(match.svg, match);
  return [...bySvg.values()];
}

function missing(icon: string, attempted: string[]): MissingIconIssue {
  return {
    kind: 'missing',
    icon,
    attempted,
    message:
      attempted.length === 0
        ? `No @ng-icons package is registered for icon "${icon}"`
        : `Icon "${icon}" was not found in its registered @ng-icons entrypoints`,
  };
}

function uniqueIssues<T extends ResolutionIssue>(issues: T[]): T[] {
  return [...new Map(issues.map((issue) => [`${issue.kind}:${issue.message}`, issue])).values()];
}
