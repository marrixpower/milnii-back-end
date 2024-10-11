import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SequenceFactory } from 'src/common/util/mongo-auto-increment';

import { CategoryAdminController } from './category.admin.controller';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { Category, CategorySchema } from './entity/category';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Category.name,
        useFactory: async (connection: Connection) => {
          const schema = CategorySchema;
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
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}

