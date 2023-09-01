/* eslint-disable @typescript-eslint/ban-ts-comment */
import { INestApplicationContext } from '@nestjs/common';
import { Command } from 'commander';
import {
  Commander,
  COMPLETION_SH_TEMPLATE,
  COMPLETION_ZSH_TEMPLATE,
} from './constants';

/**
 * @description Factory to generate completion script for bash and zsh
 */
export class CompletionFactory {
  /**
   * @description Register the completion command in order to have bash and zsh completion
   * @usage
   * Put this script in your .bashrc or .zshrc
   * ```bash
   * source <(YOUR-CLI-NAMESPACE completion-script)
   * ```
   * @param app - Nest application context
   * @param cmd - Your cli namespace
   * @param executablePath - The path to the executable of your cli
   */
  static async registerCompletionCommand(
    app: INestApplicationContext,
    cmd: string,
    executablePath: string,
  ) {
    const commander = app.get<Command>(Commander);

    const isZsh = process.env.SHELL?.includes('zsh') ?? false;
    const script = CompletionFactory.generateCompletionScript(
      executablePath,
      cmd,
      cmd,
      isZsh,
    );

    const completionScriptCommand = new Command()
      .command('completion-script', { hidden: true })
      .action(async () => {
        console.log(script);
      });

    const completionCommand = new Command()
      .command('completion', { hidden: true })
      .action(async () => {
        // @ts-ignore
        const _prepareUserArgs = commander._prepareUserArgs(process.argv);
        const parsed = commander.parseOptions(_prepareUserArgs);
        const { operands } = parsed;
        const filteredOperands = operands.filter(
          (operand) => !['completion', cmd].includes(operand),
        );

        const [firstCommandName, ...restOperands] = filteredOperands;

        const firstCommand =
          // @ts-ignore
          commander._findCommand(firstCommandName) ?? commander;

        const lastKnownCommand: Command | null = restOperands.reduce(
          (acc, operand) => {
            // @ts-ignore
            return acc?._findCommand(operand) ?? acc;
          },
          firstCommand as Command,
        );

        const completions = CompletionFactory.getCompletion(lastKnownCommand);
        console.log(completions.join('\n'));
      });

    commander.addCommand(completionCommand);
    commander.addCommand(completionScriptCommand);
  }

  protected static generateCompletionScript(
    executablePath: string,
    cliName: string,
    command: string,
    isZsh: boolean,
  ): string {
    let scriptTemplate: string = isZsh
      ? COMPLETION_ZSH_TEMPLATE
      : COMPLETION_SH_TEMPLATE;

    // apply ./ execution prefix if the executable path is a js file
    if (executablePath.match(/\.js$/)) {
      executablePath = `./${executablePath}`;
    }

    scriptTemplate = scriptTemplate.replace(/{{app_name}}/g, cliName);
    scriptTemplate = scriptTemplate.replace(/{{completion_command}}/g, command);
    scriptTemplate = scriptTemplate.replace(/{{app_path}}/g, executablePath);
    return scriptTemplate;
  }

  protected static defaultCompletion(command: Command | null): string[] {
    const completions: string[] = [];

    if (!command) {
      return [];
    }

    CompletionFactory.commandCompletions(completions, command);
    CompletionFactory.optionCompletions(completions, command);

    return completions;
  }

  protected static commandCompletions(completions: string[], command: Command) {
    const { commands } = command;

    for (const subcommand of commands) {
      // @ts-ignore
      if (subcommand._hidden) {
        continue;
      }
      completions.push(subcommand.name());
    }
  }

  protected static optionCompletions(completions: string[], command: Command) {
    const { options } = command;
    for (const option of options) {
      if (option.hidden) {
        continue;
      }

      const key = option.long ?? option.short;
      if (!key) {
        continue;
      }

      completions.push(key);
    }
  }

  protected static getCompletion(command: Command): string[] {
    const defaultCompletion = CompletionFactory.defaultCompletion(command);
    const unique = new Set([...defaultCompletion, '--help']);
    const res = Array.from(unique);
    return res;
  }
}
