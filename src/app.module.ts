import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FirebaseModule } from 'firebasemodule';

import { AdminModule } from './admin/admin.module';
import { AdminAuthModule } from './admin-auth/auth.module';
import { BudgetModule } from './budget/budget.module';
import { BudgetGroupModule } from './budget-group/budget-group.module';
import { BusinessModule } from './business/business.module';
import { CategoryModule } from './category/category.module';
import { LogExceptionFilter } from './common/filter/http-exception-filter';
import { EventModule } from './event/event.module';
import { FavoriteModule } from './favorite/favorite.module';
import { GuestModule } from './guest/guest.module';
import { GuestGroupModule } from './guest-group/guest-group.module';
import { NoteModule } from './note/note.module';
import { SupportModule } from './support/support.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.local.env', '.dev.env'],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DB_URI'),
        autoIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: configService.get<string>('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    FirebaseModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        configService.get<string>('FB_CONFIG'),
    }),
    UserModule,
    BusinessModule,
    SupportModule,
    TaskModule,
    FavoriteModule,
    CategoryModule,
    GuestGroupModule,
    GuestModule,
    EventModule,
    NoteModule,
    BudgetModule,
    BudgetGroupModule,
    AdminAuthModule,
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LogExceptionFilter,
    },
  ],
})
export class AppModule {}
