import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
  };
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  const https = await NestFactory.create(AppModule, {
    httpsOptions,
    logger: ['error', 'warn', 'debug', 'log', 'verbose'],
  });
  https.enableCors();
  https.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await https.listen(443);
  console.log(`Application is running on: ${await https.getUrl()}`);
}
bootstrap();
