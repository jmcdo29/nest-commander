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
  Source,
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
import { CommonOptions } from './common-options.interface';

export class CommonSchematicFactory<T extends CommonOptions = CommonOptions> {
  templatePath = './files';
  type = 'service';
  metadata = 'providers';
  create(options: T): Rule {
    options = this.transform(options);
    return branchAndMerge(
      chain([
        mergeSourceRoot(options),
        this.addDeclarationToModule(options),
        mergeWith(this.generate(options)),
      ]),
    );
  }
  generate(options: T): Source {
    return (context: SchematicContext) =>
      apply(url(join(this.templatePath as Path)), [
        options.spec
          ? noop()
          : filter((path: string) => !path.endsWith('.spec.ts')),
        applyTemplates({
          ...strings,
          ...options,
          lowercase: (str: string) => str.toLowerCase(),
        }),
        move(options.path ?? ''),
      ])(context);
  }
  addDeclarationToModule(options: T): Rule {
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
      tree.overwrite(
        options.module,
        declarator.declare(content, options as DeclarationOptions),
      );
      return tree;
    };
  }

  transform(source: T): T {
    const target: T = Object.assign({}, source);
    target.metadata = this.metadata;
    target.type = this.type;

    if (target.name === null || target.name === undefined) {
      throw new SchematicsException('Option (name) is required.');
    }
    const location: Location = new NameParser().parse(target);
    target.name = strings.dasherize(location.name);
    target.path = strings.dasherize(location.path);

    target.path = target.flat
      ? target.path
      : join(target.path as Path, target.name);
    return target;
  }
}
