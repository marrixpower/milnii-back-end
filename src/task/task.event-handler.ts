import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { UserDocument } from 'src/user/entity/user';

import { TaskService } from './task.service';

@Injectable()
export class TaskEventHandler {
  constructor(private readonly taskService: TaskService) {}

  @OnEvent(EventsEnum.USER_WEDDING_CREATED)
  async onUserWedding(data: { weddingDate: Date; user: string }) {
    this.taskService.onUserWedding(data);
  }

  @OnEvent(EventsEnum.USER_DELETED)
  async onUserDeleted(data: { user: UserDocument }) {
    this.taskService.onUserDeleted(new Types.ObjectId(data.user._id));
  }
}
