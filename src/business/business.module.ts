import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SequenceFactory } from 'src/common/util/mongo-auto-increment';

import { BusinessAdminController } from './business.admin.controller';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { Business, BusinessSchema } from './entity/business';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Business.name,
        useFactory: async (connection: Connection) => {
          const schema = BusinessSchema;
          const autoIncrement = new SequenceFactory(connection, {
            field: 'increment',
          });
          schema.plugin(autoIncrement.plugin.bind(autoIncrement));
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [BusinessController, BusinessAdminController],
  providers: [BusinessService],
  exports: [BusinessService],
})
export class BusinessModule {}

