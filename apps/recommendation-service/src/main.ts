import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('recommendation-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3011, '0.0.0.0');
  logger.info('Recommendation Service listening on port 3011');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Recommendation Service');
  process.exit(1);
});
