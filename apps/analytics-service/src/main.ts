import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('analytics-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3009, '0.0.0.0');
  logger.info('Analytics Service listening on port 3009');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Analytics Service');
  process.exit(1);
});
