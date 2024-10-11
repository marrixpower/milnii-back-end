import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class SearchBudgetGroupDto {
  @ApiHideProperty()
  @IsOptional()
  owner?: Types.ObjectId;
}
