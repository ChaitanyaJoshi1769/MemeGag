import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('creator-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3007, '0.0.0.0');
  logger.info('Creator Service listening on port 3007');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Creator Service');
  process.exit(1);
});
