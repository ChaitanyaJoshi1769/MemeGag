import { NestFactory } from '@nestjs/core';
import config from '@memegag/config';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('feed-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3001, '0.0.0.0');
  logger.info('Feed Service listening on port 3001');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Feed Service');
  process.exit(1);
});
