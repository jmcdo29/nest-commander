const metaKeyBuilder = (suffix: string): string => {
  return `CommandBuilder:${suffix}`;
};

const questionMetaBuilder = (suffix: string): string => {
  return metaKeyBuilder(`Question:${suffix}`);
};

export const CommandMeta = metaKeyBuilder('Command:Meta');
export const SubCommandMeta = metaKeyBuilder('Subcommand:Meta');
export const OptionMeta = metaKeyBuilder('Option:Meta');
export const OptionChoiceMeta = metaKeyBuilder('OptionChoice:Meta');
export const QuestionSetMeta = metaKeyBuilder('QuestionSet:Meta');
export const QuestionMeta = questionMetaBuilder('Meta');
export const ValidateMeta = questionMetaBuilder('Validate');
export const TransformMeta = questionMetaBuilder('Transform');
export const WhenMeta = questionMetaBuilder('When');
export const ChoicesMeta = questionMetaBuilder('Choices');
export const DefaultMeta = questionMetaBuilder('Default');
export const MessageMeta = questionMetaBuilder('Message');
export const Commander = Symbol('Commander');
export const CommanderOptions = Symbol('CommanderOptions');
export const Inquirer = Symbol('Inquirer');
export const HelpMeta = metaKeyBuilder('Command:Help');
export const cliPluginError = (cliName = 'nest-commander', pluginsAvailable = true) => {
  return pluginsAvailable
    ? ''
    : `${cliName} is expecting a configuration file, but didn't find one. Are you in the right directory?`;
};
