import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'plug' })
export class PluginCommand implements CommandRunner {
  async run () {
    console.log('This is from the file referenced plugin!');
  }
}
