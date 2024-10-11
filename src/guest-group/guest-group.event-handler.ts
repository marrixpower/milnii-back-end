import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { UserDocument } from 'src/user/entity/user';

import { GuestGroupService } from './guest-group.service';

@Injectable()
export class GuestGroupEventHandler {
  constructor(private readonly guestGroupService: GuestGroupService) {}

  @OnEvent(EventsEnum.USER_WEDDING_CREATED)
  async onUserWedding(data: { weddingDate: Date; user: string }) {
    this.guestGroupService.onUserWedding(data);
  }
  @OnEvent(EventsEnum.USER_DELETED)
  async onUserDeleted(data: { user: UserDocument }) {
    this.guestGroupService.onUserDeleted(new Types.ObjectId(data.user._id));
  }
}
