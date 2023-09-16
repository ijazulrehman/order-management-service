import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

const APP_PORT = 3030;
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Order Management API Documentation')
    .setDescription(
      'This page provides the documentation for all the APIs that this project has',
    )
    .setVersion('1.0')
    .addTag('order-management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(APP_PORT, () => {
    const serverUrl = `http://localhost:${APP_PORT}`;
    const swaggerUrl = `http://localhost:${APP_PORT}/swagger`;
    Logger.log(`Server is running at ${serverUrl}`);
    Logger.log(`Swagger documentation is available at ${swaggerUrl}`);
  });
}

bootstrap();
