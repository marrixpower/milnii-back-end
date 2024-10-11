import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { SequenceFactory } from 'src/common/util/mongo-auto-increment';

import { Task, TaskSchema } from './entity/task';
import { TaskController } from './task.controller';
import { TaskEventHandler } from './task.event-handler';
import { TaskService } from './task.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Task.name,
        useFactory: async (connection: Connection) => {
          const schema = TaskSchema;
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
  controllers: [TaskController],
  providers: [TaskService, TaskEventHandler],
})
export class TaskModule {}
