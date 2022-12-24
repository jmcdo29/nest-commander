import { BasicFactorySuite } from './basic/test/basic.command.factory.spec';
import {
  BooleanCommandSuite,
  NumberCommandSuite,
  StringCommandSuite,
  UnknownCommandSuite,
} from './basic/test/basic.command.spec';
import { DotCommandSuite } from './dot-command/test/dot.command.spec';
import { HelpSuite } from './help-tests/test/help.spec';
import { MultipleCommandSuite } from './multiple/test/multiple.command.spec';
import { OptionChoiceSuite } from './option-choices/test/option-choices.spec';
import { PizzaSuite } from './pizza/test/pizza.command.spec';
import { PluginSuite } from './plugins/test/plugin.command.spec';
import { SubCommandSuite } from './sub-commands/test/sub-commands.spec';
import { ThisCommandHandlerSuite } from './this-command/test/this-command.command.spec';
import { ThisOptionHandlerSuite } from './this-handler/test/this-handler.command.spec';
import { SetQuestionSuite } from './with-questions/test/hello.command.spec';
import { RegisterWithSubCommandsSuite } from './register-provider/test/register-with-subcommands.spec';

BasicFactorySuite.run();
StringCommandSuite.run();
NumberCommandSuite.run();
BooleanCommandSuite.run();
UnknownCommandSuite.run();
HelpSuite.run();
MultipleCommandSuite.run();
PizzaSuite.run();
PluginSuite.run();
SubCommandSuite.run();
ThisCommandHandlerSuite.run();
ThisOptionHandlerSuite.run();
SetQuestionSuite.run();
OptionChoiceSuite.run();
DotCommandSuite.run();
RegisterWithSubCommandsSuite.run();
