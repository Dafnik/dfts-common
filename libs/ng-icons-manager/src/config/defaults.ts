import { join } from 'path';

import { IconScannerConfig } from '../types';
import { ICON_MAP } from './icon-map';

export const DEFAULT_CONFIG: IconScannerConfig = {
  srcGlob: 'src/**/*.{html,ts}',
  outDir: join(process.cwd(), 'src/assets/icons'),
  iconMap: ICON_MAP,
};
