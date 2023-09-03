const metaKeyBuilder = (suffix: string): string => {
  return `CommandBuilder:${suffix}`;
};

const questionMetaBuilder = (suffix: string): string => {
  return metaKeyBuilder(`Question:${suffix}`);
};

export const CommandMeta = metaKeyBuilder('Command:Meta');
export const SubCommandMeta = metaKeyBuilder('Subcommand:Meta');
export const RootCommandMeta = metaKeyBuilder('RootCommand:Meta');
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
export const cliPluginError = (
  cliName = 'nest-commander',
  pluginsAvailable = true,
) => {
  return pluginsAvailable
    ? ''
    : `${cliName} is expecting a configuration file, but didn't find one. Are you in the right directory?`;
};

export const COMPLETION_SH_TEMPLATE = `###-begin-{{app_name}}-completions-###
#
# nest commander command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.bashrc
#    or {{app_path}} {{completion_command}} >> ~/.bash_profile on OSX.
#
_{{app_name}}_nest_commander_completions()
{
    local cur_word args type_list

    cur_word="\${COMP_WORDS[COMP_CWORD]}"
    args=("\${COMP_WORDS[@]}")

    # ask nest commander to generate completions.
    type_list=$({{app_path}} completion "\${args[@]}")

    COMPREPLY=( $(compgen -W "\${type_list}" -- \${cur_word}) )

    # if no match was found, fall back to filename completion
    if [ \${#COMPREPLY[@]} -eq 0 ]; then
      COMPREPLY=()
    fi

    return 0
}
complete -o bashdefault -o default -F _{{app_name}}_nest_commander_completions {{app_name}} completion
###-end-{{app_name}}-completions-###
`;

export const COMPLETION_ZSH_TEMPLATE = `#compdef {{app_name}}
###-begin-{{app_name}}-completions-###
#
# nest commander command completion script
#
# Installation: {{app_path}} {{completion_command}} >> ~/.zshrc
#    or {{app_path}} {{completion_command}} >> ~/.zprofile on OSX.
#
_{{app_name}}_nest_commander_completions()
{
  local reply
  local si=$IFS
  IFS=$'\n' reply=($(COMP_CWORD="$((CURRENT-1))" COMP_LINE="$BUFFER" COMP_POINT="$CURSOR" {{app_path}} completion "\${words[@]}"))
  IFS=$si
  _describe 'values' reply
}
compdef _{{app_name}}_nest_commander_completions {{app_name}}
###-end-{{app_name}}-completions-###
`;
