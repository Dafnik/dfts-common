import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { glob } from 'glob';
import { createRequire } from 'module';
import { join } from 'path';

const require = createRequire(import.meta.url);

const iconMap: Record<string, string> = {
  akar: '@ng-icons/akar-icons',
  bootstrap: '@ng-icons/bootstrap-icons',
  box: '@ng-icons/boxicons',
  circum: '@ng-icons/circum-icons',
  crypto: '@ng-icons/cryptocurrency-icons',
  css: '@ng-icons/css-gg',
  di: '@ng-icons/devicon',
  drip: '@ng-icons/dripicons',
  feather: '@ng-icons/feather-icons',
  flag: '@ng-icons/flag-icons',
  fa: '@ng-icons/font-awesome',
  game: '@ng-icons/game-icons',
  hero: '@ng-icons/heroicons',
  huge: '@ng-icons/huge-icons',
};

const SRC_GLOB = 'src/**/*.{html,ts}';
const OUT_DIR = join(process.cwd(), 'src/assets/icons');
const ICON_REGEX = /<ng-icon[^>]*name=["']([^"']+)["']/g;

// In-memory cache of used icons across watch events (no file persisted).
let cachedIcons: Set<string> | null = null;

export async function scanAndCopy(verbose: boolean, watchMode: boolean, ignoreMissingIcons: boolean) {
  const files = glob.sync(SRC_GLOB, { absolute: true });
  const usedIcons = new Set<string>();

  for (const file of files) {
    const content = readFileSync(file, 'utf-8');
    let match: RegExpExecArray | null;
    while ((match = ICON_REGEX.exec(content)) !== null) {
      usedIcons.add(match[1]);
    }
  }

  if (verbose) {
    console.log('📦 Used icons:', [...usedIcons]);
  }

  const isFirstWatchRun = watchMode && cachedIcons === null;

  // Ensure output directory exists
  if (!watchMode || isFirstWatchRun) {
    // Non-watch or first watch run: recreate the folder once.
    rmSync(OUT_DIR, { recursive: true, force: true });
    mkdirSync(OUT_DIR, { recursive: true });
  } else {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  if (!watchMode) {
    // Non-watch mode: full rebuild (backwards-compatible behavior)
    await writeIconsBulk(usedIcons, verbose, ignoreMissingIcons, watchMode);
    return;
  }

  // Watch mode: incremental updates with in-memory cache
  if (isFirstWatchRun) {
    await writeIconsBulk(usedIcons, verbose, ignoreMissingIcons, watchMode);
    cachedIcons = new Set(usedIcons);
    return;
  }

  // Subsequent watch runs: diff and apply
  const toAdd = diff(usedIcons, cachedIcons!);
  const toRemove = diff(cachedIcons!, usedIcons);

  if (verbose) {
    console.log(`🔁 Diff — add: ${toAdd.size}, remove: ${toRemove.size}`);
  }

  // Remove unused icon files
  for (const icon of toRemove) {
    const p = join(OUT_DIR, `${icon}.svg`);
    try {
      rmSync(p, { force: true });
      if (verbose) console.log(`🗑 Removed ${icon}.svg`);
    } catch (err) {
      logError(`❌ Failed to remove ${icon}.svg`, err);
    }
  }

  // Add newly used icons
  await writeIconsBulk(toAdd, verbose, ignoreMissingIcons, watchMode);

  // Update cache
  cachedIcons = new Set(usedIcons);
}

function logError(...text: unknown[]) {
  console.error('\x1b[31m%s\x1b[0m', ...text);
}

function diff(a: Set<string>, b: Set<string>): Set<string> {
  const out = new Set<string>();
  for (const v of a) {
    if (!b.has(v)) out.add(v);
  }
  return out;
}

async function writeIconsBulk(icons: Set<string>, verbose: boolean, ignoreMissingIcons: boolean, watchMode: boolean) {
  for (const icon of icons) {
    const prefix = icon.match(/^[a-z]+/i)?.[0].toLowerCase();
    const pkg = prefix ? iconMap[prefix] : undefined;

    if (!pkg) {
      logError(`❌ Package "${prefix}" not found`);
      if (!watchMode && !ignoreMissingIcons) {
        process.exit(1);
      }
      continue;
    }

    try {
      // Resolve the module by package name from the project root node_modules
      const resolved = require.resolve(pkg, { paths: [process.cwd()] });
      const mod = await import(resolved);
      const svg = mod[icon];
      if (!svg) {
        logError(`❌ Icon "${icon}" not found in ${pkg}`);
        if (!watchMode && !ignoreMissingIcons) {
          process.exit(1);
        }
        continue;
      }
      const path = join(OUT_DIR, `${icon}.svg`);
      writeFileSync(path, svg, 'utf-8');
      if (verbose) {
        console.log(`✔ Wrote ${icon}.svg`);
      }
    } catch (err) {
      logError(`❌ Failed to import ${icon} from ${pkg}`, err);
      if (!watchMode && !ignoreMissingIcons) {
        process.exit(1);
      }
    }
  }
}
