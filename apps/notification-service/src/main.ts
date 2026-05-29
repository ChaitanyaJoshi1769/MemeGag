import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('notification-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3004, '0.0.0.0');
  logger.info('Notification Service listening on port 3004');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Notification Service');
  process.exit(1);
});
