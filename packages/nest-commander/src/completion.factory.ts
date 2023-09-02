/* eslint-disable @typescript-eslint/ban-ts-comment */
import { addCompletionSpecCommand } from '@fig/complete-commander';
import { INestApplicationContext } from '@nestjs/common';
import { Command } from 'commander';
import { CompletionFactoryOptions } from './completion.factory.interface';
import {
  Commander,
  COMPLETION_SH_TEMPLATE,
  COMPLETION_ZSH_TEMPLATE,
} from './constants';

/**
 * @description Factory to generate completion script for BASH and ZSH
 */
export class CompletionFactory {
  /**
   * @description Register the completion command for either Bash, ZSH or Fig
   * @usage
   * ### Fig completion
   * Applying new command to generate the completion spec
   * @see https://fig.io/docs/guides/private-autocomplete
   *
   * @see https://fig.io/docs/guides/autocomplete-for-internal-tools
   *
   * ### Bash & ZSH completion
   * Put this script in your .bashrc or .zshrc
   * ```bash
   * source <(YOUR-CLI-NAMESPACE completion-script)
   * ```
   * @param options - {@link CompletionFactoryOptions}
   */
  static async registerCompletionCommand(
    app: INestApplicationContext,
    options: CompletionFactoryOptions,
  ) {
    const commander = app.get<Command>(Commander);
    const parsedOptions = CompletionFactory.getOptions(options);
    const { cmd } = parsedOptions;
    if (!cmd) {
      throw new Error('cmd is required');
    }

    if (parsedOptions.nativeShell) {
      const { executablePath } = parsedOptions.nativeShell;
      CompletionFactory.setupNativeShellCompletion(
        commander,
        cmd,
        executablePath,
      );
    }

    if (parsedOptions.fig) {
      addCompletionSpecCommand(commander);
    }
  }

  protected static getOptions(
    options: CompletionFactoryOptions,
  ): CompletionFactoryOptions {
    const parsedOptions: CompletionFactoryOptions = {
      fig: false,
      nativeShell: false,
      ...options,
    };

    return parsedOptions;
  }

  protected static setupNativeShellCompletion(
    commander: Command,
    cmd: string,
    executablePath: string,
  ) {
    const isZsh = process.env.SHELL?.includes('zsh') ?? false;
    const script = CompletionFactory.generateCompletionScript(
      executablePath,
      cmd,
      cmd,
      isZsh,
    );

    const completionScriptCommand = new Command()
      .command('completion-script', { hidden: true })
      .action(() => {
        console.log(script);
      });

    const completionCommand = new Command()
      .command('completion', { hidden: true })
      .action(() => {
        // @ts-expect-error - _prepareUserArgs is not a public property
        const _prepareUserArgs = commander._prepareUserArgs(process.argv);
        const parsed = commander.parseOptions(_prepareUserArgs);
        const { operands } = parsed;
        const filteredOperands = operands.filter(
          (operand) => !['completion', cmd].includes(operand),
        );

        const [firstCommandName, ...restOperands] = filteredOperands;

        const firstCommand =
          // @ts-expect-error - _findCommand is not a public property
          commander._findCommand(firstCommandName) ?? commander;

        const lastKnownCommand: Command | null = restOperands.reduce(
          (acc, operand) => {
            // @ts-expect-error - _findCommand is not a public property
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
      // @ts-expect-error - _hidden is not a public property
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
