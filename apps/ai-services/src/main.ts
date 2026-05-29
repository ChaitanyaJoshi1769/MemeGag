import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('ai-services');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3006, '0.0.0.0');
  logger.info('AI Services listening on port 3006');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start AI Services');
  process.exit(1);
});
