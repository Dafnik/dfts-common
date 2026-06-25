import { ICON_REGISTRY, type IconRegistry, toSpecifier } from '../internal/core/icon-registry';
import { IconResolver } from '../internal/core/icon-resolver';
import { FakeModuleLoader } from './fakes';

export function registryPackageCount(registry: IconRegistry = ICON_REGISTRY): number {
  return new Set(
    Object.values(registry)
      .flat()
      .map(({ packageName }) => packageName),
  ).size;
}

describe('icon registry and resolver', () => {
  it('covers all 39 ng-icons packages and representative secondary entrypoints', () => {
    expect(registryPackageCount()).toBe(39);
    const specifiers = Object.values(ICON_REGISTRY)
      .flatMap((packages) =>
        packages.flatMap(({ packageName, entrypoints }) => entrypoints.map((entrypoint) => toSpecifier(packageName, entrypoint))),
      )
      .sort();
    expect(specifiers).toEqual(
      [
        '@ng-icons/akar-icons',
        '@ng-icons/bootstrap-icons',
        '@ng-icons/boxicons/regular',
        '@ng-icons/boxicons/solid',
        '@ng-icons/boxicons/logos',
        '@ng-icons/circum-icons',
        '@ng-icons/coolicons',
        '@ng-icons/cryptocurrency-icons',
        '@ng-icons/cryptocurrency-icons/colored',
        '@ng-icons/css.gg',
        '@ng-icons/devicon/plain',
        '@ng-icons/devicon/original',
        '@ng-icons/devicon/line',
        '@ng-icons/dripicons',
        '@ng-icons/feather-icons',
        '@ng-icons/flag-icons',
        '@ng-icons/flag-icons/square',
        '@ng-icons/fluent-ui',
        '@ng-icons/fluent-ui/filled',
        '@ng-icons/font-awesome/regular',
        '@ng-icons/font-awesome/solid',
        '@ng-icons/font-awesome/brands',
        '@ng-icons/game-icons',
        '@ng-icons/heroicons/outline',
        '@ng-icons/heroicons/solid',
        '@ng-icons/heroicons/mini',
        '@ng-icons/heroicons/micro',
        '@ng-icons/huge-icons',
        '@ng-icons/iconoir/regular',
        '@ng-icons/iconoir/solid',
        '@ng-icons/iconsax/bold',
        '@ng-icons/iconsax/bulk',
        '@ng-icons/iconsax/outline',
        '@ng-icons/ionicons',
        '@ng-icons/jam-icons',
        '@ng-icons/lets-icons/light',
        '@ng-icons/lets-icons/fill',
        '@ng-icons/lets-icons/duotone',
        '@ng-icons/lets-icons/duotone-line',
        '@ng-icons/lets-icons/regular',
        '@ng-icons/lobe-icons',
        '@ng-icons/lobe-icons/color',
        '@ng-icons/lucide',
        '@ng-icons/material-file-icons/colored',
        '@ng-icons/material-file-icons/uncolored',
        '@ng-icons/material-icons/baseline',
        '@ng-icons/material-icons/outline',
        '@ng-icons/material-icons/round',
        '@ng-icons/material-icons/sharp',
        '@ng-icons/material-symbols/outline',
        '@ng-icons/material-symbols/round',
        '@ng-icons/material-symbols/sharp',
        '@ng-icons/mono-icons',
        '@ng-icons/mynaui/outline',
        '@ng-icons/mynaui/solid',
        '@ng-icons/octicons',
        '@ng-icons/octicons/large',
        '@ng-icons/phosphor-icons/bold',
        '@ng-icons/phosphor-icons/duotone',
        '@ng-icons/phosphor-icons/fill',
        '@ng-icons/phosphor-icons/light',
        '@ng-icons/phosphor-icons/regular',
        '@ng-icons/phosphor-icons/thin',
        '@ng-icons/radix-icons',
        '@ng-icons/remixicon',
        '@ng-icons/simple-icons',
        '@ng-icons/solar-icons/bold',
        '@ng-icons/solar-icons/duotone',
        '@ng-icons/solar-icons/outline',
        '@ng-icons/solar-icons/bold-duotone',
        '@ng-icons/solar-icons/broken',
        '@ng-icons/solar-icons/linear',
        '@ng-icons/svgl',
        '@ng-icons/tabler-icons',
        '@ng-icons/tabler-icons/fill',
        '@ng-icons/tdesign-icons',
        '@ng-icons/typicons',
        '@ng-icons/ux-aspects',
      ].sort(),
    );
  });

  it('finds exact variants and caches every imported entrypoint', async () => {
    const modules = new FakeModuleLoader();
    modules.modules.set('@ng-icons/heroicons/outline', { heroHome: '<svg>outline</svg>' });
    modules.modules.set('@ng-icons/heroicons/solid', { heroHomeSolid: '<svg>solid</svg>' });
    modules.modules.set('@ng-icons/heroicons/mini', {});
    modules.modules.set('@ng-icons/heroicons/micro', {});
    const resolver = new IconResolver(modules);

    const first = await resolver.resolve(['heroHome', 'heroHomeSolid'], {});
    const second = await resolver.resolve(['heroHome'], {});

    expect(first.icons).toEqual(
      new Map([
        ['heroHome', '<svg>outline</svg>'],
        ['heroHomeSolid', '<svg>solid</svg>'],
      ]),
    );
    expect(second.issues).toEqual([]);
    expect(modules.calls).toHaveLength(4);
  });

  it('accepts identical duplicate exports and rejects different SVG content', async () => {
    const identicalModules = new FakeModuleLoader();
    identicalModules.modules.set('@ng-icons/material-icons/baseline', { matHome: '<svg>same</svg>' });
    identicalModules.modules.set('@ng-icons/material-symbols/outline', { matHome: '<svg>same</svg>' });
    const identical = await new IconResolver(identicalModules).resolve(['matHome'], {});
    expect(identical.icons.get('matHome')).toBe('<svg>same</svg>');

    const differentModules = new FakeModuleLoader();
    differentModules.modules.set('@ng-icons/material-icons/baseline', { matHome: '<svg>icons</svg>' });
    differentModules.modules.set('@ng-icons/material-symbols/outline', { matHome: '<svg>symbols</svg>' });
    const different = await new IconResolver(differentModules).resolve(['matHome'], {});
    expect(different.issues[0]).toMatchObject({ kind: 'ambiguous' });
  });

  it('uses a material preference only when different matches exist', async () => {
    const modules = new FakeModuleLoader();
    modules.modules.set('@ng-icons/material-icons/baseline', { matHome: '<svg>icons</svg>' });
    modules.modules.set('@ng-icons/material-symbols/outline', { matHome: '<svg>symbols</svg>', matOnly: '<svg>only</svg>' });
    const resolver = new IconResolver(modules);

    const preferred = await resolver.resolve(['matHome'], { mat: '@ng-icons/material-symbols' });
    const soleMatch = await resolver.resolve(['matOnly'], { mat: '@ng-icons/material-icons' });

    expect(preferred.icons.get('matHome')).toBe('<svg>symbols</svg>');
    expect(soleMatch.icons.get('matOnly')).toBe('<svg>only</svg>');
  });

  it('reports unregistered and unavailable icons as missing', async () => {
    const resolver = new IconResolver(new FakeModuleLoader());
    const result = await resolver.resolve(['unknownIcon', 'bootstrapAlarm'], {});
    expect(result.issues).toHaveLength(2);
    expect(result.issues.every(({ kind }) => kind === 'missing')).toBe(true);
  });

  it('distinguishes an unavailable entrypoint from a broken module', async () => {
    const modules = new FakeModuleLoader();
    modules.modules.set('@ng-icons/bootstrap-icons', new Error('package evaluation failed'));

    const result = await new IconResolver(modules).resolve(['bootstrapAlarm'], {});

    expect(result.issues).toEqual([
      expect.objectContaining({
        kind: 'load',
        icon: 'bootstrapAlarm',
        specifier: '@ng-icons/bootstrap-icons',
        message: expect.stringContaining('package evaluation failed'),
      }),
    ]);
  });
});
