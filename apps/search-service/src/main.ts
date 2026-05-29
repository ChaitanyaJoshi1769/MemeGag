import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('search-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3003, '0.0.0.0');
  logger.info('Search Service listening on port 3003');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Search Service');
  process.exit(1);
});
