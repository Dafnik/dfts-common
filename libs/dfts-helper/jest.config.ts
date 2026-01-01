module.exports = {
  displayName: 'dfts-helper',
  coverageDirectory: '../../coverage/libs/dfts-helper',
  coverageReporters: ['cobertura', 'html'],
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
