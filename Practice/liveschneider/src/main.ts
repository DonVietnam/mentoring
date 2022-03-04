import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { GlobalExceptionFilter } from './miscellaneous/exception-filters/global-exception-filter';
import { AppLoggerService } from './miscellaneous/app-logger/app-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);
  const loggerService = app.get<AppLoggerService>(AppLoggerService);
  app.useGlobalFilters(new GlobalExceptionFilter(loggerService));

  setupSwagger(app);
  setupGlobalPipes(app);

  const port = configService.get('PORT');
  await app.listen(port);
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Xsolla Accelerator API')
    .setDescription('Xsolla Accelerator REST API documentation')
    .setVersion('1.0.0')
    .addTag('XsollaAcceleratorApi')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
}

function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}

bootstrap();
