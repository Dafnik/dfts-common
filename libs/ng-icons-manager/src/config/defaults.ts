import { join } from 'path';

import { IconScannerConfig } from '../types';
import { ICON_MAP } from './icon-map';

export const DEFAULT_CONFIG: Omit<IconScannerConfig, 'verbose' | 'watchMode' | 'ignoreMissingIcons'> = {
  srcGlob: 'src/**/*.{html,ts}',
  outDir: join(process.cwd(), 'src/assets/icons'),
  iconRegex: /<ng-icon[^>]*name=["']([^"']+)["']/g,
  iconMap: ICON_MAP,
};
