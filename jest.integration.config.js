const baseConfig = require('./jest.config');
module.exports = {
  ...baseConfig,
  testMatch: ['<rootDir>/integration/**/*.spec.ts'],
  collectCoverage: true,
  verbose: true,
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleNameMapper: {
    '^nest-commander$': ['<rootDir>/packages/nest-commander/src'],
    '^nest-commander-testing$': ['<rootDir>/packages/nest-commander-testing/src'],
  },
};
