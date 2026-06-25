export interface IconRegistryPackage {
  readonly packageName: string;
  readonly entrypoints: readonly string[];
}

export type IconRegistry = Readonly<Record<string, readonly IconRegistryPackage[]>>;

export const ICON_REGISTRY = {
  akar: [{ packageName: '@ng-icons/akar-icons', entrypoints: [''] }],
  aspects: [{ packageName: '@ng-icons/ux-aspects', entrypoints: [''] }],
  bootstrap: [{ packageName: '@ng-icons/bootstrap-icons', entrypoints: [''] }],
  box: [{ packageName: '@ng-icons/boxicons', entrypoints: ['regular', 'solid', 'logos'] }],
  circum: [{ packageName: '@ng-icons/circum-icons', entrypoints: [''] }],
  cool: [{ packageName: '@ng-icons/coolicons', entrypoints: [''] }],
  crypto: [{ packageName: '@ng-icons/cryptocurrency-icons', entrypoints: ['', 'colored'] }],
  css: [{ packageName: '@ng-icons/css.gg', entrypoints: [''] }],
  di: [{ packageName: '@ng-icons/devicon', entrypoints: ['plain', 'original', 'line'] }],
  drip: [{ packageName: '@ng-icons/dripicons', entrypoints: [''] }],
  fa: [{ packageName: '@ng-icons/font-awesome', entrypoints: ['regular', 'solid', 'brands'] }],
  feather: [{ packageName: '@ng-icons/feather-icons', entrypoints: [''] }],
  flag: [{ packageName: '@ng-icons/flag-icons', entrypoints: ['', 'square'] }],
  fluent: [{ packageName: '@ng-icons/fluent-ui', entrypoints: ['', 'filled'] }],
  game: [{ packageName: '@ng-icons/game-icons', entrypoints: [''] }],
  hero: [{ packageName: '@ng-icons/heroicons', entrypoints: ['outline', 'solid', 'mini', 'micro'] }],
  huge: [{ packageName: '@ng-icons/huge-icons', entrypoints: [''] }],
  iconoir: [{ packageName: '@ng-icons/iconoir', entrypoints: ['regular', 'solid'] }],
  ion: [{ packageName: '@ng-icons/ionicons', entrypoints: [''] }],
  jam: [{ packageName: '@ng-icons/jam-icons', entrypoints: [''] }],
  lets: [
    {
      packageName: '@ng-icons/lets-icons',
      entrypoints: ['light', 'fill', 'duotone', 'duotone-line', 'regular'],
    },
  ],
  lobe: [{ packageName: '@ng-icons/lobe-icons', entrypoints: ['', 'color'] }],
  lucide: [{ packageName: '@ng-icons/lucide', entrypoints: [''] }],
  mat: [
    {
      packageName: '@ng-icons/material-icons',
      entrypoints: ['baseline', 'outline', 'round', 'sharp'],
    },
    {
      packageName: '@ng-icons/material-symbols',
      entrypoints: ['outline', 'round', 'sharp'],
    },
  ],
  matf: [{ packageName: '@ng-icons/material-file-icons', entrypoints: ['colored', 'uncolored'] }],
  mono: [{ packageName: '@ng-icons/mono-icons', entrypoints: [''] }],
  myna: [{ packageName: '@ng-icons/mynaui', entrypoints: ['outline', 'solid'] }],
  oct: [{ packageName: '@ng-icons/octicons', entrypoints: ['', 'large'] }],
  phosphor: [
    {
      packageName: '@ng-icons/phosphor-icons',
      entrypoints: ['bold', 'duotone', 'fill', 'light', 'regular', 'thin'],
    },
  ],
  radix: [{ packageName: '@ng-icons/radix-icons', entrypoints: [''] }],
  remix: [{ packageName: '@ng-icons/remixicon', entrypoints: [''] }],
  sax: [{ packageName: '@ng-icons/iconsax', entrypoints: ['bold', 'bulk', 'outline'] }],
  simple: [{ packageName: '@ng-icons/simple-icons', entrypoints: [''] }],
  solar: [
    {
      packageName: '@ng-icons/solar-icons',
      entrypoints: ['bold', 'duotone', 'outline', 'bold-duotone', 'broken', 'linear'],
    },
  ],
  svgl: [{ packageName: '@ng-icons/svgl', entrypoints: [''] }],
  tabler: [{ packageName: '@ng-icons/tabler-icons', entrypoints: ['', 'fill'] }],
  tdesign: [{ packageName: '@ng-icons/tdesign-icons', entrypoints: [''] }],
  typ: [{ packageName: '@ng-icons/typicons', entrypoints: [''] }],
} as const satisfies IconRegistry;

export function toSpecifier(packageName: string, entrypoint: string): string {
  return entrypoint ? `${packageName}/${entrypoint}` : packageName;
}
