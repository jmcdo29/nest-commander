import { CommandFactory } from 'nest-commander';
import { join } from 'path';
import { FooModule } from '../src/foo.module';

describe('Plugin Command Runner', () => {
  it('should run foo from the main module', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'foo.command.js'), 'phooey'];
    await CommandFactory.run(FooModule);
    expect(processSpy).toBeCalledWith('Foo!');
  });
  it('should allow for plugins to be ran too', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'plugin.command.js'), 'plug'];
    await CommandFactory.run(FooModule, { usePlugins: true });
    expect(processSpy).toBeCalledWith('This is from the plugin!');
  });
  it('should allow for custom config file name', async () => {
    const processSpy = jest.spyOn(console, 'log');
    process.argv = [process.argv[0], join(__dirname, 'plugin.command.js'), 'plug'];
    await CommandFactory.run(FooModule, { usePlugins: true, cliName: 'custom-name' });
    expect(processSpy).toBeCalledWith('This is from the plugin!');
  });
});
