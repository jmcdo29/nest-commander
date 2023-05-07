import { restore, stubMethod } from 'hanbi';
import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { suite } from 'uvu';
import { equal, match, not } from 'uvu/assert';
import { FooModule } from '../src/foo.module';

const setArgv = (command: string, file = 'plugin.command.js') => {
  process.argv = [process.argv0, join(__dirname, file), command];
};

export const PluginSuite = suite('Plugin Command Suite');
PluginSuite.after.each(() => {
  restore();
});
PluginSuite('command from the main module should work', async () => {
  const logSpy = stubMethod(console, 'log');
  setArgv('phooey', 'foo.command.js');
  await CommandFactory.run(FooModule);
  equal(logSpy.firstCall?.args[0], 'Foo!');
  logSpy.restore();
});
PluginSuite('command from the plugin module should be available', async () => {
  const logSpy = stubMethod(console, 'log');
  setArgv('plug');
  const cwdSpy = stubMethod(process, 'cwd');
  cwdSpy.returns(join(__dirname, '..'));
  await CommandFactory.run(FooModule, { usePlugins: true });
  equal(logSpy.firstCall?.args[0], 'This is from the plugin!');
  logSpy.restore();
});
PluginSuite('a custom config file should be allowed', async () => {
  const logSpy = stubMethod(console, 'log');
  setArgv('plug');
  const cwdSpy = stubMethod(process, 'cwd');
  cwdSpy.returns(join(__dirname, '..'));
  await CommandFactory.run(FooModule, {
    usePlugins: true,
    cliName: 'custom-name',
  });
  equal(logSpy.firstCall?.args[0], 'This is from the plugin!');
  logSpy.restore();
});
/**
 * Cosmiconfig uses `process.cwd()` as a basis for a search directory to find the config files
 * during tests, `process.cwd()` results in ~/ which doesn't have the config files, so we set it
 * to result to ~/integration/plugins so that the configuration files can be found. If the config
 * file is not found, there will be an error about it. If the config file is found, but the command
 * requested is not a known command, there will be an error, but not about the config file, it will
 * just be assumed to be an unknown command
 */
PluginSuite(
  'an error message should be written about not finding the config file',
  async () => {
    const errSpy = stubMethod(process.stderr, 'write');
    const exitSpy = stubMethod(process, 'exit');
    setArgv('foo');
    try {
      await CommandFactory.run(FooModule, { usePlugins: true });
    } finally {
      equal(exitSpy.firstCall?.args[0], 1);
      match(
        errSpy.getCall(1).args[0].toString() ?? '',
        "nest-commander is expecting a configuration file, but didn't find one. Are you in the right directory?",
      );
    }
  },
);
PluginSuite(
  'an error message should be shown for the unknown command, but not about a missing config file',
  async () => {
    const errSpy = stubMethod(process.stderr, 'write');
    const exitSpy = stubMethod(process, 'exit');
    setArgv('bar');
    const cwdSpy = stubMethod(process, 'cwd');
    cwdSpy.returns(join(__dirname, '..'));
    try {
      await CommandFactory.run(FooModule, { usePlugins: true });
    } finally {
      console.log(errSpy);
      equal(exitSpy.firstCall?.args[0], 1);
      not.match(
        errSpy.firstCall?.args[0].toString() ?? '',
        "nest-commander is expecting a configuration file, but didn't find one. Are you in the right directory?",
      );
    }
  },
);
