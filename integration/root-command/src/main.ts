import { CommandFactory } from 'nest-commander';
import { RootCommandModule } from './root-command.module';

const bootstrap = async () => {
  await CommandFactory.run(RootCommandModule);
};

bootstrap();
