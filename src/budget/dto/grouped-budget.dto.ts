import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';

import { BudgetGroup } from 'src/budget-group/entity/budget-group';

import { Budget } from '../entity/budget';

export class GroupedBudgetDto {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @ApiProperty()
  budget: Budget[];

  @ApiProperty()
  estimatedCost: number;

  @ApiProperty()
  finalCost: number;

  @ApiProperty()
  group: BudgetGroup;
}

