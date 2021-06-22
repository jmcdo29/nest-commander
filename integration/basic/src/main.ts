import { CommandFactory } from '@nest-commander/nest-commander';
import { RootModule } from './root.module';

const bootstrap = async () => {
  await CommandFactory.run(RootModule);
};

bootstrap();
