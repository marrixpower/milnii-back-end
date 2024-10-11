import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Types } from 'mongoose';

import { EventsEnum } from 'src/common/enum/events.enum';
import { UserDocument } from 'src/user/entity/user';

import { BudgetGroupService } from './budget-group.service';

@Injectable()
export class BudgetGroupEventHandler {
  constructor(private readonly budgetGroupService: BudgetGroupService) {}

  @OnEvent(EventsEnum.USER_WEDDING_CREATED)
  async onUserWedding(data: { weddingDate: Date; user: string }) {
    this.budgetGroupService.onUserWedding(data);
  }

  @OnEvent(EventsEnum.USER_DELETED)
  async onUserDeleted(data: { user: UserDocument }) {
    this.budgetGroupService.onUserDeleted(new Types.ObjectId(data.user._id));
  }
}
