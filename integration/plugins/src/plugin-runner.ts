import { CommandFactory } from 'nest-commander';
import { FooModule } from './foo.module';

const bootstrap = async () => {
  await CommandFactory.run(FooModule, {
    // usePlugins: true,
  });
};

bootstrap();
