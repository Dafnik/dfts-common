// main.ts
import { join } from 'path';

import { ConsoleLogger } from './adapters/console-logger';
import { RealFileSystemAdapter } from './adapters/fs-adapter';
import { RealModuleResolver } from './adapters/module-resolver';
import { IconScanner } from './icon-scanner';

const iconMap: Record<string, string> = {
  akar: '@ng-icons/akar-icons',
  bootstrap: '@ng-icons/bootstrap-icons',
  box: '@ng-icons/boxicons/regular',
  circum: '@ng-icons/circum-icons',
  crypto: '@ng-icons/cryptocurrency-icons',
  css: '@ng-icons/css.gg',
  di: '@ng-icons/devicon/plain',
  drip: '@ng-icons/dripicons',
  feather: '@ng-icons/feather-icons',
  fa: '@ng-icons/font-awesome/regular',
  flag: '@ng-icons/flag-icons',
  game: '@ng-icons/game-icons',
  hero: '@ng-icons/heroicons/outline',
  huge: '@ng-icons/huge-icons',
  iconoir: '@ng-icons/iconoir',
  sax: '@ng-icons/iconsax/outline',
  ion: '@ng-icons/ionicons',
  jam: '@ng-icons/jam-icons',
  lets: '@ng-icons/lets-icons/light',
  matf: '@ng-icons/material-file-icons/uncolored',
  mono: '@ng-icons/mono-icons',
  myna: '@ng-icons/mynaui/outline',
  oct: '@ng-icons/octicons',
  phosphor: '@ng-icons/phosphor-icons/regular',
  radix: '@ng-icons/radix-icons',
  remix: '@ng-icons/remixicon',
  simple: '@ng-icons/simple-icons',
  solar: '@ng-icons/solar-icons/outline',
  tabler: '@ng-icons/tabler-icons',
  tdesign: '@ng-icons/tdesign-icons',
  typ: '@ng-icons/typicons',
  aspects: '@ng-icons/ux-aspects',
};

const cachedIcons: Set<string> = new Set();

export async function scanAndCopy(verbose: boolean, watchMode: boolean, ignoreMissingIcons: boolean) {
  const scanner = new IconScanner(new RealFileSystemAdapter(), new RealModuleResolver(), new ConsoleLogger(), cachedIcons, {
    srcGlob: 'src/**/*.{html,ts}',
    outDir: join(process.cwd(), 'src/assets/icons'),
    iconRegex: /<ng-icon[^>]*name=["']([^"']+)["']/g,
    iconMap,
    verbose,
    watchMode,
    ignoreMissingIcons,
  });

  try {
    const result = await scanner.scanAndCopy();

    if (result.errors.length > 0 && !watchMode && !ignoreMissingIcons) {
      process.exit(1);
    }

    return result;
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}
