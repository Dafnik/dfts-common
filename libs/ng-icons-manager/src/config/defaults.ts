import { join } from 'path';

import { IconScannerConfig } from '../types';
import { ICON_MAP } from './icon-map';

export const GLOB_PATTERN = '**/*.{html,ts}';

export const DEFAULT_CONFIG: IconScannerConfig = {
  srcDirs: ['src'],
  outDir: join(process.cwd(), 'src/assets/icons'),
  iconMap: ICON_MAP,
};
