import { IconScanner } from './icon-scanner';
import { MockFileSystemAdapter, MockLogger, MockModuleResolver } from './test/mock';
import type { IconScannerConfig } from './types';

describe('IconScanner', () => {
  let fs: MockFileSystemAdapter;
  let moduleResolver: MockModuleResolver;
  let logger: MockLogger;
  let config: IconScannerConfig;
  let scanner: IconScanner;

  const cachedIcons: Set<string> = new Set();

  beforeEach(() => {
    fs = new MockFileSystemAdapter();
    moduleResolver = new MockModuleResolver();
    logger = new MockLogger();

    config = {
      srcGlob: 'src/**/*.{html,ts}',
      outDir: 'src/assets/icons',
      iconRegex: /<ng-icon[^>]*name=["']([^"']+)["']/g,
      iconMap: {
        hero: '@ng-icons/heroicons',
        fa: '@ng-icons/font-awesome',
      },
      verbose: false,
      watchMode: false,
      ignoreMissingIcons: false,
    };

    scanner = new IconScanner(fs, moduleResolver, logger, cachedIcons);

    // Setup test modules
    moduleResolver.setModule('@ng-icons/heroicons', {
      heroHome: '<svg>home icon</svg>',
      heroUser: '<svg>user icon</svg>',
    });

    moduleResolver.setModule('@ng-icons/font-awesome', {
      faHeart: '<svg>heart icon</svg>',
    });
  });

  describe('basic functionality', () => {
    it('should scan files and extract icon names', async () => {
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );

      const result = await scanner.scanAndCopy(config);

      expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      expect(result.errors).toEqual([]);
    });

    it('should write icon files to output directory', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(config);

      console.log(fs.getWrittenFiles());
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
      expect(fs.getFile('src/assets/icons/heroHome.svg')).toBe('<svg>home icon</svg>');
    });

    it('should handle missing packages gracefully', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="unknownIcon"></ng-icon>');
      config.ignoreMissingIcons = true;

      const result = await scanner.scanAndCopy(config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Package "unknown" not found');
      expect(logger.getErrors()).toHaveLength(1);
    });

    it('should handle missing packages when not ignoring', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="unknownIcon"></ng-icon>');
      config.ignoreMissingIcons = false;

      const result = await scanner.scanAndCopy(config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Package "unknown" not found');
      expect(logger.getErrors()).toHaveLength(1);
    });

    it('should handle missing icons in packages', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroMissing"></ng-icon>');
      config.ignoreMissingIcons = true;

      const result = await scanner.scanAndCopy(config);

      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]).toContain('Icon "heroMissing" not found');
    });
  });

  describe('watch mode', () => {
    beforeEach(() => {
      config.watchMode = true;
    });

    it('should cache icons on first run', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(config);
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

      // Clear filesystem but keep scanner with cache
      fs.clear();
      fs.setFile(
        'src/app/component.html',
        `
     <ng-icon name="heroHome"></ng-icon>
     <ng-icon name="heroUser"></ng-icon>
     `,
      );

      const result = await scanner.scanAndCopy(config);

      // Should not write again since it's cached
      expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(false);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });

    it('should add new icons incrementally', async () => {
      // First run with one icon
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      await scanner.scanAndCopy(config);

      // Second run with additional icon
      fs.setFile(
        'src/app/component.html',
        `
        <ng-icon name="heroHome"></ng-icon>
        <ng-icon name="heroUser"></ng-icon>
      `,
      );

      await scanner.scanAndCopy(config);

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
      await scanner.scanAndCopy(config);

      // Second run with only one icon
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(config);

      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(false);
    });
  });

  describe('verbose mode', () => {
    beforeEach(() => {
      config.verbose = true;
    });

    it('should log used icons when verbose', async () => {
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(config);

      const logs = logger.getLogs();
      expect(logs.some((log) => log.includes('📦 Used icons: heroHome'))).toBe(true);
      expect(logs.some((log) => log.includes('✔ Wrote heroHome.svg'))).toBe(true);
    });

    it('should log diff in watch mode', async () => {
      config.watchMode = true;

      // First run
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');
      await scanner.scanAndCopy(config);

      logger.clear();

      // Second run with changes
      fs.setFile('src/app/component.html', '<ng-icon name="heroUser"></ng-icon>');
      await scanner.scanAndCopy(config);

      const logs = logger.getLogs();
      expect(logs.some((log) => log.includes('🔁 Diff — add: 1, remove: 1'))).toBe(true);
      expect(logs.some((log) => log.includes('🗑 Removed heroHome.svg'))).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty files', async () => {
      fs.setFile('src/app/component.html', '');

      const result = await scanner.scanAndCopy(config);

      expect(result.usedIcons.size).toBe(0);
      expect(result.errors).toEqual([]);
    });

    it('should handle files with no icons', async () => {
      fs.setFile('src/app/component.html', '<div>No icons here</div>');

      const result = await scanner.scanAndCopy(config);

      expect(result.usedIcons.size).toBe(0);
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

      const result = await scanner.scanAndCopy(config);

      expect(result.usedIcons).toEqual(new Set(['heroHome']));
      expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
    });

    it('should reset cache when requested', async () => {
      config.watchMode = true;
      fs.setFile('src/app/component.html', '<ng-icon name="heroHome"></ng-icon>');

      await scanner.scanAndCopy(config);
      scanner.resetCache();

      // Should behave like first run again
      fs.setFile('src/app/component.html', '<ng-icon name="heroUser"></ng-icon>');
      await scanner.scanAndCopy(config);

      expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
    });
  });

  describe('comment-based icon detection', () => {
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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons).toEqual(new Set(['bootstrapCircle', 'heroFeather']));
      });

      it('should extract icons from nested comments', async () => {
        fs.setFile(
          'src/app/component.ts',
          `
        /**
         * Component for displaying icons
         *
         * i(heroHome, heroUser)
         *
         * @example
         * <my-component></my-component>
         */
      `,
        );

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      });
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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'faHeart']));
      });

      it('should extract single icon from HTML comment', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser']));
      });

      it('should write all detected icons to output', async () => {
        fs.setFile('src/app/component.ts', '/* i(heroHome) */');

        fs.setFile('src/app/component.html', '<!-- i(heroUser) -->');

        await scanner.scanAndCopy(config);

        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
      });
    });

    describe('edge cases', () => {
      it('should ignore empty i() calls', async () => {
        fs.setFile('src/app/component.html', '<!-- i() -->');

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons.size).toBe(0);
      });

      it('should handle comments with no i() calls', async () => {
        fs.setFile('src/app/component.html', '<!-- This is just a comment -->');

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

        // Should only find icons in actual comments
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

        const result = await scanner.scanAndCopy(config);

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

        const result = await scanner.scanAndCopy(config);

        expect(result.usedIcons).toEqual(new Set(['heroHome', 'heroUser', 'heroSettings']));
      });
    });

    describe('watch mode with comments', () => {
      beforeEach(() => {
        config.watchMode = true;
      });

      it('should detect comment-based icons in watch mode', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');

        await scanner.scanAndCopy(config);

        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);

        fs.clear();
        fs.setFile('src/app/component.html', '<!-- i(heroHome, heroUser) -->');

        await scanner.scanAndCopy(config);

        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(true);
      });

      it('should handle removal of comment-based icons', async () => {
        fs.setFile('src/app/component.html', '<!-- i(heroHome, heroUser) -->');

        await scanner.scanAndCopy(config);

        fs.setFile('src/app/component.html', '<!-- i(heroHome) -->');

        await scanner.scanAndCopy(config);

        expect(fs.hasFile('src/assets/icons/heroHome.svg')).toBe(true);
        expect(fs.hasFile('src/assets/icons/heroUser.svg')).toBe(false);
      });
    });
  });
});
