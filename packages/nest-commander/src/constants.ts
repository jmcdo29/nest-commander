function metaKeyBuilder(suffix: string): string {
  return `CommandBuilder:${suffix}`;
}

function questionMetaBuilder(suffix: string): string {
  return metaKeyBuilder(`Question:${suffix}`);
}

export const CommandMeta = metaKeyBuilder('Command:Meta');
export const OptionMeta = metaKeyBuilder('Option:Meta');
export const QuestionSetMeta = metaKeyBuilder('QuestionSet:Meta');
export const QuestionMeta = questionMetaBuilder('Meta');
export const ValidateMeta = questionMetaBuilder('Validate');
export const TransformMeta = questionMetaBuilder('Transform');
export const WhenMeta = questionMetaBuilder('When');
export const Commander = Symbol('Commander');
export const Inquirer = Symbol('Inquirer');
