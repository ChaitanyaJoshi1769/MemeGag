import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('moderation-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3002, '0.0.0.0');
  logger.info('Moderation Service listening on port 3002');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Moderation Service');
  process.exit(1);
});
