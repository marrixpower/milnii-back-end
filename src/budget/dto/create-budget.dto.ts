import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

import { toObjectId } from 'src/common/transform';

import { BudgetStatusEnum } from '../enum/budget-status.enum';

export class CreateBudgetDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  estimatedCost: number;

  @ApiProperty()
  @IsNumber()
  finalCost: number;

  @ApiProperty()
  @IsString()
  note: string;

  @ApiProperty({ type: String })
  @Transform(toObjectId)
  @IsDefined()
  group: Types.ObjectId;

  @ApiProperty({ enum: BudgetStatusEnum })
  @IsEnum(BudgetStatusEnum)
  @IsString()
  @IsOptional()
  status?: BudgetStatusEnum;
}
