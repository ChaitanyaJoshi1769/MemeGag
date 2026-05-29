import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('media-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3008, '0.0.0.0');
  logger.info('Media Service listening on port 3008');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Media Service');
  process.exit(1);
});
