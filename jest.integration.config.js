const baseConfig = require('./jest.config');
module.exports = {
  ...baseConfig,
  testRegex: 'integration/.*.spec.ts$',
  collectCoverage: false,
  verbose: true,
};
