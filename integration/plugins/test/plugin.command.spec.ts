import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { FooModule } from '../src/foo.module';

describe('Plugin Command Runner', () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });
  it('should run foo from the main module', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'foo.command.js'), 'phooey'];
    await CommandFactory.run(FooModule);
    expect(processSpy).toBeCalledWith('Foo!');
  });
  it('should allow for plugins to be ran too', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'plugin.command.js'), 'plug'];
    jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, '..'));
    await CommandFactory.run(FooModule, { usePlugins: true });
    expect(processSpy).toBeCalledWith('This is from the plugin!');
  });
  it('should allow for custom config file name', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'plugin.command.js'), 'plug'];
    jest.spyOn(process, 'cwd').mockReturnValue(join(__dirname, '..'));
    await CommandFactory.run(FooModule, { usePlugins: true, cliName: 'custom-name' });
    expect(processSpy).toBeCalledWith('This is from the plugin!');
  });
  it('should write a message about not being able to find the config', async () => {
    const processSpy = jest.spyOn(process.stderr, 'write');
    const exit = process.exit;
    const exitStub = jest.fn();
    process.exit = exitStub as any;
    process.argv = [process.argv0, join(__dirname, 'plugin.command.js'), 'foo'];
    await CommandFactory.run(FooModule, { usePlugins: true });
    expect(exitStub).toBeCalledWith(1);
    expect(processSpy).toBeCalledWith(
      expect.stringContaining(
        'nest-commander is expecting to use plugins, but no configuration file for plugins found. Are you in the right directory?',
      ),
    );
    process.exit = exit;
  });
});
