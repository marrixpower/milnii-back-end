import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AdminService } from './admin.service';
import { Admin, AdminSchema } from './entity/admin';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
  ],
  controllers: [],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
