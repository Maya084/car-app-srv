import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    ReportsModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'), //creates db.squlite or test.squlite in root directory
          entities: [User, Report],
          synchronize: true, //no migrations needed; DONT USE IN PRODUCTION; can delete stuff
        }
      }
    })
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite', //creates db.squlite in root directory
    //   entities: [User, Report],
    //   synchronize: true, //no migrations needed; DONT USE IN PRODUCTION; can delete stuff
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true //added properties will be deleted if not needed
      })
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      //set session
      cookieSession({
        keys: ['9ergkje5rnjgk1']
      })
    ).forRoutes('*')
  }
}
