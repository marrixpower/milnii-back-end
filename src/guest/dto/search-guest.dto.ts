import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

import { GuestStatusEnum } from '../enum/status.enum';

export class SearchGuestDto {
  @ApiProperty({ type: String })
  @IsOptional()
  owner?: Types.ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ enum: GuestStatusEnum })
  @IsOptional()
  @IsString()
  @IsEnum(GuestStatusEnum)
  status?: GuestStatusEnum;
}
