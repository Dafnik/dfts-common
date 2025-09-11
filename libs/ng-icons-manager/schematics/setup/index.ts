import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

interface Schema {
  appConfigPath?: string;
  angularJsonPath?: string;
  verbose?: boolean;
}

export function setup(options: Schema = {}): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const verbose = !!options.verbose;

    // 1) Update app.config.ts
    const appConfigPath = options.appConfigPath ?? findAppConfigPath(tree);

    if (!appConfigPath || !tree.exists(appConfigPath)) {
      context.logger.error(`app.config.ts not found. Looked at: "${options.appConfigPath ?? 'src/app/app.config.ts'}"`);
    } else {
      const src = tree.read(appConfigPath)?.toString('utf-8') ?? '';
      const updated = updateAppConfig(src, verbose);
      if (updated !== src) {
        tree.overwrite(appConfigPath, updated);
        if (verbose) {
          context.logger.info(`Updated ${appConfigPath} with HTTP loader and provideHttpClient`);
        }
      } else if (verbose) {
        context.logger.info(`No changes applied to ${appConfigPath} (already configured)`);
      }
    }

    // 2) Ensure "src/assets" exists in angular.json assets
    const angularJsonPath = options.angularJsonPath ?? 'angular.json';
    if (tree.exists(angularJsonPath)) {
      const jsonRaw = tree.read(angularJsonPath)?.toString('utf-8') ?? '{}';
      try {
        const json = JSON.parse(jsonRaw);
        const updatedJson = ensureAssets(json, verbose);
        const next = JSON.stringify(updatedJson, null, 2) + '\n';
        if (next !== jsonRaw) {
          tree.overwrite(angularJsonPath, next);
          if (verbose) {
            context.logger.info(`Updated ${angularJsonPath} to include "src/assets"`);
          }
        }
      } catch (e) {
        context.logger.error(`Failed to parse ${angularJsonPath}: ${(e as Error).message}`);
      }
    } else {
      context.logger.warn(`Skipping angular.json edit; file not found at "${angularJsonPath}"`);
    }

    // 3) Update package.json scripts
    updatePackageJson(tree, verbose);

    return tree;
  };
}

/* -------------------------- app.config.ts update -------------------------- */

