import { CommandFactory } from 'nest-commander';
import { RootModule } from './root.module';

const bootstrap = async () => {
  await CommandFactory.run(RootModule, {
    errorHandler: (err) => {
      console.log(err.message);
      process.exit(0);
    },
  });
};

bootstrap();
