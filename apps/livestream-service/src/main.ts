import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('livestream-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3010, '0.0.0.0');
  logger.info('Livestream Service listening on port 3010');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Livestream Service');
  process.exit(1);
});
