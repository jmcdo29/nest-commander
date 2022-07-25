import { Command, CommandRunner } from 'nest-commander';

@Command({ name: 'plug' })
export class PluginCommand extends CommandRunner {
  async run() {
    console.log('This is from the plugin!');
  }
}
