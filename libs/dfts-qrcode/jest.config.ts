/* eslint-disable */
export default {
  displayName: 'dfts-qrcode',
  coverageDirectory: '../../coverage/libs/dfts-qrcode',
  coverageReporters: ['cobertura', 'html'],
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
