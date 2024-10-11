import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { toDate } from 'src/common/transform';

import { TaskDateEnum } from '../enum/task-date.enum';
import { TaskStatusEnum } from '../enum/task.enum';

export class SearchTaskDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  user?: Types.ObjectId;

  @ApiProperty({ type: String, isArray: true, enum: TaskStatusEnum })
  @IsOptional()
  @IsEnum(TaskStatusEnum, { each: true })
  @IsArray()
  status?: TaskStatusEnum[];

  @IsDate()
  @ApiProperty()
  @IsOptional()
  @Transform(toDate)
  activeAfterHb?: Date;

  @IsDate()
  @ApiProperty()
  @Transform(toDate)
  @IsOptional()
  activeAfterLb?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String, isArray: true, enum: TaskDateEnum })
  @IsOptional()
  @IsEnum(TaskDateEnum, { each: true })
  @IsArray()
  dateType?: TaskDateEnum[];
}
