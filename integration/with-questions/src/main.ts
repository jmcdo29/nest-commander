import { CommandFactory } from 'nest-commander';
import { HelloCommandModule } from './root.module';

async function bootstrap() {
  process.stdin.push('Jay\n');
  await CommandFactory.run(HelloCommandModule);
}

bootstrap();
