import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import config from '@memegag/config';
import { getLogger } from '@memegag/logger';
import { AppModule } from './app.module';

const logger = getLogger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  // Security
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: config.CORS_ORIGIN.split(','),
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('MemeGag API')
    .setDescription('The MemeGag API documentation')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('http://localhost:3000', 'Development')
    .addServer('https://api.memegag.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Start server
  await app.listen(config.API_PORT, config.API_HOST);

  logger.info(
    `MemeGag API Gateway listening on http://${config.API_HOST}:${config.API_PORT}`
  );
  logger.info(
    `API documentation available at http://${config.API_HOST}:${config.API_PORT}/api/docs`
  );
}

bootstrap().catch((error) => {
  logger.error(error, 'Failed to start application');
  process.exit(1);
});
