import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['cobertura', 'html'],
      reportsDirectory: '../../coverage/libs/ng-icons-manager',
    },
    environment: 'node',
    globals: true,
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'],
    passWithNoTests: true,
  },
});
