import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

import { toDate } from 'src/common/transform';

import { TaskDateEnum } from '../enum/task-date.enum';

export class CreateTaskDto {
  @ApiHideProperty()
  @IsOptional()
  user: Types.ObjectId;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({})
  @IsString()
  description: string;

  @ApiProperty({})
  @IsOptional()
  @IsNumber()
  budget: number;

  @ApiProperty({})
  @IsOptional()
  @IsString()
  budgetName: string;

  @ApiProperty({ enum: TaskDateEnum, type: String })
  @IsOptional()
  @IsString()
  @IsEnum(TaskDateEnum)
  dateType: TaskDateEnum;

  @ApiProperty()
  @IsOptional()
  @Transform(toDate)
  @IsDate()
  activeAfter: Date;
}
