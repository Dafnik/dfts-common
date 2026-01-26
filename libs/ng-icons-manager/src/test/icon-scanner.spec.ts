import { DEFAULT_CONFIG } from '../config';
import { ScannerFacade } from '../core';
import { MockFileSystemAdapter, MockLogger, MockModuleResolver } from './mock.spec';
import { IconScannerConfig, IconScannerRunOptions } from '../types';

const DEFAULT_TEST_CONFIG = {
  ...DEFAULT_CONFIG,
  outDir: 'src/assets/icons',
  iconMap: {
    hero: '@ng-icons/heroicons',
    fa: '@ng-icons/font-awesome',
  },
};

const DEFAULT_RUN_OPTIONS: IconScannerRunOptions = {
  verbose: false,
  watchMode: false,
};

describe('ScannerFacade', () => {
  describe('basic functionality', () => {
    let fs: MockFileSystemAdapter;
    let moduleResolver: MockModuleResolver;
    let logger: MockLogger;
    let scanner: ScannerFacade;
    let config: IconScannerConfig;
    let runOptions: IconScannerRunOptions;

    beforeEach(() => {
      fs = new MockFileSystemAdapter();
      moduleResolver = new MockModuleResolver();
      logger = new MockLogger();
      scanner = new ScannerFacade(fs, moduleResolver, logger);

      config = {
        ...DEFAULT_TEST_CONFIG,
      };

      runOptions = {
        ...DEFAULT_RUN_OPTIONS,
      };

      // preload test modules for hero and fa packages
      moduleResolver.setModule('@ng-icons/heroicons', {
        heroHome: '<svg>home icon</svg>',
        heroUser: '<svg>user icon</svg>',
      });

      moduleResolver.setModule('@ng-icons/font-awesome', {
        faHeart: '<svg>heart icon</svg>',
      });
    });
    it('should scan files and extract icon names', async () => {
      fs.setFile(
        'src/app/component.html',
        `
      <ng-icon name="heroHome"></ng-icon>
      <ng-icon name="heroUser"></ng-icon>
    `,
      );

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      expect(result.errors).toEqual([]);
    });

    it('should write icon files to output directory', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(runOptions, config);

      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
      expect(fs.getFile('src/assets/icons/heroHome.svg')).toBe('<svg>home icon</svg>');
    });

    it('should handle missing packages gracefully', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="unknownIcon"></ng-icon>');

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Package not found for icon: unknownIcon');
      expect(logger.getErrors()).toHaveLength(1);
    });

    it('should handle missing packages when not ignoring', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="unknownIcon"></ng-icon>');

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Package not found for icon: unknownIcon');
      expect(logger.getErrors()).toHaveLength(1);
    });

    it('should handle missing icons in packages', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroMissing"></ng-icon>');

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Icon "heroMissing" missing in package');
    });
  });

  describe('watch mode', () => {
    let fs: MockFileSystemAdapter;
    let moduleResolver: MockModuleResolver;
    let logger: MockLogger;
    let scanner: ScannerFacade;
    let config: IconScannerConfig;
    let runOptions: IconScannerRunOptions;

    beforeEach(() => {
      fs = new MockFileSystemAdapter();
      moduleResolver = new MockModuleResolver();
      logger = new MockLogger();
      scanner = new ScannerFacade(fs, moduleResolver, logger);

      config = {
        ...DEFAULT_TEST_CONFIG,
      };

      runOptions = {
        ...DEFAULT_RUN_OPTIONS,
        watchMode: true, // default for watch-mode tests
      };

      // preload mock icon modules
      moduleResolver.setModule('@ng-icons/heroicons', {
        heroHome: '<svg>home icon</svg>',
        heroUser: '<svg>user icon</svg>',
      });
    });

    it('should build cache from filesystem on first run', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      fs.setFile('src/assets/icons/heroHome.svg', '<svg>home icon</svg>');
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

      await scanner.scanAndCopy(runOptions, config);

      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

      // Clear filesystem but preserve internal cache
      fs.clear();
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );

      const result = await scanner.scanAndCopy(runOptions, config);

      // The cache remembers heroHome; only heroUser should be newly written
      expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(false);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });

    it('should cache icons on first run', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(runOptions, config);
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

      // Clear filesystem but preserve internal cache
      fs.clear();
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );

      const result = await scanner.scanAndCopy(runOptions, config);

      // The cache remembers heroHome; only heroUser should be newly written
      expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(false);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });

    it('should add new icons incrementally', async () => {
      // First run with one icon
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      await scanner.scanAndCopy(runOptions, config);

      // Second run with an additional icon
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );

      await scanner.scanAndCopy(runOptions, config);

      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });

    it('should remove unused icons', async () => {
      // First run with two icons
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );
      await scanner.scanAndCopy(runOptions, config);

      // Second run with only one icon
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      await scanner.scanAndCopy(runOptions, config);

      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(false);
    });
  });

  describe('verbose mode', () => {
    let fs: MockFileSystemAdapter;
    let moduleResolver: MockModuleResolver;
    let logger: MockLogger;
    let scanner: ScannerFacade;
    let config: IconScannerConfig;
    let runOptions: IconScannerRunOptions;

    beforeEach(() => {
      fs = new MockFileSystemAdapter();
      moduleResolver = new MockModuleResolver();
      logger = new MockLogger();
      scanner = new ScannerFacade(fs, moduleResolver, logger);

      config = {
        ...DEFAULT_TEST_CONFIG,
      };

      runOptions = {
        ...DEFAULT_RUN_OPTIONS,
        verbose: true,
      };

      // preload packages
      moduleResolver.setModule('@ng-icons/heroicons', {
        heroHome: '<svg>home icon</svg>',
        heroUser: '<svg>user icon</svg>',
      });
    });

    it('should log used icons when verbose', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(runOptions, config);

      const logs = logger.getLogs();
      // Matches the actual log message format from ScannerFacade
      console.log(logs);
      expect(logs.some((log) => log.includes('Found 1 icons: heroHome'))).toBe(true);
      expect(logs.some((log) => log.includes('Wrote heroHome.svg'))).toBe(true);
    });

    it('should log icon removal events in watch mode', async () => {
      runOptions.watchMode = true;

      // First run — heroHome
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      await scanner.scanAndCopy(runOptions, config);

      logger.clear();

      // Second run — heroUser replaces heroHome
      fs.setFile('src/app/component.html', '<ng-icon name="heroUser"></ng-icon>');
      await scanner.scanAndCopy(runOptions, config);

      const logs = logger.getLogs();
      expect(logs.some((log) => log.includes('Found 1 icons: heroUser'))).toBe(true);
      expect(logs.some((log) => log.includes('Removed heroHome.svg'))).toBe(true);
      expect(logs.some((log) => log.includes('Wrote heroUser.svg'))).toBe(true);
    });
  });

  describe('edge cases', () => {
    let fs: MockFileSystemAdapter;
    let moduleResolver: MockModuleResolver;
    let logger: MockLogger;
    let scanner: ScannerFacade;
    let config: IconScannerConfig;
    let runOptions: IconScannerRunOptions;

    beforeEach(() => {
      fs = new MockFileSystemAdapter();
      moduleResolver = new MockModuleResolver();
      logger = new MockLogger();
      scanner = new ScannerFacade(fs, moduleResolver, logger);

      config = {
        ...DEFAULT_TEST_CONFIG,
      };

      runOptions = {
        ...DEFAULT_RUN_OPTIONS,
      };

      // preload mock modules
      moduleResolver.setModule('@ng-icons/heroicons', {
        heroHome: '<svg>home icon</svg>',
        heroUser: '<svg>user icon</svg>',
      });
    });

    it('should handle empty files', async () => {
      fs.setFile('src/app/component.html', '');

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.usedIcons.size).toBe(0);
      expect(result.errors).toEqual([]);
    });

    it('should handle files with no icons', async () => {
      fs.setFile('src/app/component.html', '<div>No icons here</div>');

      const result = await scanner.scanAndCopy(runOptions, config);

      expect(result.usedIcons.size).toBe(0);
      expect(result.errors).toEqual([]);
    });

    it('should handle duplicate icon references', async () => {
      fs.setFile(
        'src/app/component.html',
        `
      <ng-icon name="heroHome"></ng-icon>
      <ng-icon name="heroHome"></ng-icon>
    `,
      );

      fs.setFile(
        'src/app/component.ts',
        `
      <ng-icon name="heroHome"></ng-icon>
      <ng-icon name="heroHome"></ng-icon>
    `,
      );

      const result = await scanner.scanAndCopy(runOptions, config);

      // deduplicated into a single icon
      expect(result.usedIcons).toEqual(new Set(['heroHome']));
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
    });

    it('should reset cache when requested', async () => {
      // Ensure you add `resetCache()` method in ScannerFacade:
      // resetCache(): void { this.cache.clear(); }

      runOptions.watchMode = true;
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(runOptions, config);
      scanner.resetCache();

      // After reset, behaves like first run
      fs.setFile('src/app/component.html', '<ng-icon name="heroUser"></ng-icon>');
      await scanner.scanAndCopy(runOptions, config);

      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });
  });

  describe('comment-based icon detection', () => {
    let fs: MockFileSystemAdapter;
    let moduleResolver: MockModuleResolver;
    let logger: MockLogger;
    let scanner: ScannerFacade;
    let config: IconScannerConfig;
    let runOptions: IconScannerRunOptions;

    beforeEach(() => {
      fs = new MockFileSystemAdapter();
      moduleResolver = new MockModuleResolver();
      logger = new MockLogger();
      scanner = new ScannerFacade(fs, moduleResolver, logger);

      config = {
        ...DEFAULT_TEST_CONFIG,
        iconMap: {
          hero: '@ng-icons/heroicons',
          bootstrap: '@ng-icons/bootstrap-icons',
          fa: '@ng-icons/font-awesome',
        },
      };

      runOptions = {
        ...DEFAULT_RUN_OPTIONS,
      };

      // Mock modules
      moduleResolver.setModule('@ng-icons/heroicons', {
        heroHome: '<svg>home icon</svg>',
        heroUser: '<svg>user icon</svg>',
        heroSettings: '<svg>settings icon</svg>',
        heroFeather: '<svg>feather icon</svg>',
      });

      moduleResolver.setModule('@ng-icons/bootstrap-icons', {
        bootstrapCircle: '<svg>circle</svg>',
        bootstrapXCircleFill: '<svg>x circle fill</svg>',
      });

      moduleResolver.setModule('@ng-icons/font-awesome', {
        faHeart: '<svg>heart icon</svg>',
      });
    });

    describe('TypeScript comment extraction', () => {
      it('should extract icons from JSDoc comments', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * i(bootstrapCircle, heroFeather)
         */
        export class MyComponent {}
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);

        expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather']));
      });

      it('should extract icons from block comments', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /* i(bootstrapXCircleFill) */
        export const icon = 'test';
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);

        expect(result.usedIcons).toEqual(new Set(['bootstrapXCircleFill']));
      });

      it('should extract multiple i() calls in single comment', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * i(heroHome)
         * i(heroUser, heroSettings)
         */
        export class MyComponent {}
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'heroSettings']));
      });

      it('should handle whitespace variations in comments', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         *   i(  bootstrapCircle  ,  heroFeather  )
         */
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);

        expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather']));
      });

      it('should extract icons from nested comments', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * Component for displaying icons
         * i(heroHome, heroUser)
         * @example
         * <my-component></my-component>
         */
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      });
    });

    it('should extract icons from JSDoc and HTML comments', async () => {
      fs.setFile(
        'src/app/component.ts',
        `
      @Component({
        template: \`
          <!-- i(heroFeather) -->
          <span>Test</span>
        \`
      })
      export class MyComponent {
        /**
        * i(bootstrapCircle)
        */
        test() {}
      }
    `,
      );

      const result = await scanner.scanAndCopy(runOptions, config);
      expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather']));
    });

    describe('HTML comment extraction', () => {
      it('should extract icons from HTML comments', async () => {
        fs.setFile(
          'src/app/component.html',
          `
        <!-- i(bootstrapCircle, heroFeather) -->
        <div>Content</div>
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather']));
      });

      it('should extract multiple i() calls in HTML comment', async () => {
        fs.setFile(
          'src/app/component.html',
          `
        <!--
          i(heroHome)
          i(heroUser, heroSettings)
        -->
        <template></template>
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'heroSettings']));
      });

      it('should handle multiline HTML comments', async () => {
        fs.setFile(
          'src/app/component.html',
          `
        <!--
          Icons used in this template:
          i(heroHome, heroUser)
          i(faHeart)
        -->
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'faHeart']));
      });

      it('should extract single icon from HTML comment', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome']));
      });
    });

    describe('mixed detection', () => {
      it('should detect icons from both comments and ng-icon tags', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * i(bootstrapCircle)
         */
        export class MyComponent {}
      `,
        );

        fs.setFile(
          'src/app/component.html',
          `
        <!-- i(heroFeather) -->
        <ng-icon name="heroHome"></ng-icon>
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather', 'heroHome']));
      });

      it('should deduplicate icons from different sources', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * i(heroHome, heroUser)
         */
      `,
        );

        fs.setFile(
          'src/app/component.html',
          `
        <!-- i(heroHome) -->
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      });

      it('should write all detected icons to output', async () => {
        fs.setFile('src/app/component.ts', '/* i(heroHome) */');
        fs.setFile('src/app/component.html', '<!-- i(heroUser) -->');

        await scanner.scanAndCopy(runOptions, config);

        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should ignore empty i() calls', async () => {
        fs.setFile('src/app/component.html', '<!-- i() -->');

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons.size).toBe(0);
      });

      it('should handle comments with no i() calls', async () => {
        fs.setFile('src/app/component.html', '<!-- This is just a comment -->');

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons.size).toBe(0);
      });

      it('should not extract i() from string literals in code', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        const str = 'i(heroHome)';
        const regex = /i\\(([^)]+)\\)/g;
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons.size).toBe(0);
      });

      it('should handle multiple comments in same file', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * i(heroHome)
         */
        export class Component1 {}

        /**
         * i(heroUser)
         */
        export class Component2 {}

        /* i(heroSettings) */
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'heroSettings']));
      });

      it('should handle comments with special characters and line breaks', async () => {
        fs.setFile(
          'src/app/component.html',
          `
        <!--
          TODO: Add more icons
          i(
            heroHome,
            heroUser,
            heroSettings
          )
          @deprecated
        -->
      `,
        );

        const result = await scanner.scanAndCopy(runOptions, config);
        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'heroSettings']));
      });
    });

    describe('watch mode with comments', () => {
      beforeEach(() => {
        runOptions.watchMode = true;
      });

      it('should detect comment-based icons in watch mode', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');

        await scanner.scanAndCopy(runOptions, config);
        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

        fs.clear();
        fs.setFile('src/app/component.html', '<!-- i(heroHome, heroUser) -->');

        await scanner.scanAndCopy(runOptions, config);
        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
      });

      it('should handle removal of comment-based icons', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome, heroUser) -->');

        await scanner.scanAndCopy(runOptions, config);

        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');
        await scanner.scanAndCopy(runOptions, config);

        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(false);
      });
    });
  });
});
