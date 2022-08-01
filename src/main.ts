import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

// const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // //set session
  // app.use(cookieSession({
  //   keys: ['9ergkje5rnjgk1']
  // }));

  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true //added properties will be deleted if not needed
  // }));

  const config = new DocumentBuilder()
    .setTitle('Cars example')
    .setDescription('nestjs course project')
    .setVersion('1.0')
    .addTag('cars')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}

bootstrap();
