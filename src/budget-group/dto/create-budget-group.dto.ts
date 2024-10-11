import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBudgetGroupDto {
  @ApiHideProperty()
  @IsOptional()
  owner: Types.ObjectId;

  @ApiProperty()
  @IsString()
  name: string;
}
