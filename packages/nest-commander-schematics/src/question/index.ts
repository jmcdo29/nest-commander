import { Path, strings } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
} from '@angular-devkit/schematics';
import {
  DeclarationOptions,
  Location,
  mergeSourceRoot,
  ModuleDeclarator,
  ModuleFinder,
  NameParser,
} from '@nestjs/schematics';
import { join } from 'path';
import { QuestionOptions } from './question-options.interface';

export function question(options: QuestionOptions): Rule {
  options = transform(options);
  return branchAndMerge(
    chain([
      mergeSourceRoot(options),
      addDeclarationToModule(options),
      mergeWith(generate(options)),
    ]),
  );
}

function generate(options: QuestionOptions) {
  const templatePath = './files';
  return (context: SchematicContext) =>
    apply(url(join(templatePath as Path)), [
      options.spec ? noop() : filter((path: string) => !path.endsWith('.spec.ts')),
      applyTemplates({
        ...strings,
        ...options,
        lowercase: (str: string) => str.toLowerCase(),
      }),
      move(options.path ?? ''),
    ])(context);
}

function addDeclarationToModule(options: QuestionOptions): Rule {
  return (tree: Tree) => {
    options.module = new ModuleFinder(tree).find({
      name: options.name,
      path: options.path as Path,
    });
    if (options.module === undefined || options.module === null) {
      return tree;
    }
    const rawContent = tree.read(options.module);
    const content = rawContent?.toString() ?? '';
    const declarator: ModuleDeclarator = new ModuleDeclarator();
    tree.overwrite(options.module, declarator.declare(content, options as DeclarationOptions));
    return tree;
  };
}

function transform(source: QuestionOptions): QuestionOptions {
  const target: QuestionOptions = Object.assign({}, source);
  target.metadata = 'providers';
  target.type = 'questions';

  if (target.name === null || target.name === undefined) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);

  target.path = target.flat ? target.path : join(target.path as Path, target.name);
  return target;
}
