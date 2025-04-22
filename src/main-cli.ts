import 'dotenv/config';
import { CommandFactory } from 'nest-commander';
import { CommandModule } from './commands/command.module';

async function bootstrap() {
  await CommandFactory.run(CommandModule, ['warn', 'error']);
}

void bootstrap();
