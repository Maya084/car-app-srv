import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //set session
  app.use(cookieSession({
    keys: ['9ergkje5rnjgk1']
  }));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true //added properties will be deleted if not needed
  }));
  await app.listen(3000);
}

bootstrap();
