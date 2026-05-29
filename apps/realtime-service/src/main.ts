import { NestFactory } from '@nestjs/core';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('realtime-service');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3005, '0.0.0.0');
  logger.info('Real-time Service listening on port 3005');
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start Real-time Service');
  process.exit(1);
});
