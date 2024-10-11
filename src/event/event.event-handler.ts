import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { UserDocument } from 'src/user/entity/user';

import { EventService } from './event.service';

@Injectable()
export class EventEventHandler {
  constructor(private readonly eventService: EventService) {}

  @OnEvent(EventsEnum.USER_WEDDING_CREATED)
  async onUserWedding(data: { weddingDate: Date; user: string }) {
    this.eventService.onUserWedding(data);
  }

  @OnEvent(EventsEnum.USER_DELETED)
  async onUserDeleted(data: { user: UserDocument }) {
    this.eventService.onUserDeleted(new Types.ObjectId(data.user._id));
  }
}
