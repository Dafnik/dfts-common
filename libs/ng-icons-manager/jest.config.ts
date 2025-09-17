export default {
  displayName: 'ng-icons-manager',
  coverageDirectory: '../../coverage/libs/ng-icons-manager',
  coverageReporters: ['cobertura', 'html'],
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
