import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SequenceFactory } from 'src/common/util/mongo-auto-increment';

import { Support, SupportSchema } from './entity/support';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Support.name,
        useFactory: async (connection: Connection) => {
          const schema = SupportSchema;
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
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