function updateAppConfig(src: string, verbose: boolean): string {
  let content = src;

  // Ensure imports
  content = ensureNamedImport(content, '@angular/core', ['inject']);
  content = ensureNamedImport(content, '@angular/common/http', ['HttpClient', 'provideHttpClient']);
  content = ensureNamedImport(content, '@ng-icons/core', ['provideNgIconLoader', 'withCaching']);

  // Insert providers into the providers array
  const providersBounds = findProvidersArrayBounds(content);

  const LOADER_SNIPPET =
    `provideNgIconLoader((name) => {\n` +
    `  const httpClient = inject(HttpClient);\n\n` +
    `  return httpClient.get(\`/assets/icons/\${name}.svg\`, { responseType: 'text' });\n` +
    `}, withCaching())`;

  const requiresHttpClient = !/\bprovideHttpClient\s*\(/.test(content);

  if (providersBounds) {
    const { startBracket, endBracket } = providersBounds;
    const before = content.slice(0, endBracket);
    const after = content.slice(endBracket);

    const additions: string[] = [];
    if (requiresHttpClient) additions.push('provideHttpClient()');
    // Always add a new NgIconLoader
    additions.push(LOADER_SNIPPET);

    if (additions.length > 0) {
      const insertion =
        (needsCommaBeforeProvidersClose(content, startBracket, endBracket) ? ',\n' : '\n') + '  ' + additions.join(',\n  ') + '\n';
      content = before + insertion + after;
    }
  } else {
    if (verbose) {
      console.warn('No providers array found in app.config.ts; appending configuration at the end of the file.');
    }

    content = ensureNamedImport(content, '@angular/core', ['ApplicationConfig']);

    const providers: string[] = [];
    if (requiresHttpClient) providers.push('provideHttpClient()');
    providers.push(LOADER_SNIPPET);

    if (providers.length > 0) {
      const appendBlock =
        `\n// Added by schematic\n` +
        `export const appIconsConfig: ApplicationConfig = {\n` +
        `  providers: [\n    ${providers.join(',\n    ')}\n  ],\n` +
        `};\n`;
      content = content + appendBlock;
    }
  }

  return content;
}

/* ----------------------------- helper funcs ----------------------------- */

function findProvidersArrayBounds(content: string): { startBracket: number; endBracket: number } | null {
  const re = /providers\s*:\s*\[/g;
  const m = re.exec(content);
  if (!m) return null;

  const startBracket = content.indexOf('[', m.index);
  if (startBracket === -1) return null;

  let depth = 0;
  for (let i = startBracket; i < content.length; i++) {
    const ch = content[i];
    if (ch === '[') depth++;
    if (ch === ']') {
      depth--;
      if (depth === 0) {
        return { startBracket, endBracket: i };
      }
    }
  }
  return null;
}

function needsCommaBeforeProvidersClose(content: string, startBracket: number, endBracket: number): boolean {
  const inner = content.slice(startBracket + 1, endBracket).trim();
  if (inner.length === 0) return false;
  const lastChar = content.slice(0, endBracket).trimEnd().slice(-1);
  return lastChar !== '[' && lastChar !== ',';
}

function ensureNamedImport(src: string, moduleName: string, names: string[]): string {
  const namedBlockRegex = new RegExp(String.raw`import\s*\{([^}]*)\}\s*from\s*['"]${escapeRegExp(moduleName)}['"]\s*;?`, 'g');
  const namedMatch = namedBlockRegex.exec(src);

  if (namedMatch) {
    const existing = namedMatch[1]
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const toAdd = names.filter((n) => !existing.includes(n));
    if (toAdd.length === 0) return src;

    const updated = 'import {' + [...existing, ...toAdd].join(', ') + `} from '${moduleName}';`;
    return src.slice(0, namedMatch.index) + updated + src.slice(namedMatch.index + namedMatch[0].length);
  }

  // No import — add new one
  return insertImport(src, moduleName, names);
}

function insertImport(src: string, moduleName: string, names: string[]): string {
  const importLine = `import { ${names.join(', ')} } from '${moduleName}';\n`;

  const importStmt = /import\s.+from\s+['"].+['"];?\s*\n/g;
  let lastIdx = -1;
  let m: RegExpExecArray | null;
  while ((m = importStmt.exec(src)) !== null) {
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx >= 0) {
    return src.slice(0, lastIdx) + importLine + src.slice(lastIdx);
  }
  return importLine + src;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* -------------------- angular.json assets handler -------------------- */
function ensureAssets(workspace: any, verbose: boolean): any {
  const projectName = workspace.defaultProject || Object.keys(workspace.projects || {})[0];

  if (!projectName) return workspace;

  const project = workspace.projects[projectName];
  const build = project?.architect?.build ?? project?.targets?.build;
  const options = build?.options ?? (build.options = {});

  const assets = options.assets ?? (options.assets = []);
  const hasSrcAssets = assets.some((a: any) => {
    if (typeof a === 'string') return a === 'src/assets';
    if (a && typeof a === 'object') {
      return a.input === 'src' && a.output === 'assets' && (a.glob === '**/*' || a.glob === '**/*.*');
    }
    return false;
  });

  if (!hasSrcAssets) {
    assets.push('src/assets');
  } else if (verbose) {
    console.log('angular.json already contains "src/assets"');
  }

  return workspace;
}

function findAppConfigPath(tree: Tree): string | null {
  const defaultPath = 'src/app/app.config.ts';
  if (tree.exists(defaultPath)) return defaultPath;

  let found: string | null = null;
  tree.getDir('src').visit((p) => {
    if (p.endsWith('/app.config.ts') && tree.exists(p)) {
      found = p;
    }
  });
  return found;
}

/* ------------------- package.json scripts update -------------------- */
function updatePackageJson(tree: Tree, verbose: boolean) {
  if (!tree.exists('package.json')) {
    if (verbose) {
      console.warn('package.json not found, skipping script update.');
    }
    return;
  }

  const packageJsonSource = tree.read('package.json')!.toString('utf-8');
  let pkg: any;
  try {
    pkg = JSON.parse(packageJsonSource);
  } catch (e) {
    console.error('Failed to parse package.json', e);
    return;
  }

  pkg.scripts ??= {};

  pkg.scripts['start'] = 'ng serve & ng-icons-manager --watch';
  pkg.scripts['build'] = 'ng-icons-manager && ng build';

  const updated = JSON.stringify(pkg, null, 2) + '\n';
  tree.overwrite('package.json', updated);

  if (verbose) {
    console.log('✅ Updated package.json scripts for ng-icons-manager integration.');
  }
}
