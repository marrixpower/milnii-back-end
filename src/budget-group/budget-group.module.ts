import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BudgetGroupController } from './budget-group.controller';
import { BudgetGroupEventHandler } from './budget-group.event-handler';
import { BudgetGroupService } from './budget-group.service';
import { BudgetGroup, BudgetGroupSchema } from './entity/budget-group';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BudgetGroup.name,
        schema: BudgetGroupSchema,
      },
    ]),
  ],
  controllers: [BudgetGroupController],
  providers: [BudgetGroupService, BudgetGroupEventHandler],
})
export class BudgetGroupModule {}
