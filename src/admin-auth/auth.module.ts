import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminModule } from 'src/admin/admin.module';

import { AdminAuthController } from './auth.controller';
import { AdminAuthService } from './auth.service';
import { AdminSession, AdminSessionSchema } from './entity/admin-session';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: AdminSession.name, schema: AdminSessionSchema },
    ]),
    AdminModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService, JwtService],
  exports: [JwtService],
})
export class AdminAuthModule {}
