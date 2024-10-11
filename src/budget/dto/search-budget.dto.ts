import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { BudgetStatusEnum } from '../enum/budget-status.enum';

export class SearchBudgetDto {
  @ApiProperty({ type: String })
  @IsOptional()
  owner?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: BudgetStatusEnum })
  @IsOptional()
  @IsString()
  @IsEnum(BudgetStatusEnum)
  status?: BudgetStatusEnum;
}
