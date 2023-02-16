import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';
import { appConfig } from './config/app';
import { database } from './config/database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { exposedHeaders: ['filename'], origin: '*' },
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(json({ limit: '50mb' }));
  const PORT = 3001;
  console.log({ PORT, appConfig, database });
  await app.listen(PORT, () => {
    console.log(`server started at ${PORT}`);
  });
}
bootstrap();
