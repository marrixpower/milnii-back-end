import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { UserDocument } from 'src/user/entity/user';

import { FavoriteService } from './favorite.service';

@Injectable()
export class FavoriteEventHandler {
  constructor(private readonly favoriteService: FavoriteService) {}

  @OnEvent(EventsEnum.USER_DELETED)
  async onUserDeleted(data: { user: UserDocument }) {
    this.favoriteService.onUserDeleted(new Types.ObjectId(data.user._id));
  }
}

