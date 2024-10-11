import { ApiHideProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class SearchGuestGroupDto {
  @ApiHideProperty()
  @IsOptional()
  owner?: Types.ObjectId;
}
